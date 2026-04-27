// third-party libraries
import httpStatus from "http-status";
import { randomUUID } from "node:crypto";

// db config
import { db } from "../../config/db";


// utils import(s)
import {
  generateAccessToken,
  generateRefreshToken,
  hashToken
} from "../../utils/authUtil";
import { axiosInstance } from "../../utils/axiosUtil";

// service import
import userService from "../user/user.service";
import authDao from "./auth.dao";
import { AppError } from "../../utils/appError";
import userDao from "../user/user.dao";

// constant(s)
const {
  GITHUB_USER_URL,
  GITHUB_AUTH_URL,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET
} = process.env;

// authentication service
const authService = {
  /**
   * @description uses code to fetch token from github
   * @param code 
   * @returns 
   */
  async exchangeCodeForToken(code: string) {
    const res = await axiosInstance.post(
      GITHUB_AUTH_URL!,
      {
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
      },
      {
        headers: { Accept: "application/json" },
      }
    );
    return res.data.access_token;
  },

  /**
   * @description fetch github user details
   * @param accessToken 
   * @returns 
   */
  async getGithubUser(accessToken: string) {
    const res = await axiosInstance.get(
      GITHUB_USER_URL!, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return res.data;
  },


  /**
   * @description 
   * @param code 
   */
  async handleGithubAuth(code: string) {
    const githubAccessToken = await this.exchangeCodeForToken(code);
    const githubUser = await this.getGithubUser(githubAccessToken);
    let user = await userService.fetchUserByGithubId(githubUser.id);
    if (!user) {
      const newUserDto = {
        id: randomUUID(),
        github_id: githubUser.id,
        username: githubUser.login,
        email: githubUser.email,
        avatar_url: githubUser.avatar_url,
      }
      user = await userService.addNewUser(newUserDto);
    }
    const accessToken = generateAccessToken({
      userId: user.id,
      role: user.role,
      roleId: user.role_id
    });
    const refreshToken = generateRefreshToken();
    const hashed = hashToken(refreshToken);
    const tokenPayload = {
      id: randomUUID(),
      user_id: user.id,
      token_hash: hashed,
      expires_at: new Date(Date.now() + 5 * 60 * 1000),
    }
    await authDao.saveRefreshToken(tokenPayload);
    return { user, accessToken, refreshToken };
  },

  /**
   * @description handles creating a new refersh token and invalidating the old one
   * @param refreshToken 
   * @returns 
   */
  async getRefreshToken(refreshToken: string) {
    return await db.transaction(async (trx) => {
      const hashed = hashToken(refreshToken);
      const tokenRecord = await authDao.fetchTokenRecord(hashed, trx);
      if (!tokenRecord) {
        throw new AppError(
          "Invalid refresh token",
          httpStatus.UNAUTHORIZED);
      }

      if (new Date(tokenRecord.expires_at) < new Date()) {
        await authDao.revokeTokenById(tokenRecord.id)
        throw new AppError("Refresh token expired", httpStatus.UNAUTHORIZED);
      }

      const user = await userDao.fetchUserDetailsForAuth(tokenRecord.user_id, trx);
      if (!user || !user.is_active) {
        throw new AppError("User not active", httpStatus.FORBIDDEN);
      }

      await authDao.revokeTokenById(tokenRecord.id, trx);
      const accessToken = generateAccessToken({
        userId: user.id,
        role: user.role,
        roleId: user.role_id
      });
      const newRefreshToken = generateRefreshToken();
      const newHashed = hashToken(newRefreshToken);
      await authDao.saveRefreshToken({
        id: randomUUID(),
        user_id: user.id,
        token_hash: newHashed,
        expires_at: new Date(Date.now() + 5 * 60 * 1000)
      })
      return {
        access_token: accessToken,
        refresh_token: newRefreshToken,
      };
    });
  },

  /**
   * @description handles user logout
   * @param userId 
   * @returns 
   */
  async logout(refreshToken: string) {
    const hashedToken = hashToken(refreshToken);
    await authDao.revokeToken(hashedToken);
    return true;
  }
};

export default authService;
