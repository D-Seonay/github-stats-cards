# Contributing to STAT-STATS

First off, thank you for considering contributing to STAT-STATS! It's people like you who make this tool better for everyone.

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 20.x or higher
- npm or pnpm
- A GitHub account and a [Personal Access Token (PAT)](https://github.com/settings/tokens) with `read:user` and `public_repo` scopes.

### 2. Local Setup
1. Fork the repository.
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/github-stats-cards.git
   cd github-stats-cards
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the root directory:
   ```env
   GH_TOKEN=your_personal_access_token_here
   ```
5. Run the development server:
   ```bash
   npm run dev
   ```
6. Open [http://localhost:3000](http://localhost:3000) to see the console.

## 📁 Project Structure

- `/api`: Vercel Serverless Functions (Backend endpoints for SVG generation).
- `/src`: Core logic.
  - `github-fetcher.ts`: Data retrieval from GitHub GraphQL/REST APIs.
  - `svg-generator.ts`: SVG templates and rendering logic.
  - `themes.ts`: Color palettes definitions.
  - `locales.ts`: Multi-language support.
- `/components`: Next.js React components for the Console UI.
- `/app`: Next.js App Router pages and global styles.

## 🎨 How to Contribute

### Adding a New Theme
1. Open `src/themes.ts`.
2. Add your theme to the `themes` object using the `Theme` interface.
3. Your theme will automatically appear in the Console's Visual Library!

### Adding a New Language
1. Open `src/locales.ts`.
2. Add the translation strings to the `locales` object following the existing format.

### Improving SVG Design
- All cards are generated as raw XML strings in `src/svg-generator.ts`.
- Ensure compatibility with GitHub's image proxy (*Camo*) by avoiding external assets (use system fonts and inline styles).

## 🛠️ Pull Request Process

1. Create a new branch for your feature or fix: `git checkout -b feat/my-new-feature`.
2. Make your changes and ensure they follow the project's "Stealth" aesthetic.
3. Commit your changes with a clear message: `git commit -m "feat: add synthwave theme"`.
4. Push to your branch and open a Pull Request against the `main` branch.

## 📜 Code of Conduct
Please be respectful and collaborative. We aim to build a helpful tool for the developer community.

---
Happy coding! 🚀
