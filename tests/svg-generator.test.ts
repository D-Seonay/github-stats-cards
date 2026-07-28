import { describe, it, expect } from "vitest";
import {
  generateStatsSVG,
  generateStreakSVG,
  calculateStreakRingPercent,
} from "../src/svg-generator";
import { themes } from "../src/themes";
import { locales } from "../src/locales";
import { StreakData } from "../src/github-fetcher";

describe("SVG Generator", () => {
  const mockData = {
    name: "Test User",
    login: "testuser",
    totalStars: 100,
    totalCommits: 500,
    totalPRs: 50,
    totalIssues: 25,
    totalRepos: 10,
    contributedTo: 5,
    followers: 100,
    gists: 10,
  };

  it("should generate a stats SVG containing the user name", () => {
    const svg = generateStatsSVG(mockData, themes.dark, locales.en);
    expect(svg).toContain("Test User");
    expect(svg).toContain("Total Stars:");
    expect(svg).toContain("100");
  });

  it("should apply theme colors correctly", () => {
    const theme = themes.dracula;
    const svg = generateStatsSVG(mockData, theme, locales.en);
    expect(svg).toContain(`#${theme.bg_color}`);
    expect(svg).toContain(`#${theme.title_color}`);
  });

  it("should support compact mode", () => {
    const svg = generateStatsSVG(mockData, themes.dark, locales.en, [], true);
    // Standard height is 195, compact should be smaller or different
    expect(svg).toContain('height="170"'); // 45 + 5 * 25 = 170
  });
});

describe("calculateStreakRingPercent", () => {
  it("returns 0 when there is no longest streak", () => {
    expect(calculateStreakRingPercent(0, 0)).toBe(0);
  });

  it("returns 1 when current equals longest", () => {
    expect(calculateStreakRingPercent(10, 10)).toBe(1);
  });

  it("returns the partial ratio otherwise", () => {
    expect(calculateStreakRingPercent(5, 10)).toBe(0.5);
  });

  it("clamps to 1 if current exceeds longest", () => {
    expect(calculateStreakRingPercent(15, 10)).toBe(1);
  });
});

describe("generateStreakSVG", () => {
  const mockStreak: StreakData = {
    name: "Test User",
    currentStreak: 5,
    longestStreak: 10,
    totalContributions: 200,
    startDate: "2025-07-20",
    endDate: "2026-07-28",
  };

  it("renders the flame badge and the divider line", () => {
    const svg = generateStreakSVG(mockStreak, themes.dark, locales.en);
    expect(svg).toContain("🔥");
    expect(svg).toContain("<line");
  });

  it("uses the theme's icon_color for the ring arc", () => {
    const svg = generateStreakSVG(mockStreak, themes.dracula, locales.en);
    expect(svg).toContain(`#${themes.dracula.icon_color}`);
  });

  it("renders a localized date range subtitle", () => {
    const svg = generateStreakSVG(
      mockStreak,
      themes.dark,
      locales.en,
      undefined,
      undefined,
      "en",
    );
    expect(svg).toContain("Jul 20, 2025 - Jul 28, 2026");
  });

  it("still renders the three existing stat values", () => {
    const svg = generateStreakSVG(mockStreak, themes.dark, locales.en);
    expect(svg).toContain(">5<");
    expect(svg).toContain(">10<");
    expect(svg).toContain(">200<");
  });
});
