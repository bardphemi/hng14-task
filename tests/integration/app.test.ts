// third-party libraries
import request from "supertest";
import nock from "nock";
import httpStatus from "http-status";

// exress app
import app from "../../src/app";

const BASE_URL = process.env.GENDERIZE_URL || "https://api.genderize.io";

// 
describe("integration: app", () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it("GET /health returns OK", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(httpStatus.OK);
    expect(res.body).toEqual({ message: "API is healthy" });
  });

  it("GET /api/classify returns prediction", async () => {
    nock(BASE_URL)
      .get("/")
      .query({ name: "anna" })
      .reply(httpStatus.OK, {
        name: "anna",
        gender: "female",
        probability: 0.9,
        count: 200,
      });
    const res = await request(app).get("/api/classify").query({ name: "anna" });
    expect(res.status).toBe(httpStatus.OK);
    expect(res.body.status).toBe("success");
    expect(res.body.data).toMatchObject({
      name: "anna",
      gender: "female",
      sample_size: 200,
      probability: 0.9,
      is_confident: true,
    });
    expect(typeof res.body.data.processed_at).toBe("string");
    expect(Number.isNaN(Date.parse(res.body.data.processed_at))).toBe(false);
  });

  it("GET /api/classify validates missing name", async () => {
    const res = await request(app).get("/api/classify");
    expect(res.status).toBe(httpStatus.BAD_REQUEST);
    expect(res.body).toEqual({
      status: "error",
      message: "Name query parameter is required",
    });
  });

  it("GET /api/classify validates numeric name", async () => {
    const res = await request(app).get("/api/classify").query({ name: "123" });
    expect(res.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
    expect(res.body).toEqual({
      status: "error",
      message: "Name query parameter must be a string",
    });
  });
});
