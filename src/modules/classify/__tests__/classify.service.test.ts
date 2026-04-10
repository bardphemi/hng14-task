// third-party libraires
import axios from "axios";
import httpStatus from "http-status";

// service import
import classifyService from "../classify.service";

// utils
import { AppError } from "../../../utils/appError";

jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

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
    } as any);

    await expect(classifyService.predictGender("x")).rejects.toMatchObject({
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
    });
  });

  it("maps upstream error to 502", async () => {
    mockedAxios.get.mockRejectedValueOnce({ response: { status: 502 } });
    await expect(classifyService.predictGender("anna")).rejects.toMatchObject({
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
    });
  });

  it("maps unknown errors to 500", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("Nope"));

    await expect(classifyService.predictGender("anna")).rejects.toMatchObject({
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
    });
  });
});
