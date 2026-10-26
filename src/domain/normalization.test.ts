import { describe, expect, it } from "@jest/globals";
import { normalizeMerchant } from "./normalization";

describe("normalizeMerchant", () => {
  it("normalizes casing", () => {
    expect(
      normalizeMerchant("NETFLIX")
    ).toBe("netflix");
  });

  it("removes website domains", () => {
    expect(
      normalizeMerchant("NETFLIX.COM")
    ).toBe("netflix");
  });

  it("removes corporate suffixes", () => {
    expect(
      normalizeMerchant("Netflix Inc.")
    ).toBe("netflix");
  });

  it("normalizes equivalent merchant names", () => {
    expect(
      normalizeMerchant("NETFLIX.COM")
    ).toBe(
      normalizeMerchant("Netflix Inc.")
    );
  });
});