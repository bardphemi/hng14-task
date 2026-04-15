"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// third-party libraires
const axios_1 = __importDefault(require("axios"));
const http_status_1 = __importDefault(require("http-status"));
// service import
const classify_service_1 = __importDefault(require("../classify.service"));
jest.mock("axios");
const mockedAxios = axios_1.default;
// test suite
describe("classifyService.predictGender", () => {
    beforeEach(() => {
        mockedAxios.get.mockReset();
    });
    it("throws when no prediction is available", async () => {
        mockedAxios.get.mockResolvedValueOnce({
            data: {
                name: "x",
                gender: null,
                probability: 0,
                count: 0,
            },
        });
        await expect(classify_service_1.default.predictGender("x")).rejects.toMatchObject({
            statusCode: http_status_1.default.INTERNAL_SERVER_ERROR,
        });
    });
    it("maps upstream error to 502", async () => {
        mockedAxios.get.mockRejectedValueOnce({ response: { status: 502 } });
        await expect(classify_service_1.default.predictGender("anna")).rejects.toMatchObject({
            statusCode: http_status_1.default.INTERNAL_SERVER_ERROR,
        });
    });
    it("maps unknown errors to 500", async () => {
        mockedAxios.get.mockRejectedValueOnce(new Error("Nope"));
        await expect(classify_service_1.default.predictGender("anna")).rejects.toMatchObject({
            statusCode: http_status_1.default.INTERNAL_SERVER_ERROR,
        });
    });
});
