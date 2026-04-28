import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import httpStatus from "http-status";

import { authCheck, adminCheck } from "../handleAccess";
import { AppError } from "../../utils/appError";

jest.mock("jsonwebtoken", () => ({
  __esModule: true,
  default: {
    verify: jest.fn(),
  },
}));

describe("authCheck", () => {
  const req = {
    headers: {},
  } as unknown as Request;

  const res = {} as Response;
  const next = jest.fn() as NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_ACCESS_SECRET = "test-access-secret";
  });

  it("attaches user payload and calls next for a valid bearer token", () => {
    req.headers = {
      authorization: "Bearer valid-token",
    };

    (jwt.verify as jest.Mock).mockReturnValueOnce({
      userId: "user-1",
      role: "analyst",
    });

    authCheck(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith("valid-token", "test-access-secret");
    expect((req as any).user).toEqual({
      id: "user-1",
      role: "analyst",
    });
    expect(next).toHaveBeenCalledTimes(1);
  });

  it("throws unauthorized error when token is missing", () => {
    req.headers = {};

    expect(() => authCheck(req, res, next)).toThrow(AppError);
    expect(() => authCheck(req, res, next)).toThrow("Invalid or expired token");

    try {
      authCheck(req, res, next);
    } catch (error) {
      expect((error as AppError).statusCode).toBe(httpStatus.UNAUTHORIZED);
    }

    expect(next).not.toHaveBeenCalled();
  });

  it("throws unauthorized error when token verification fails", () => {
    req.headers = {
      authorization: "Bearer invalid-token",
    };

    (jwt.verify as jest.Mock).mockImplementationOnce(() => {
      throw new Error("jwt malformed");
    });

    expect(() => authCheck(req, res, next)).toThrow("Invalid or expired token");
    expect(next).not.toHaveBeenCalled();
  });
});

describe("adminCheck", () => {
  const req = {} as Request;
  const res = {} as Response;
  const next = jest.fn() as NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("throws unauthorized when req.user is not set", () => {
    (req as any).user = undefined;

    expect(() => adminCheck(req, res, next)).toThrow(AppError);

    try {
      adminCheck(req, res, next);
    } catch (error) {
      expect((error as AppError).message).toBe("Unauthorized");
      expect((error as AppError).statusCode).toBe(httpStatus.UNAUTHORIZED);
    }

    expect(next).not.toHaveBeenCalled();
  });

  it("throws forbidden when user is not admin", () => {
    (req as any).user = {
      id: "user-1",
      role: "analyst",
    };

    expect(() => adminCheck(req, res, next)).toThrow("Forbidden: Admins only");
    expect(next).not.toHaveBeenCalled();
  });

  it("calls next when user role is admin", () => {
    (req as any).user = {
      id: "user-2",
      role: "admin",
    };

    adminCheck(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
