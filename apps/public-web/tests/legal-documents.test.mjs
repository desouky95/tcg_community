import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { approvedLegalVersions, publishedLegalSlugs } from "../src/lib/legal/publication.ts";
import { legalDocument, legalSlug } from "../src/lib/legal/documents.ts";

describe("legal publication", () => {
  it("exposes no unapproved document", async () => {
    expect(legalSlug("privacy-policy")).toBe(true);
    expect(legalSlug("unknown")).toBe(false);
    expect(publishedLegalSlugs()).toEqual([]);
    expect(await legalDocument("privacy-policy", "en")).toBeNull();
  });

  it("renders both language drafts only in development preview", async () => {
    const old = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";
    try {
      const en = await legalDocument("privacy-policy", "en", true);
      const ar = await legalDocument("privacy-policy", "ar", true);
      expect(en?.title).toBe("Privacy Policy");
      expect(ar?.title).toBe("سياسة الخصوصية");
      expect(en?.sections.length).toBeGreaterThan(2);
      expect(ar?.sections.length).toBeGreaterThan(2);
    } finally {
      process.env.NODE_ENV = old;
    }
  });

  it("rejects drafts even when their version is entered as approved", async () => {
    approvedLegalVersions["privacy-policy"] = { version: "0.1", effectiveDate: "2026-11-27", lastUpdated: "2026-11-27" };
    try {
      expect(await legalDocument("privacy-policy", "en")).toBeNull();
      expect(await legalDocument("privacy-policy", "ar")).toBeNull();
      const old = process.env.NODE_ENV;
      process.env.NODE_ENV = "production";
      try { expect(await legalDocument("privacy-policy", "en", true)).toBeNull(); }
      finally { process.env.NODE_ENV = old; }
    } finally {
      delete approvedLegalVersions["privacy-policy"];
    }
  });
});
