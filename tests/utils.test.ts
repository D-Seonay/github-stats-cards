import { describe, it, expect } from "vitest";
import { minifySVG, formatDateRange } from "../src/utils";

describe("minifySVG", () => {
  it("should remove newlines and extra spaces", () => {
    const input = `
      <svg>
        <rect x="0" y="0" />
      </svg>
    `;
    const output = minifySVG(input);
    expect(output).toBe('<svg><rect x="0" y="0" /></svg>');
  });

  it("should trim leading and trailing whitespace", () => {
    const input = "   <svg></svg>   ";
    const output = minifySVG(input);
    expect(output).toBe("<svg></svg>");
  });
});

describe("formatDateRange", () => {
  it('formats an English date range as "Mon D, YYYY - Mon D, YYYY"', () => {
    expect(formatDateRange("2025-07-20", "2026-07-28", "en")).toBe(
      "Jul 20, 2025 - Jul 28, 2026",
    );
  });

  it("falls back to English formatting for an unknown locale", () => {
    expect(formatDateRange("2025-07-20", "2026-07-28", "xx")).toBe(
      "Jul 20, 2025 - Jul 28, 2026",
    );
  });

  it("defaults to English when no locale is passed", () => {
    expect(formatDateRange("2025-07-20", "2026-07-28")).toBe(
      "Jul 20, 2025 - Jul 28, 2026",
    );
  });

  it("produces a different formatted string for a different locale", () => {
    const en = formatDateRange("2025-07-20", "2026-07-28", "en");
    const fr = formatDateRange("2025-07-20", "2026-07-28", "fr");
    expect(fr).not.toBe(en);
    expect(fr).toContain("2025");
    expect(fr).toContain("2026");
  });
});
