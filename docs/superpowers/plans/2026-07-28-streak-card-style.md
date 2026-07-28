# Contribution Streak Card Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the flat 3-numbers-in-a-row `/streak` card with a ring-and-flame-badge layout (current streak as a circular progress ring, longest streak + total contributions restyled alongside it, plus a localized date-range subtitle), per the approved spec.

**Architecture:** Pure-function changes in three existing modules — a new `formatDateRange` helper in `src/utils.ts`, two new fields (`startDate`/`endDate`) computed inside the existing `fetchStreak` in `src/github-fetcher.ts`, and a rewritten `generateStreakSVG` (plus a new exported `calculateStreakRingPercent` helper) in `src/svg-generator.ts`. `app/api/streak/route.ts` gets a one-line change to forward the `locale` it already parses. No new files, no new dependencies.

**Tech Stack:** TypeScript, Next.js route handlers, Vitest.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-07-28-streak-card-style-design.md`
- Card stays 495×195 — same footprint as every other card.
- No changes to any other card (`stats`, `top-langs`, `activity`, `top-repos`, `project`, `org`, `trophies`).
- No new `Translations` keys — the subtitle is a locale-formatted date string, not a translated label.
- Ring arc and flame badge color come from `theme.icon_color` (not hardcoded).
- Ring background track uses `stroke="#${text_color}"` with `stroke-opacity="0.15"` so it stays visible but subtle on every theme, including dark ones.
- Locale-to-`Intl` tag mapping: `en→en-US`, `fr→fr-FR`, `es→es-ES`, `de→de-DE`, `jp→ja-JP`, unknown falls back to `en-US`.

---

### Task 1: `formatDateRange` utility

**Files:**
- Modify: `src/utils.ts`
- Test: `tests/utils.test.ts`

**Interfaces:**
- Produces: `formatDateRange(startISO: string, endISO: string, locale?: string): string` — exported from `src/utils.ts`. `startISO`/`endISO` are `YYYY-MM-DD` strings. Returns e.g. `"Jul 20, 2025 - Jul 28, 2026"`.

- [ ] **Step 1: Write the failing tests**

Append to `tests/utils.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { minifySVG, formatDateRange } from '../src/utils';

describe('formatDateRange', () => {
  it('formats an English date range as "Mon D, YYYY - Mon D, YYYY"', () => {
    expect(formatDateRange('2025-07-20', '2026-07-28', 'en')).toBe('Jul 20, 2025 - Jul 28, 2026');
  });

  it('falls back to English formatting for an unknown locale', () => {
    expect(formatDateRange('2025-07-20', '2026-07-28', 'xx')).toBe('Jul 20, 2025 - Jul 28, 2026');
  });

  it('defaults to English when no locale is passed', () => {
    expect(formatDateRange('2025-07-20', '2026-07-28')).toBe('Jul 20, 2025 - Jul 28, 2026');
  });

  it('produces a different formatted string for a different locale', () => {
    const en = formatDateRange('2025-07-20', '2026-07-28', 'en');
    const fr = formatDateRange('2025-07-20', '2026-07-28', 'fr');
    expect(fr).not.toBe(en);
    expect(fr).toContain('2025');
    expect(fr).toContain('2026');
  });
});
```

(Note: replace the existing `import { minifySVG } from '../src/utils';` line at the top of the file with the combined import shown above — don't duplicate the import.)

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test -- tests/utils.test.ts`
Expected: FAIL — `formatDateRange is not a function` / module has no exported member `formatDateRange`.

- [ ] **Step 3: Implement `formatDateRange`**

Append to `src/utils.ts`:

```ts
const DATE_LOCALE_TAGS: Record<string, string> = {
  en: "en-US",
  fr: "fr-FR",
  es: "es-ES",
  de: "de-DE",
  jp: "ja-JP",
};

/**
 * Formats two ISO (YYYY-MM-DD) dates as a localized "start - end" range,
 * parsed as UTC so the calendar day doesn't shift with the server's timezone.
 */
export function formatDateRange(startISO: string, endISO: string, locale: string = "en"): string {
  const tag = DATE_LOCALE_TAGS[locale] || DATE_LOCALE_TAGS.en;
  const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" };

  const start = new Date(`${startISO}T00:00:00Z`).toLocaleDateString(tag, options);
  const end = new Date(`${endISO}T00:00:00Z`).toLocaleDateString(tag, options);

  return `${start} - ${end}`;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test -- tests/utils.test.ts`
Expected: PASS (6 tests: 2 existing `minifySVG` tests + 4 new `formatDateRange` tests, all green).

- [ ] **Step 5: Commit**

```bash
git add src/utils.ts tests/utils.test.ts
git commit -m "feat: add formatDateRange utility for localized date ranges"
```

---

### Task 2: `StreakData.startDate` / `endDate`

