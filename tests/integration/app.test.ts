// third-party libraries
import request from "supertest";
import nock from "nock";
import httpStatus from "http-status";

jest.mock("../../src/modules/profile/profile.service", () => ({
  __esModule: true,
  default: {
    fetchProfiles: jest.fn(),
    fetchProfileByName: jest.fn(),
    createProfile: jest.fn(),
  },
}));

// exress app
import app from "../../src/app";
import profileService from "../../src/modules/profile/profile.service";

const BASE_URL = process.env.GENDERIZE_URL || "https://api.genderize.io";

// 
describe("integration: app", () => {
  afterEach(() => {
    nock.cleanAll();
    jest.clearAllMocks();
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

  it("POST /api/profiles creates a new profile and returns success payload", async () => {
    (profileService.fetchProfileByName as jest.Mock).mockResolvedValueOnce(null);
    (profileService.createProfile as jest.Mock).mockResolvedValueOnce({
      id: "f7e5f6af-6f22-4c2b-9f0e-46cd935b0082",
      name: "anna",
      gender: "female",
      gender_probability: 0.9,
      sample_size: 200,
      age: 24,
      age_group: "adult",
      country_id: "NG",
      country_probability: 0.81,
      created_at: "2026-04-15T01:00:00.000Z",
    });

    const res = await request(app).post("/api/profiles").send({ name: "  ANNA " });

    expect(res.status).toBe(httpStatus.CREATED);
    expect(profileService.fetchProfileByName).toHaveBeenCalledWith("anna");
    expect(profileService.createProfile).toHaveBeenCalledWith("anna");
    expect(res.body.status).toBe("success");
    expect(res.body.message).toBe("Profile created successfully");
    expect(res.body.data).toMatchObject({
      id: "f7e5f6af-6f22-4c2b-9f0e-46cd935b0082",
      name: "anna",
      gender: "female",
      age_group: "adult",
      country_id: "NG",
    });
  });
});
