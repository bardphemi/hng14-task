// third-party libraries
import { randomUUID } from "node:crypto";

// service and dao imports
import profileService from "../profile.service";
import classifyService from "../../classify/classify.service";
import profileDao from "../profile.dao";

jest.mock("node:crypto", () => ({
  randomUUID: jest.fn(),
}));

jest.mock("../../classify/classify.service", () => ({
  __esModule: true,
  default: {
    predictGender: jest.fn(),
  },
}));

jest.mock("../profile.dao", () => ({
  __esModule: true,
  default: {
    createOrGetProfile: jest.fn(),
  },
}));

// suite
describe("profileService.createProfile", () => {
  beforeEach(() => {
    (randomUUID as jest.Mock).mockReset();
    (classifyService.predictGender as jest.Mock).mockReset();
    (profileDao.createOrGetProfile as jest.Mock).mockReset();
  });
  it("generates an id and persists an assembled profile payload", async () => {
    (randomUUID as jest.Mock).mockReturnValueOnce(
      "4ea9b35c-8b53-4a4d-bf77-e6a702875d70"
    );
    (classifyService.predictGender as jest.Mock).mockResolvedValueOnce({
      gender: "female",
      sample_size: 120,
      probability: 0.88,
    });
    jest.spyOn(profileService, "getAge").mockResolvedValueOnce({
      age: 24,
      age_group: "adult",
    });
    jest.spyOn(profileService, "getNationality").mockResolvedValueOnce({
      country_id: "NG",
      country_probability: 0.73,
    });
    (profileDao.createOrGetProfile as jest.Mock).mockResolvedValueOnce({
      id: "4ea9b35c-8b53-4a4d-bf77-e6a702875d70",
      name: "anna",
    });

    await profileService.createProfile("anna");

    expect(profileDao.createOrGetProfile).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "4ea9b35c-8b53-4a4d-bf77-e6a702875d70",
        name: "anna",
        gender: "female",
        gender_probability: 0.88,
        sample_size: 120,
        age: 24,
        age_group: "adult",
        country_id: "NG",
        country_probability: 0.73,
      })
    );

  });
});
