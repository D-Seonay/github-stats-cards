import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { calculateTrophies, fetchStreak } from "../src/github-fetcher";

describe("GitHub Fetcher Logic", () => {
  const mockStats = {
    name: "Test User",
    login: "testuser",
    totalStars: 600, // Diamond threshold is 1000, Platinum is 500
    totalCommits: 1200, // Gold is 1000
    totalPRs: 15, // Silver is 50, Bronze is < 50
    totalIssues: 5, // Bronze
    totalRepos: 10,
    contributedTo: 100, // Diamond is 100
    followers: 100,
    gists: 10,
  };

  it("should calculate correct trophy ranks", () => {
    const trophies = calculateTrophies(mockStats);

    const starsTrophy = trophies.find((t) => t.title === "Stars");
    expect(starsTrophy?.rank).toBe("PLATINUM");

    const commitsTrophy = trophies.find((t) => t.title === "Commits");
    expect(commitsTrophy?.rank).toBe("GOLD");

    const contribsTrophy = trophies.find((t) => t.title === "Contribs");
    expect(contribsTrophy?.rank).toBe("DIAMOND");
  });
});

describe("fetchStreak", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-28T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("returns startDate/endDate spanning the fetched calendar and a correct current streak", async () => {
    const days = [
      { date: "2026-07-26", contributionCount: 1 },
      { date: "2026-07-27", contributionCount: 1 },
      { date: "2026-07-28", contributionCount: 1 },
    ];

    global.fetch = vi.fn().mockResolvedValue({
      status: 200,
      ok: true,
      json: async () => ({
        data: {
          user: {
            name: "Test User",
            login: "testuser",
            contributionsCollection: {
              contributionCalendar: {
                totalContributions: 3,
                weeks: [{ contributionDays: days }],
              },
            },
          },
        },
      }),
    }) as any;

    const result = await fetchStreak("testuser");

    expect(result.startDate).toBe("2026-07-26");
    expect(result.endDate).toBe("2026-07-28");
    expect(result.currentStreak).toBe(3);
    expect(result.longestStreak).toBe(3);
    expect(result.totalContributions).toBe(3);
  });

  it("falls back to today for startDate/endDate when the calendar has no days", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      status: 200,
      ok: true,
      json: async () => ({
        data: {
          user: {
            name: "Test User",
            login: "testuser",
            contributionsCollection: {
              contributionCalendar: {
                totalContributions: 0,
                weeks: [],
              },
            },
          },
        },
      }),
    }) as any;

    const result = await fetchStreak("testuser");

    expect(result.startDate).toBe("2026-07-28");
    expect(result.endDate).toBe("2026-07-28");
    expect(result.currentStreak).toBe(0);
    expect(result.longestStreak).toBe(0);
  });
});
