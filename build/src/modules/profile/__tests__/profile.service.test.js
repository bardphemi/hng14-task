"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// third-party libraries
const node_crypto_1 = require("node:crypto");
// service and dao imports
const profile_service_1 = __importDefault(require("../profile.service"));
const classify_service_1 = __importDefault(require("../../classify/classify.service"));
const profile_dao_1 = __importDefault(require("../profile.dao"));
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
        node_crypto_1.randomUUID.mockReset();
        classify_service_1.default.predictGender.mockReset();
        profile_dao_1.default.createOrGetProfile.mockReset();
    });
    it("generates an id and persists an assembled profile payload", async () => {
        node_crypto_1.randomUUID.mockReturnValueOnce("4ea9b35c-8b53-4a4d-bf77-e6a702875d70");
        classify_service_1.default.predictGender.mockResolvedValueOnce({
            gender: "female",
            sample_size: 120,
            probability: 0.88,
        });
        jest.spyOn(profile_service_1.default, "getAge").mockResolvedValueOnce({
            age: 24,
            age_group: "adult",
        });
        jest.spyOn(profile_service_1.default, "getNationality").mockResolvedValueOnce({
            country_id: "NG",
            country_probability: 0.73,
        });
        profile_dao_1.default.createOrGetProfile.mockResolvedValueOnce({
            id: "4ea9b35c-8b53-4a4d-bf77-e6a702875d70",
            name: "anna",
        });
        await profile_service_1.default.createProfile("anna");
        expect(profile_dao_1.default.createOrGetProfile).toHaveBeenCalledWith(expect.objectContaining({
            id: "4ea9b35c-8b53-4a4d-bf77-e6a702875d70",
            name: "anna",
            gender: "female",
            gender_probability: 0.88,
            sample_size: 120,
            age: 24,
            age_group: "adult",
            country_id: "NG",
            country_probability: 0.73,
        }));
    });
});
