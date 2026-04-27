// third-party libraries
import request from "supertest";
import nock from "nock";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";

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
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET as string;

const signAccessToken = (role: "admin" | "analyst" = "analyst") =>
  jwt.sign(
    {
      userId: "user-test-id",
      role,
      roleId: "role-test-id",
    },
    JWT_ACCESS_SECRET
  );

// 
describe("integration: app", () => {
  const analystToken = signAccessToken("analyst");
  const adminToken = signAccessToken("admin");

  afterEach(() => {
    nock.cleanAll();
    jest.clearAllMocks();
  });

  it("GET /health returns OK", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(httpStatus.OK);
    expect(res.body).toEqual({ message: "API is healthy" });
  });

  it("GET /api/classify requires authorization", async () => {
    const res = await request(app).get("/api/classify").query({ name: "anna" });
    expect(res.status).toBe(httpStatus.UNAUTHORIZED);
    expect(res.body).toEqual({
      status: "error",
      message: "Invalid or expired token",
    });
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
    const res = await request(app)
      .get("/api/classify")
      .set("Authorization", `Bearer ${analystToken}`)
      .query({ name: "anna" });
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
    const res = await request(app)
      .get("/api/classify")
      .set("Authorization", `Bearer ${analystToken}`);
    expect(res.status).toBe(httpStatus.BAD_REQUEST);
    expect(res.body).toEqual({
      status: "error",
      message: "Name query parameter is required",
    });
  });

  it("GET /api/classify validates numeric name", async () => {
    const res = await request(app)
      .get("/api/classify")
      .set("Authorization", `Bearer ${analystToken}`)
      .query({ name: "123" });
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

    const res = await request(app)
      .post("/api/profiles")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "  ANNA " });

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

  it("GET /api/profiles applies query filters and returns paginated payload", async () => {
    (profileService.fetchProfiles as jest.Mock).mockResolvedValueOnce({
      data: [
        {
          id: "f7e5f6af-6f22-4c2b-9f0e-46cd935b0082",
          name: "anna",
          gender: "female",
          age: 24,
          age_group: "adult",
          country_id: "NG",
        },
      ],
      total: 1,
      page: 2,
      limit: 1,
    });

    const res = await request(app)
      .get("/api/profiles")
      .set("Authorization", `Bearer ${analystToken}`)
      .query({
        gender: "female",
        country_id: "ng",
        min_age: "18",
        max_age: "40",
        page: "2",
        limit: "1",
      });

    expect(res.status).toBe(httpStatus.OK);
    expect(profileService.fetchProfiles).toHaveBeenCalledWith(
      expect.objectContaining({
        gender: "female",
        country_id: "NG",
        min_age: 18,
        max_age: 40,
        sort_by: "created_at",
        order: "desc",
        page: 2,
        limit: 1,
      })
    );
    expect(res.body.status).toBe("success");
    expect(res.body.message).toBe("Profiles fetched successfully");
    expect(res.body.total).toBe(1);
    expect(res.body.page).toBe(2);
    expect(res.body.limit).toBe(1);
    expect(res.body.data).toHaveLength(1);
  });

  it("GET /api/profiles returns validation error when min_age is greater than max_age", async () => {
    const res = await request(app)
      .get("/api/profiles")
      .set("Authorization", `Bearer ${analystToken}`)
      .query({ min_age: "30", max_age: "20" });

    expect(res.status).toBe(httpStatus.BAD_REQUEST);
    expect(res.body).toEqual({
      status: "error",
      message: "ValidationError: min_age cannot be greater than max_age",
    });
    expect(profileService.fetchProfiles).not.toHaveBeenCalled();
  });

  it("GET /api/profiles/search parses natural-language query and returns paginated payload", async () => {
    (profileService.fetchProfiles as jest.Mock).mockResolvedValueOnce({
      data: [
        {
          id: "f7e5f6af-6f22-4c2b-9f0e-46cd935b0082",
          name: "ada",
          gender: "female",
          age: 25,
          age_group: "adult",
          country_id: "NG",
        },
      ],
      total: 1,
      page: 2,
      limit: 1,
    });

    const res = await request(app)
      .get("/api/profiles/search")
      .set("Authorization", `Bearer ${analystToken}`)
      .query({
        q: "female adults in nigeria above 21",
        page: "2",
        limit: "1",
      });

    expect(res.status).toBe(httpStatus.OK);
    expect(profileService.fetchProfiles).toHaveBeenCalledWith({
      gender: "female",
      age_group: "adult",
      country_id: "NG",
      min_age: 21,
      page: 2,
      limit: 1,
    });
    expect(res.body.status).toBe("success");
    expect(res.body.message).toBe("Profiles fetched successfully");
    expect(res.body.total).toBe(1);
    expect(res.body.page).toBe(2);
    expect(res.body.limit).toBe(1);
    expect(res.body.data).toHaveLength(1);
  });

  it("GET /api/profiles/search validates malformed query params", async () => {
    const res = await request(app)
      .get("/api/profiles/search")
      .set("Authorization", `Bearer ${analystToken}`)
      .query({ q: "ab" });

    expect(res.status).toBe(httpStatus.BAD_REQUEST);
    expect(res.body).toEqual({
      status: "error",
      message: "ValidationError: Search query must be at least 3 characters",
    });
    expect(profileService.fetchProfiles).not.toHaveBeenCalled();
  });

  it("GET /api/profiles/search returns bad request when query cannot be interpreted", async () => {
    const res = await request(app)
      .get("/api/profiles/search")
      .set("Authorization", `Bearer ${analystToken}`)
      .query({ q: "lorem ipsum" });

    expect(res.status).toBe(httpStatus.BAD_REQUEST);
    expect(res.body).toEqual({
      status: "error",
      message: "Unable to interpret query",
    });
    expect(profileService.fetchProfiles).not.toHaveBeenCalled();
  });
});
