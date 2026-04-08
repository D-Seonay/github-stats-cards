# STAT-STATS // GitHub Cards API 🚀

A high-performance, serverless API to generate dynamic, high-tech GitHub statistics cards for your profile README.

[![Vercel Deployment](https://img.shields.io/badge/Deployment-Vercel-black?style=for-the-badge&logo=vercel)](https://github-stats-cards.matheodelaunay.studio)
[![Version](https://img.shields.io/badge/Version-2.1.1--stable-emerald?style=for-the-badge)](https://github.com/D-Seonay/github-stats-cards)

---

## 🎮 Interactive Console

Configure, preview, and export your cards in real-time using our dedicated "Stealth" console:
👉 **[github-stats-cards.matheodelaunay.studio](https://github-stats-cards.matheodelaunay.studio)**

---

## 🖼️ Previews

### Global Statistics
![Stats Preview](https://github-stats-cards.matheodelaunay.studio/stats?username=D-Seonay&theme=dracula&locale=en)

### Contribution Streak
![Streak Preview](https://github-stats-cards.matheodelaunay.studio/streak?username=D-Seonay&theme=nord)

### Top Languages
![Top Langs Preview](https://github-stats-cards.matheodelaunay.studio/top-langs?username=D-Seonay&theme=monokai)

### Recent Activity
![Activity Preview](https://github-stats-cards.matheodelaunay.studio/activity?username=D-Seonay&theme=github_dark)

---

## 🚀 Features

- **✨ SVG Animations:** Subtle fade-in effects for a premium feel.
- **🌍 Multi-language:** Support for English, French, Spanish, German, and Japanese.
- **🎨 Advanced Theming:** 7+ built-in palettes + support for custom background colors.
- **⚡ Performance:** Aggressive server-side caching and XML/SVG minification.
- **🛡️ Resilience:** Graceful degradation with professional "Rate Limit" fallback cards.
- **📦 Comprehensive:** Includes Global Stats, Streaks, Top Languages, Recent Activity, and Project cards.

---

## 📖 Available Endpoints

| Endpoint | Description |
| :--- | :--- |
| `/stats` | Stars, Commits, PRs, Issues, and Contributed repos. |
| `/streak` | Current streak, Longest streak, and Total contributions. |
| `/top-langs` | Horizontal bar chart of your most used languages. |
| `/top-repos` | List of your top 5 most starred repositories. |
| `/activity` | Feed of your 5 most recent public GitHub events. |
| `/repo` | Detailed card for a specific repository. |

### Parameters

| Parameter | Description | Example |
| :--- | :--- | :--- |
| `username` | **(Required)** Your GitHub pseudo. | `?username=D-Seonay` |
| `theme` | Visual palette selection. | `&theme=nord` |
| `locale` | Language selection. | `&locale=fr` |
| `bg_color` | Custom hex background color. | `&bg_color=000000` |
| `font` | Google Font name. | `&font=Roboto` |
| `repo` | Repository name (for `/repo` only). | `&repo=github-stats-cards` |

---

## 🎨 Built-in Themes

`light`, `dark`, `dracula`, `github_dark`, `nord`, `monokai`, `solarized`.

---

## 🛠️ Self-Hosting

### 1. Fork & Deploy
Deploy your own instance to Vercel in seconds:
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FD-Seonay%2Fgithub-stats-cards&env=GH_TOKEN)

### 2. Environment Variables
Add your GitHub Personal Access Token (PAT) as `GH_TOKEN`.
- **Permissions:** `read:user`, `public_repo`.

---

## 🤝 Contributing

Contributions are welcome! Please check our **[CONTRIBUTING.md](./CONTRIBUTING.md)** for local setup instructions and contribution guidelines.

---
Built with ❤️ by **[D-Seonay](https://github.com/D-Seonay)**.
