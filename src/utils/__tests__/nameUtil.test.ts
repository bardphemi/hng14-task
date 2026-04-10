// util import
import { getConfidence } from "../nameUtil";

// tests suite for getConfidence function
describe("getConfidence", () => {
  it("returns true when probability >= 0.7 and sample size >= 100", () => {
    expect(getConfidence(0.7, 100)).toBe(true);
    expect(getConfidence(0.9, 150)).toBe(true);
  });

  it("returns false when probability or sample size is below threshold", () => {
    expect(getConfidence(0.69, 100)).toBe(false);
    expect(getConfidence(0.7, 99)).toBe(false);
    expect(getConfidence(0.2, 10)).toBe(false);
  });
});
