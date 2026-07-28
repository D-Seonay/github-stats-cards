# Contribution Streak card — visual redesign

Date: 2026-07-28
Status: Approved (visual), pending implementation plan

## Goal

Replace the current plain 3-numbers-in-a-row layout of the `/streak` card ([generateStreakSVG](../../../src/svg-generator.ts)) with a more graphic layout: a circular progress ring around the current streak, a flame badge, and a date-range subtitle — while keeping the same 495×195 card footprint and theming/animation conventions used by every other card.

## Visual design (approved via mockup)

Validated in the visual companion (`ring v2` mockup):

- Title `Contribution Streak` centered top (unchanged position, `y=28`), with a new subtitle below it (`y=43`, `font-size:10`, `opacity:0.55`) showing the tracked date range, e.g. `Jul 20, 2025 - Jul 28, 2026`.
- Left side: a circular ring centered at `(112, 128)`, radius `48`, stroke-width `7`.
  - Background track: full circle, neutral/theme-based color (see Theming).
  - Progress arc: drawn from the top (`transform="rotate(-90)"` on the arc group), length proportional to `currentStreak / longestStreak`, capped at 100%.
  - Centered inside the ring: the current streak number (`font-size:30`, bold) with the label `Current Streak` below it (`font-size:10`, `opacity:0.7`).
  - A small circular badge (`r=13`) sits **on top of the ring**, centered at `(0, -48)` relative to the ring center — i.e. on the ring's stroke, at the 12 o'clock position — containing the 🔥 flame glyph. This keeps the flame visually attached to the ring without overlapping the number (this was the specific fix requested after the first mockup, which had the flame floating above the number inside the ring).
- A vertical divider line at `x=196` from `y=62` to `y=178`.
- Right side: two stacked stat blocks (unchanged data, restyled):
  - `Longest Streak` at `(226, 100)`, value `font-size:24` bold.
  - `Total Contributions` at `(226, 155)`, value `font-size:24` bold.
- Card border, background, and the existing terminal scanline overlay (`getTerminalOverlay`) are unchanged.
- Entrance animation follows the existing `.animate` / `fadeIn` convention used by other cards, staggered: ring ~300ms, badge ~400ms, right-side stats ~450ms/600ms.

## Data changes

`StreakData` ([github-fetcher.ts](../../../src/github-fetcher.ts)) currently only returns `currentStreak`, `longestStreak`, `totalContributions`. `fetchStreak` already computes the full list of contribution days internally but discards the date bounds.

Add to `StreakData`:
- `startDate: string` — ISO date (`YYYY-MM-DD`) of the earliest day in the fetched contribution calendar (GitHub returns ~1 year by default).
- `endDate: string` — ISO date of the latest day (today).

`generateStreakSVG` formats these into the localized subtitle.

## Theming

- Progress arc and flame badge use `theme.icon_color` (defined in every theme in [themes.ts](../../../src/themes.ts) but currently unused by any card) instead of a hardcoded orange. This makes the ring match each theme's accent automatically (dracula, nord, monokai, etc.).
- The ring's background track is **not** hardcoded gray (`#ececec` from the mockup, which would be invisible on dark backgrounds). It uses `stroke="#${text_color}"` with `opacity:0.15`, consistent with how other low-emphasis chrome (e.g. secret-trophy captions, small labels) is already dimmed via opacity against `text_color`.
  - This specific value wasn't visually validated in the mockup (light theme only) — after implementation, do a quick visual sanity check on at least one dark theme (e.g. `dracula` or `github_dark`) to confirm the track is visible but subtle.
- Badge fill uses `bg_color` (so it reads as "cut out" of the card) with a `stroke` of `icon_color`, matching the mockup.

## Localization

- Date range subtitle is localized. Existing locale codes (`en`, `fr`, `es`, `de`, `jp`) are mapped to `Intl`/`toLocaleDateString` tags: `en→en-US`, `fr→fr-FR`, `es→es-ES`, `de→de-DE`, `jp→ja-JP`.
- Format: `{month: "short", day: "numeric", year: "numeric"}` for both bounds, joined with ` - ` (matches the mockup's `Jul 20, 2025 - Jul 28, 2026`; exact separator/format can follow each locale's `toLocaleDateString` defaults rather than being forced identical across locales).
- No new `Translations` keys are needed — the date strings are locale-formatted directly, not translated labels.
- `generateStreakSVG` gains a `locale?: string` parameter (defaults to `"en"`); [app/api/streak/route.ts](../../../app/api/streak/route.ts) passes the already-extracted `locale` query param through (it currently only uses it for `getTranslations`).

## Edge cases

- `longestStreak === 0` (no contributions at all): ring shows 0% progress (empty track only), no division by zero.
- `currentStreak === longestStreak`: ring renders fully filled.
- `currentStreak > longestStreak`: cannot happen given how both are derived from the same data in `fetchStreak`, but the percentage calculation clamps to 100% defensively (`Math.min(current / longest, 1)`), guarding against a longest of 0 with a nonzero current.
- Large numbers (`1,204`+) already fit at the current font sizes per the mockup; no truncation needed.

## Testing

Extend [tests/svg-generator.test.ts](../../../tests/svg-generator.test.ts) and [tests/github-fetcher.test.ts](../../../tests/github-fetcher.test.ts):
- Ring percentage calculation: 0 longest streak, current === longest, normal partial case.
- Generated SVG contains the flame badge circle and the vertical divider.
- `icon_color` from the active theme appears in the arc/badge stroke (swap themes and assert the color changes).
- Date range subtitle renders and changes format per locale.
- `StreakData.startDate`/`endDate` are populated correctly from a mocked contribution calendar in `fetchStreak`.

## Out of scope

- No changes to any other card (`stats`, `top-langs`, `activity`, `top-repos`, `project`, `org`, `trophies`).
- No changes to the broader SVG-escaping/security issues identified in the earlier project review — this card's new dynamic content (numbers, ISO-derived dates) is not attacker- or arbitrary-GitHub-data-controlled text, so it doesn't introduce new injection surface.
