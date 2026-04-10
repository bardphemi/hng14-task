// util
import { AppError } from "../appError";

// test suite for AppError
describe("AppError", () => {
  it("sets statusCode and message", () => {
    const err = new AppError("Nope", 418);
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe("Nope");
    expect(err.statusCode).toBe(418);
  });
});
