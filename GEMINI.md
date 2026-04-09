# STAT-STATS // Technical Memory 🧠

## 📌 Project Overview
- **Name:** STAT-STATS
- **Purpose:** Serverless API generating high-tech, dynamic GitHub stats cards for READMEs.
- **URL:** [github-stats-cards.matheodelaunay.studio](https://github-stats-cards.matheodelaunay.studio)
- **Current Version:** `v3.1.0-stable.stealth`

## 🛠️ Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (Strict mode)
- **Styling:** Tailwind CSS + Vanilla CSS (for SVGs)
- **Animations:** Framer Motion (Frontend) + CSS Keyframes (SVGs)
- **Backend:** Vercel Serverless Functions (`app/api/*/route.ts`)
- **APIs:** GitHub GraphQL (v4) & REST API
- **Testing:** Vitest

## 🎴 Feature List
- **Cards:** Stats (Global), Top Langs, Streak, Top Repos, Recent Activity, Trophies, Org Stats, Project card.
- **Achievement System (v3.1):** 
  - Dual-section layout: "Prime Achievements" and "Hidden Vault".
  - Legendary Trophies: Mythic, Divine, Transcendent, Colossal, Universal tiers.
  - Secret Easter Eggs: Ghost, Architect.
- **Customization:** 
  - 7 Themes + `terminal` (with CRT scanline overlay).
  - Multi-language (EN, FR, ES, DE, JP).
  - Custom CSS injection & Google Fonts support.
  - Compact Mode & Selective Hiding of stats.
- **Monitoring:** Dedicated `/status` page with real-time health checks.
- **Performance:** XML/SVG Minification, Cache-Control (2h browser / 24h edge).
- **Console:** Client-side debouncing (500ms), LocalStorage persistence, Skeleton loaders, Toast notifications.

## ⚠️ Critical Fixes & Decisions
- **SVG Font Rendering:** Switched from `<img>` to `<object>` in the console preview to bypass browser security sandboxing and allow external Google Font loading.
- **Streak Logic:** Refactored to a "Backward Search" algorithm using UTC ISO dates to handle timezones and daily timing accurately.
- **PAT Permissions:** Removed `repositoryDiscussions` and Organization `membersWithRole` fields. Added null-safe checks for `followers` and `gists` to ensure 100% card availability even with restricted tokens.
- **Dynamic Layout:** Implemented calculated SVG height logic in `generateStatsSVG` and `generateTrophySVG` to prevent clipping when social stats or secret trophies are active.
- **XML Safety:** Escaped `&` into `&amp;` in Google Fonts URLs to prevent SVG parsing errors.

## 🚀 Infrastructure
- **CI/CD:** GitHub Actions (`.github/workflows/ci.yml`) running lint, type-check, and tests.
- **Git Hooks:** Husky + lint-staged for automated formatting (Prettier) and linting (ESLint) before commits.

## 📅 Future Roadmap (Backlog Highlights)
- CI/CD deployment automation (Issue #10).
- WakaTime integration (#27).
- Accessibility ARIA labels for SVGs (#29).
- Snapshot Testing for SVG layouts (#34).
- Custom width/height support (#32).
