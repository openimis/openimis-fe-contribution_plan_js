import { describe, expect, it } from "vitest";

import { isBase64Encoded } from "./utils";

describe("isBase64Encoded", () => {
  it.each([
    ["a relay global id", btoa("BenefitPlanGQLType:3fa85f64-5717-4562-b3fc-2c963f66afa6")],
    ["a padded global id", btoa("ProductGQLType:7")],
    ["a numeric id, which decodeId passes through", "42"],
  ])("accepts %s", (_label, value) => {
    expect(isBase64Encoded(value)).toBe(true);
  });

  it.each([
    ["a hyphenated uuid", "3fa85f64-5717-4562-b3fc-2c963f66afa6"],
    ["an empty string", ""],
    ["text with spaces", "not encoded"],
    ["a url-safe base64 alphabet", "ab-_"],
  ])("rejects %s", (_label, value) => {
    expect(isBase64Encoded(value)).toBe(false);
  });
});
