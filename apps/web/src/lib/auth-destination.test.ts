import { describe, expect, it } from "vitest";
import { buildLoginUrl } from "@tcg/auth-client";
import {
  authDestination,
  authQuery,
  destinationPath,
} from "../../../public-web/src/lib/auth-destination";

describe("authentication destinations", () => {
  it("defaults to the public site and only accepts the collector identifier", () => {
    expect(authDestination(null)).toBe("public");
    expect(authDestination("https://example.com")).toBe("public");
    expect(authDestination("collector")).toBe("collector");
    expect(destinationPath("public", null)).toBe("/");
    expect(destinationPath("collector", null)).toBe("/dashboard");
  });
  it("rejects external and browser-normalized paths", () => {
    for (const path of [
      "https://evil.example",
      "//evil.example",
      "/\\evil.example",
      "/\nevil.example",
    ]) {
      expect(destinationPath("public", path)).toBe("/");
      expect(destinationPath("collector", path)).toBe("/dashboard");
    }
  });
  it("preserves a collector destination and relative path through entry links", () => {
    const login = new URL(
      buildLoginUrl("https://shop.example", "/dashboard?tab=cards"),
    );
    expect(login.searchParams.get("destination")).toBe("collector");
    expect(login.searchParams.get("returnTo")).toBe("/dashboard?tab=cards");
    expect(
      new URLSearchParams(authQuery("collector", "/dashboard?tab=cards")).get(
        "returnTo",
      ),
    ).toBe("/dashboard?tab=cards");
  });
});
