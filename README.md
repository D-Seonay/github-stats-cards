# GitHub Stats Cards API (Serverless)

A high-performance, serverless API to generate dynamic GitHub statistics cards for your profile README.

## 🖼️ Previews

Here is how the cards look with different themes:

### Global Stats (Dracula Theme)
![Stats Preview](https://github-stats-cards.matheodelaunay.studio/stats?username=D-Seonay&theme=dracula)

### Top Languages (GitHub Dark Theme)
![Top Langs Preview](https://github-stats-cards.matheodelaunay.studio/top-langs?username=D-Seonay&theme=github_dark)

### Project Card (Default Theme)
![Project Preview](https://github-stats-cards.matheodelaunay.studio/repo?username=D-Seonay&repo=github-stats-cards)

## 🚀 Features

- **Global Stats:** Show stars, commits, PRs, and more.
- **Top Languages:** Visualize your most used programming languages.
- **Project Card:** Highlight a specific repository.
- **Theming:** Support for multiple themes (light, dark, dracula, github_dark).
- **Fast:** Built with Vercel Serverless Functions and aggressive caching.

## 🛠️ Installation

### 1. Fork & Deploy
Click the button below to deploy to Vercel:
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Fyour-repo&env=GH_TOKEN)

### 2. Environment Variables
Add your GitHub Personal Access Token (PAT) as an environment variable named `GH_TOKEN`.
- Requirements: `read:user`, `public_repo`.

## 📖 Usage

### Global Stats
```markdown
![Stats](https://github-stats-cards.matheodelaunay.studio/stats?username=yourusername&theme=dark)
```

### Top Languages
```markdown
![Top Langs](https://github-stats-cards.matheodelaunay.studio/top-langs?username=yourusername&theme=dracula)
```

### Project Card
```markdown
![Project](https://github-stats-cards.matheodelaunay.studio/repo?username=yourusername&repo=your-repo&theme=github_dark)
```

## 🎨 Available Themes

| Theme | Value |
| :--- | :--- |
| Light | `light` (default) |
| Dark | `dark` |
| Dracula | `dracula` |
| GitHub Dark | `github_dark` |

## ⚙️ Configuration

| Parameter | Description |
| :--- | :--- |
| `username` | Your GitHub username |
| `theme` | One of the available themes |
| `repo` | (For project card) The repository name |

---
Built with ❤️ for the open-source community.
