
// dao imports
import userDao from "./user.dao";

// interface
import { NewUser } from "./user.interface";

//
const userService = {
  /**
   * @description fetch a user by github id
   * @param githubId 
   * @returns 
   */
  async fetchUserByGithubId(githubId: string) {
    return await userDao.fetchUserByGithubId(githubId);
  },

  /**
   * @description creates a new user
   * @param userDto 
   */
  async addNewUser(userDto: NewUser) {
    return await userDao.createUser(userDto);
  }
};

export default userService;
