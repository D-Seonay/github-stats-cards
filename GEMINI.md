# STAT-STATS // Technical Memory 🧠

## 📌 Project Overview
- **Name:** STAT-STATS
- **Purpose:** Serverless API generating high-tech, dynamic GitHub stats cards for READMEs.
- **URL:** [github-stats-cards.matheodelaunay.studio](https://github-stats-cards.matheodelaunay.studio)
- **Current Version:** `v2.8.1-stable.stealth`

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
- **Customization:** 
  - 7 Themes + `terminal` (with CRT scanline overlay).
  - Multi-language (EN, FR, ES, DE, JP).
  - Custom CSS injection & Google Fonts support.
  - Compact Mode & Selective Hiding of stats.
- **Performance:** XML/SVG Minification, Cache-Control (2h browser / 24h edge).
- **Console:** Client-side debouncing (500ms), LocalStorage persistence, Skeleton loaders, Toast notifications.

## ⚠️ Critical Fixes & Decisions
- **Streak Logic:** Refactored to a "Backward Search" algorithm using UTC ISO dates to handle timezones and daily timing accurately (Total streak coverage).
- **PAT Permissions:** Removed `repositoryDiscussions` and Organization `membersWithRole` fields to ensure compatibility with standard Personal Access Tokens (avoiding "resource not accessible" errors).
- **Vercel Build:** Moved API from root `/api` to `app/api` to allow Next.js compiler to resolve path aliases (`@/`).
- **SVG Rendering:** Removed `transform` and `opacity: 0` from initial states to prevent "dead cards" on restrictive SVG renderers (like GitHub Camo). Content is now visible by default.

## 🚀 Infrastructure
- **CI/CD:** GitHub Actions (`.github/workflows/ci.yml`) running lint, type-check, and tests.
- **Git Hooks:** Husky + lint-staged for automated formatting (Prettier) and linting (ESLint) before commits.

## 📅 Future Roadmap (Backlog Highlights)
- CI/CD deployment automation (Issue #10).
- WakaTime integration (#27).
- Accessibility ARIA labels for SVGs (#29).
- Snapshot Testing for SVG layouts (#34).
- Custom width/height support (#32).
