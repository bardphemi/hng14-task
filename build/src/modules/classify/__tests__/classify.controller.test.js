"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const classify_controller_1 = __importDefault(require("../classify.controller"));
const appError_1 = require("../../../utils/appError");
const classify_service_1 = __importDefault(require("../classify.service"));
const responseHandler_1 = require("../../../middlewares/responseHandler");
jest.mock("../classify.service");
jest.mock("../../../middlewares/responseHandler", () => ({
    sendResponse: jest.fn(),
}));
describe("classifyCtrl.predictGender", () => {
    const res = {};
    beforeEach(() => {
        classify_service_1.default.predictGender.mockReset();
        responseHandler_1.sendResponse.mockReset();
    });
    it("throws when name is missing", async () => {
        const req = { query: {} };
        await expect(classify_controller_1.default.predictGender(req, res)).rejects.toBeInstanceOf(appError_1.AppError);
        await expect(classify_controller_1.default.predictGender(req, res)).rejects.toMatchObject({
            statusCode: http_status_1.default.BAD_REQUEST,
        });
    });
    it("throws when name is numeric", async () => {
        const req = { query: { name: "123" } };
        await expect(classify_controller_1.default.predictGender(req, res)).rejects.toMatchObject({
            statusCode: http_status_1.default.UNPROCESSABLE_ENTITY,
        });
    });
    it("calls service with formatted name and sends response", async () => {
        const req = { query: { name: "  ANNA " } };
        classify_service_1.default.predictGender.mockResolvedValueOnce({
            name: "anna",
        });
        responseHandler_1.sendResponse.mockReturnValueOnce(res);
        await classify_controller_1.default.predictGender(req, res);
        expect(classify_service_1.default.predictGender).toHaveBeenCalledWith("anna");
        expect(responseHandler_1.sendResponse).toHaveBeenCalledWith(res, http_status_1.default.OK, "Gender prediction successful", expect.objectContaining({ name: "anna" }));
    });
});