**Files:**
- Modify: `src/github-fetcher.ts` (interface at lines 29-34, `fetchStreak` return at lines 307-312)
- Test: `tests/github-fetcher.test.ts`

**Interfaces:**
- Consumes: nothing new.
- Produces: `StreakData` gains `startDate: string` and `endDate: string` (both `YYYY-MM-DD`). `fetchStreak(username: string): Promise<StreakData>` signature is unchanged, just returns two more fields.

- [ ] **Step 1: Write the failing test**

Add to `tests/github-fetcher.test.ts` (new imports and a new `describe` block; keep the existing `calculateTrophies` block untouched):

```ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { calculateTrophies, fetchStreak } from '../src/github-fetcher';

// ... existing describe('GitHub Fetcher Logic', ...) block stays as-is ...

describe('fetchStreak', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-28T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('returns startDate/endDate spanning the fetched calendar and a correct current streak', async () => {
    const days = [
      { date: '2026-07-26', contributionCount: 1 },
      { date: '2026-07-27', contributionCount: 1 },
      { date: '2026-07-28', contributionCount: 1 },
    ];

    global.fetch = vi.fn().mockResolvedValue({
      status: 200,
      ok: true,
      json: async () => ({
        data: {
          user: {
            name: 'Test User',
            login: 'testuser',
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

    const result = await fetchStreak('testuser');

    expect(result.startDate).toBe('2026-07-26');
    expect(result.endDate).toBe('2026-07-28');
    expect(result.currentStreak).toBe(3);
    expect(result.longestStreak).toBe(3);
    expect(result.totalContributions).toBe(3);
  });

  it('falls back to today for startDate/endDate when the calendar has no days', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      status: 200,
      ok: true,
      json: async () => ({
        data: {
          user: {
            name: 'Test User',
            login: 'testuser',
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

    const result = await fetchStreak('testuser');

    expect(result.startDate).toBe('2026-07-28');
    expect(result.endDate).toBe('2026-07-28');
    expect(result.currentStreak).toBe(0);
    expect(result.longestStreak).toBe(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- tests/github-fetcher.test.ts`
Expected: FAIL — `result.startDate` is `undefined`, not `'2026-07-26'`.

- [ ] **Step 3: Implement the fields**

In `src/github-fetcher.ts`, update the `StreakData` interface (currently lines 29-34):

```ts
export interface StreakData {
  name: string;
  currentStreak: number;
  longestStreak: number;
  totalContributions: number;
  startDate: string;
  endDate: string;
}
```

Then, in `fetchStreak`, update the final `return` statement (currently lines 307-312). The function already declares `const todayStr = new Date().toISOString().split('T')[0];` near the top (used for the current-streak calculation) and builds `chronologicalDays` (ascending-sorted) a few lines above the return for the `longestStreak` loop — reuse both directly, don't redeclare either:

```ts
  return {
    name: user.name || user.login,
    currentStreak,
    longestStreak,
    totalContributions: calendar.totalContributions,
    startDate: chronologicalDays[0]?.date ?? todayStr,
    endDate: chronologicalDays[chronologicalDays.length - 1]?.date ?? todayStr,
  };
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- tests/github-fetcher.test.ts`
Expected: PASS (3 tests: existing trophy test + 2 new `fetchStreak` tests).

- [ ] **Step 5: Commit**

```bash
git add src/github-fetcher.ts tests/github-fetcher.test.ts
git commit -m "feat: expose startDate/endDate on StreakData"
```

---

### Task 3: Ring + flame badge layout in `generateStreakSVG`

**Files:**
- Modify: `src/svg-generator.ts` (import at line 4, `generateStreakSVG` at lines 226-262)
- Test: `tests/svg-generator.test.ts`

**Interfaces:**
- Consumes: `formatDateRange(startISO, endISO, locale?)` from `./utils` (Task 1); `StreakData.startDate`/`endDate` (Task 2); `Theme.icon_color` (already defined in `src/themes.ts`, previously unused).
- Produces: `calculateStreakRingPercent(current: number, longest: number): number` (new export). `generateStreakSVG(data: StreakData, theme: Theme, translations: Translations, customCSS?: string, font?: string, locale?: string): string` — same first 5 params as before, with a new optional 6th `locale` param (defaults to `"en"`).

- [ ] **Step 1: Write the failing tests**

Add to `tests/svg-generator.test.ts` (add `StreakData` to the existing import from `'../src/github-fetcher'` if not already there, and add `generateStreakSVG, calculateStreakRingPercent` to the existing import from `'../src/svg-generator'`):

