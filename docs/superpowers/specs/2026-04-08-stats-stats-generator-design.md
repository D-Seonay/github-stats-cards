# Design Spec: STAT-STATS Generator Console (High-Tech Stealth)
**Date**: 2026-04-08
**Status**: Draft (Approved)
**Style**: Dark Mode Absolute / Technical Typography

## 1. Overview
A sleek, modern web interface to configure and preview GitHub statistics cards in real-time. The UI follows a "Command Center" approach with a focus on technical aesthetics, extreme whitespace, and stealth animations.

## 2. Architecture
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS (Vanilla CSS patterns), Framer Motion for animations.
- **State Management**: React `useState` and `useEffect` for real-time preview sync.
- **API Integration**:
  - Uses existing serverless functions in `/api/`.
  - New internal API route `/api/github/repos?username=...` to fetch repository lists for the selector.

## 3. UI Components

### 3.1 Sidebar (Control Panel)
- **Target User**: Text input with debounce (500ms) to trigger updates.
- **Theme Selector**: Visual grid of buttons for built-in themes (Dark, High-Contrast, Matrix, Silver).
- **Customization**: Input for `bg_color` (hex color).
- **Locale Selector**: Dropdown for language support (English, French, etc.).
- **Repo Selector**: Dropdown that populates when a username is valid, specifically for the "Project Card".

### 3.2 Workspace (Preview Zone)
- **Grid Layout**: Vertical or Responsive grid showing 3 main sections:
  1. **User Statistics**
  2. **Top Languages**
  3. **Featured Project**
- **Live Preview**: Cards are rendered using `<img>` tags pointing to the local `/api/...` endpoints with query parameters.
- **Loading States**: Ghost/Skeleton loaders while fetching data.

### 3.3 Export Actions
Triggered on hover or click of a preview card:
- **Copy Markdown**: `![Stats](...)`
- **Copy Link**: Raw URL.
- **Copy HTML**: `<img src="..." />`
- **Download SVG**: Triggers a browser download of the generated SVG.

## 4. Visual Identity
- **Background**: `zinc-950` (#09090b)
- **Text**: `zinc-100` (#f4f4f5)
- **Accents**: `zinc-800` for borders, `zinc-500` for comments/metadata.
- **Typography**: Monospace (font-mono) for all technical data, Sans-serif for main labels.
- **Animations**: 
  - `initial: { opacity: 0, y: 10 }`, `animate: { opacity: 1, y: 0 }`.
  - Duration: 0.8s (Slow stealth).

## 5. Technical Requirements
- **Environment**: Must read `GH_TOKEN` from Vercel environment variables.
- **Responsiveness**: Desktop-first (Command Center layout), simplified stack for mobile.
- **Performance**: Use Next.js Image optimization where possible or standard `<img>` for SVG consistency.

## 6. Implementation Steps (Phases)
1. **Infrastructure**: Setup Next.js structure within the current project.
2. **Core UI**: Implement the Sidebar and Workspace layout.
3. **Logic**: Connect inputs to URL query parameters.
4. **GitHub Integration**: Add the repo-fetcher for the dropdown.
5. **Polishing**: Add Framer Motion animations and "Stealth" styling.
