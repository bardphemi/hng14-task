
// handler
import { asyncHandler } from "../asyncHandler";

// test suite
describe("asyncHandler", () => {
  it("passes errors to next", async () => {
    const err = new Error("boom");
    const handler = asyncHandler(async () => {
      throw err;
    });

    const next = jest.fn();
    await handler({} as any, {} as any, next);
    expect(next).toHaveBeenCalledWith(err);
  });
});
