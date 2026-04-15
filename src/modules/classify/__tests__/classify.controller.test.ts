import httpStatus from "http-status";
import classifyCtrl from "../classify.controller";
import { AppError } from "../../../utils/appError";
import classifyService from "../classify.service";
import { sendResponse } from "../../../middlewares/responseHandler";

jest.mock("../classify.service");
jest.mock("../../../middlewares/responseHandler", () => ({
  sendResponse: jest.fn(),
}));

describe("classifyCtrl.predictGender", () => {
  const res = {} as any;

  beforeEach(() => {
    (classifyService.predictGender as jest.Mock).mockReset();
    (sendResponse as jest.Mock).mockReset();
  });

  it("throws when name is missing", async () => {
    const req = { query: {} } as any;

    await expect(classifyCtrl.predictGender(req, res)).rejects.toBeInstanceOf(
      AppError
    );
    await expect(classifyCtrl.predictGender(req, res)).rejects.toMatchObject({
      statusCode: httpStatus.BAD_REQUEST,
    });
  });

  it("throws when name is numeric", async () => {
    const req = { query: { name: "123" } } as any;

    await expect(classifyCtrl.predictGender(req, res)).rejects.toMatchObject({
      statusCode: httpStatus.UNPROCESSABLE_ENTITY,
    });
  });

  it("calls service with formatted name and sends response", async () => {
    const req = { query: { name: "  ANNA " } } as any;
    (classifyService.predictGender as jest.Mock).mockResolvedValueOnce({
      name: "anna",
    });
    (sendResponse as jest.Mock).mockReturnValueOnce(res);

    await classifyCtrl.predictGender(req, res);

    expect(classifyService.predictGender).toHaveBeenCalledWith("anna");
    expect(sendResponse).toHaveBeenCalledWith(
      res,
      httpStatus.OK,
      "Gender prediction successful",
      expect.objectContaining({ name: "anna" })
    );
  });
});
