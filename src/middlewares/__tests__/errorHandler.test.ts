// third-party libraries
import httpStatus from "http-status";

// util imports
import { globalErrorHandler } from "../errorHandler";
import { AppError } from "../../utils/appError";

jest.mock("../../utils/logger", () => ({
  __esModule: true,
  default: {
    error: jest.fn(),
  },
}));

// 
describe("globalErrorHandler", () => {
  it("handles AppError with provided status", () => {
    const err = new AppError("Bad", 400);
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as any;

    globalErrorHandler(err, {} as any, res, {} as any);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
      status: "error",
      message: "Bad",
    });
  });

  it("handles unknown error with 500", () => {
    const err = new Error("Boom");
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as any;

    globalErrorHandler(err, {} as any, res, {} as any);

    expect(res.status).toHaveBeenCalledWith(httpStatus.INTERNAL_SERVER_ERROR);
    expect(res.send).toHaveBeenCalledWith({
      status: "error",
      message: "Internal Server Error",
    });
  });
});
