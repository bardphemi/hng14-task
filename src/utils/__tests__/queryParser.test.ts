import { parseSearchQuery } from "../queryParser";

describe("parseSearchQuery", () => {
  it("parses gender, age group, and country from text", () => {
    expect(parseSearchQuery("female adults in nigeria")).toEqual({
      gender: "female",
      age_group: "adult",
      country_id: "NG",
    });
  });

  it("parses age ranges from keyword and numeric constraints", () => {
    expect(parseSearchQuery("young guys in kenya above 20")).toEqual({
      gender: "male",
      country_id: "KE",
      min_age: 20,
      max_age: 24,
    });
  });

  it("parses explicit between range", () => {
    expect(parseSearchQuery("females in canada between 30 and 40")).toEqual({
      gender: "female",
      country_id: "CA",
      min_age: 30,
      max_age: 40,
    });
  });

  it("returns null when query has no recognized filters", () => {
    expect(parseSearchQuery("lorem ipsum dolor sit amet")).toBeNull();
  });
});
