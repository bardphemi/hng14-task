// third-party libraires
import httpStatus from "http-status";

// handler
import { sendResponse } from "../responseHandler";


// test suite
describe("sendResponse", () => {
  it("sends success response", () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as any;

    sendResponse(res, httpStatus.OK, "OK", { ok: true });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      status: "success",
      message: "OK",
      data: { ok: true },
    });
  });
});