```ts
import { generateStatsSVG, generateStreakSVG, calculateStreakRingPercent } from '../src/svg-generator';
import { StreakData } from '../src/github-fetcher';

describe('calculateStreakRingPercent', () => {
  it('returns 0 when there is no longest streak', () => {
    expect(calculateStreakRingPercent(0, 0)).toBe(0);
  });

  it('returns 1 when current equals longest', () => {
    expect(calculateStreakRingPercent(10, 10)).toBe(1);
  });

  it('returns the partial ratio otherwise', () => {
    expect(calculateStreakRingPercent(5, 10)).toBe(0.5);
  });

  it('clamps to 1 if current exceeds longest', () => {
    expect(calculateStreakRingPercent(15, 10)).toBe(1);
  });
});

describe('generateStreakSVG', () => {
  const mockStreak: StreakData = {
    name: 'Test User',
    currentStreak: 5,
    longestStreak: 10,
    totalContributions: 200,
    startDate: '2025-07-20',
    endDate: '2026-07-28',
  };

  it('renders the flame badge and the divider line', () => {
    const svg = generateStreakSVG(mockStreak, themes.dark, locales.en);
    expect(svg).toContain('🔥');
    expect(svg).toContain('<line');
  });

  it("uses the theme's icon_color for the ring arc", () => {
    const svg = generateStreakSVG(mockStreak, themes.dracula, locales.en);
    expect(svg).toContain(`#${themes.dracula.icon_color}`);
  });

  it('renders a localized date range subtitle', () => {
    const svg = generateStreakSVG(mockStreak, themes.dark, locales.en, undefined, undefined, 'en');
    expect(svg).toContain('Jul 20, 2025 - Jul 28, 2026');
  });

  it('still renders the three existing stat values', () => {
    const svg = generateStreakSVG(mockStreak, themes.dark, locales.en);
    expect(svg).toContain('>5<');
    expect(svg).toContain('>10<');
    expect(svg).toContain('>200<');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test -- tests/svg-generator.test.ts`
Expected: FAIL — `calculateStreakRingPercent is not a function`, and `StreakData` missing `startDate`/`endDate` is a type error until Task 2 lands (Task 2 must be committed before this task runs).

- [ ] **Step 3: Implement the new `generateStreakSVG` and `calculateStreakRingPercent`**

In `src/svg-generator.ts`, change the import at line 4 from:

```ts
import { minifySVG } from "./utils";
```

to:

```ts
import { minifySVG, formatDateRange } from "./utils";
```

Then replace the entire existing `generateStreakSVG` function (currently lines 226-262) with:

```ts
export function calculateStreakRingPercent(current: number, longest: number): number {
  if (longest <= 0) return 0;
  return Math.min(current / longest, 1);
}

export function generateStreakSVG(data: StreakData, theme: Theme, translations: Translations, customCSS?: string, font?: string, locale: string = "en"): string {
  const { title_color, text_color, bg_color, icon_color } = theme;
  const fontStyles = getFontStyles(font);
  const dateRange = formatDateRange(data.startDate, data.endDate, locale);

  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const percent = calculateStreakRingPercent(data.currentStreak, data.longestStreak);
  const dashLength = circumference * percent;

  return minifySVG(`
    <svg width="495" height="195" viewBox="0 0 495 195" fill="none" xmlns="http://www.w3.org/2000/svg">
      <style>
        ${fontStyles.import}
        ${COMMON_STYLES}
        * { font-family: ${fontStyles.family}; }
        .header { font-weight: 600; font-size: 16px; fill: #${title_color}; text-anchor: middle; }
        .subtitle { font-size: 10px; fill: #${text_color}; opacity: 0.55; text-anchor: middle; }
        .ring-value { font-weight: 700; font-size: 30px; fill: #${title_color}; text-anchor: middle; }
        .ring-label { font-size: 10px; fill: #${text_color}; opacity: 0.7; text-anchor: middle; }
        .stat-value { font-weight: 700; font-size: 24px; fill: #${title_color}; }
        .stat-label { font-size: 11px; fill: #${text_color}; opacity: 0.7; }
        ${customCSS || ""}
      </style>
      <rect x="0.5" y="0.5" width="494" height="194" rx="4.5" fill="#${bg_color}" stroke="#E4E2E2"/>
      <text x="247.5" y="28" class="header animate">${translations.streakTitle}</text>
      <text x="247.5" y="43" class="subtitle animate" style="animation-delay: 150ms">${dateRange}</text>

      <g transform="translate(112, 128)" class="animate" style="animation-delay: 300ms">
        <circle r="${radius}" fill="none" stroke="#${text_color}" stroke-opacity="0.15" stroke-width="7"/>
        <circle r="${radius}" fill="none" stroke="#${icon_color}" stroke-width="7"
          stroke-dasharray="${dashLength} ${circumference}" stroke-linecap="round" transform="rotate(-90)"/>
        <text y="6" class="ring-value">${data.currentStreak}</text>
        <text y="24" class="ring-label">${translations.currentStreak}</text>
      </g>

      <g transform="translate(112, 80)" class="animate" style="animation-delay: 400ms">
        <circle r="13" fill="#${bg_color}" stroke="#${icon_color}" stroke-width="2"/>
        <text y="4" text-anchor="middle" font-size="13">🔥</text>
      </g>

      <line x1="196" y1="62" x2="196" y2="178" stroke="#E4E2E2"/>

      <g transform="translate(226, 100)" class="animate" style="animation-delay: 450ms">
        <text class="stat-value">${data.longestStreak}</text>
        <text y="20" class="stat-label">${translations.longestStreak}</text>
      </g>
      <g transform="translate(226, 155)" class="animate" style="animation-delay: 600ms">
        <text class="stat-value">${data.totalContributions}</text>
        <text y="20" class="stat-label">${translations.totalContributions}</text>
      </g>
      ${getTerminalOverlay(theme)}
    </svg>
  `);
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test -- tests/svg-generator.test.ts`
Expected: PASS (existing `generateStatsSVG` tests + 4 new `calculateStreakRingPercent` tests + 4 new `generateStreakSVG` tests, all green).

- [ ] **Step 5: Commit**

```bash
git add src/svg-generator.ts tests/svg-generator.test.ts
git commit -m "feat: redesign Contribution Streak card with ring and flame badge"
```

---

### Task 4: Forward `locale` from the `/streak` route

**Files:**
- Modify: `app/api/streak/route.ts:28`

**Interfaces:**
- Consumes: `generateStreakSVG(data, themeObj, translations, custom_css, font, locale?)` (Task 3).

- [ ] **Step 1: Update the call site**

In `app/api/streak/route.ts`, change line 28 from:

```ts
    const svg = generateStreakSVG(data, themeObj, translations, custom_css, font);
```

to:

```ts
    const svg = generateStreakSVG(data, themeObj, translations, custom_css, font, locale || "en");
```

- [ ] **Step 2: Type-check**

Run: `npm run type-check`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/api/streak/route.ts
git commit -m "feat: pass locale through to the streak card date range"
```

---

### Task 5: Full verification pass

**Files:** none (verification only)

- [ ] **Step 1: Run the full check suite**

Run: `npm run lint && npm run type-check && npm run test`
Expected: all three succeed with no errors and all tests passing.

- [ ] **Step 2: Render the card locally without needing a live GitHub token**

Create a throwaway script (do not commit it) to render the new card directly from mock data, bypassing the GitHub API entirely:

`scratch-render-streak.mjs` (project root, delete after use):

```js
import { generateStreakSVG } from './src/svg-generator.ts';
import { themes } from './src/themes.ts';
import { locales } from './src/locales.ts';

const mockData = {
  name: 'Test User',
  currentStreak: 42,
  longestStreak: 128,
  totalContributions: 1204,
  startDate: '2025-07-20',
  endDate: '2026-07-28',
};

for (const themeName of ['light', 'dracula', 'github_dark']) {
  const svg = generateStreakSVG(mockData, themes[themeName], locales.en, undefined, undefined, 'en');
  await import('node:fs/promises').then(fs => fs.writeFile(`scratch-streak-${themeName}.svg`, svg));
}
```

Run: `npx tsx scratch-render-streak.mjs` (or `node --loader ts-node/esm scratch-render-streak.mjs` if `tsx` isn't available — check `package.json`/`node_modules/.bin` for whichever TS runner is installed; both `src/svg-generator.ts` and its imports are plain TypeScript with no JSX, so any TS-executing Node runner works).

- [ ] **Step 3: Open the rendered SVGs in the browser and visually confirm**

Open `scratch-streak-light.svg`, `scratch-streak-dracula.svg`, and `scratch-streak-github_dark.svg` in a browser tab. Confirm for each:
- The flame badge sits on the ring's edge, not overlapping the "42".
- The ring's background track (drawn with `text_color` at 15% opacity) is visible against the card background, not invisible or overpowering, on both the light and the two dark themes — this was the one value flagged in the spec as not visually validated in the mockup.
- The date range subtitle reads `Jul 20, 2025 - Jul 28, 2026`.
- The divider line and the two right-side stats (`128` / `1,204`... note: mock uses `1204`, no thousands separator is applied by the card, matching existing behavior for all other cards) are aligned and readable.

If the ring track opacity looks wrong on a dark theme, adjust the `stroke-opacity` value in `generateStreakSVG` (Task 3) and re-run this script to confirm before moving on.

- [ ] **Step 4: Clean up scratch files**

```bash
rm scratch-render-streak.mjs scratch-streak-light.svg scratch-streak-dracula.svg scratch-streak-github_dark.svg
```

- [ ] **Step 5: Final commit check**

Run: `git status`
Expected: clean working tree (scratch files removed, nothing left uncommitted from Tasks 1-4).
