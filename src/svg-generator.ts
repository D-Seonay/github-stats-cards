import { ActivityData, GithubData, LanguageData, ProjectData, StreakData, TopRepoData } from "./github-fetcher";
import { Theme } from "./themes";
import { Translations } from "./locales";

export function generateActivitySVG(data: ActivityData[], theme: Theme, translations: Translations): string {
  const { title_color, text_color, bg_color } = theme;

  const rows = data.map((activity, index) => {
    const y = index * 25;
    return `
      <g transform="translate(0, ${y})">
        <text x="0" y="0" class="stat bold">${activity.type}</text>
        <text x="100" y="0" class="stat">${activity.repo.length > 25 ? activity.repo.substring(0, 22) + "..." : activity.repo}</text>
        <text x="400" y="0" class="stat small text-right" text-anchor="end">${activity.date}</text>
      </g>
    `;
  }).join("");

  return `
    <svg width="495" height="195" viewBox="0 0 495 195" fill="none" xmlns="http://www.w3.org/2000/svg">
      <style>
        .header { font: 600 18px 'Segoe UI', Ubuntu, Sans-Serif; fill: #${title_color}; }
        .stat { font: 400 14px 'Segoe UI', Ubuntu, Sans-Serif; fill: #${text_color}; }
        .small { font-size: 12px; opacity: 0.6; }
        .bold { font-weight: 700; fill: #${title_color}; }
      </style>
      <rect x="0.5" y="0.5" width="494" height="194" rx="4.5" fill="#${bg_color}" stroke="#E4E2E2"/>
      <text x="25" y="35" class="header">${translations.recentActivityTitle}</text>
      
      <g transform="translate(25, 70)">
        ${rows}
      </g>
    </svg>
  `;
}

export function generateTopReposSVG(data: TopRepoData[], theme: Theme, translations: Translations): string {
  const { title_color, text_color, bg_color } = theme;

  const rows = data.map((repo, index) => {
    const y = index * 25;
    const truncatedName = repo.name.length > 18 ? repo.name.substring(0, 15) + "..." : repo.name;
    return `
      <g transform="translate(0, ${y})">
        <text x="0" y="0" class="stat bold">${truncatedName}</text>
        <g transform="translate(200, 0)">
          <circle cx="5" cy="-4" r="4" fill="${repo.languageColor}"/>
          <text x="15" y="0" class="stat small">${repo.language}</text>
        </g>
        <text x="320" y="0" class="stat small">⭐ ${repo.stars}</text>
        <text x="400" y="0" class="stat small">🍴 ${repo.forks}</text>
      </g>
    `;
  }).join("");

  return `
    <svg width="495" height="195" viewBox="0 0 495 195" fill="none" xmlns="http://www.w3.org/2000/svg">
      <style>
        .header { font: 600 18px 'Segoe UI', Ubuntu, Sans-Serif; fill: #${title_color}; }
        .stat { font: 400 14px 'Segoe UI', Ubuntu, Sans-Serif; fill: #${text_color}; }
        .small { font-size: 12px; opacity: 0.8; }
        .bold { font-weight: 700; }
      </style>
      <rect x="0.5" y="0.5" width="494" height="194" rx="4.5" fill="#${bg_color}" stroke="#E4E2E2"/>
      <text x="25" y="35" class="header">${translations.topReposTitle}</text>
      
      <g transform="translate(25, 70)">
        ${rows}
      </g>
    </svg>
  `;
}

export function generateStreakSVG(data: StreakData, theme: Theme, translations: Translations): string {
  const { title_color, text_color, bg_color } = theme;

  return `
    <svg width="495" height="195" viewBox="0 0 495 195" fill="none" xmlns="http://www.w3.org/2000/svg">
      <style>
        .header { font: 600 18px 'Segoe UI', Ubuntu, Sans-Serif; fill: #${title_color}; }
        .stat { font: 400 14px 'Segoe UI', Ubuntu, Sans-Serif; fill: #${text_color}; }
        .bold { font: 700 24px 'Segoe UI', Ubuntu, Sans-Serif; fill: #${title_color}; }
        .label { font: 400 12px 'Segoe UI', Ubuntu, Sans-Serif; fill: #${text_color}; opacity: 0.8; }
      </style>
      <rect x="0.5" y="0.5" width="494" height="194" rx="4.5" fill="#${bg_color}" stroke="#E4E2E2"/>
      <text x="25" y="35" class="header">${translations.streakTitle}</text>
      
      <g transform="translate(25, 80)">
        <g transform="translate(0, 0)">
          <text x="0" y="0" class="bold">${data.currentStreak}</text>
          <text x="0" y="20" class="label">${translations.currentStreak}</text>
        </g>
        <g transform="translate(160, 0)">
          <text x="0" y="0" class="bold">${data.longestStreak}</text>
          <text x="0" y="20" class="label">${translations.longestStreak}</text>
        </g>
        <g transform="translate(320, 0)">
          <text x="0" y="0" class="bold">${data.totalContributions}</text>
          <text x="0" y="20" class="label">${translations.totalContributions}</text>
        </g>
      </g>
    </svg>
  `;
}

export function generateStatsSVG(data: GithubData, theme: Theme, translations: Translations): string {
  const { title_color, text_color, bg_color } = theme;
  const title = translations.statsTitle.replace("{name}", data.name);

  return `
    <svg width="495" height="195" viewBox="0 0 495 195" fill="none" xmlns="http://www.w3.org/2000/svg">
      <style>
        .header { font: 600 18px 'Segoe UI', Ubuntu, Sans-Serif; fill: #${title_color}; }
        .stat { font: 400 14px 'Segoe UI', Ubuntu, Sans-Serif; fill: #${text_color}; }
        .bold { font-weight: 700; }
      </style>
      <rect x="0.5" y="0.5" width="494" height="194" rx="4.5" fill="#${bg_color}" stroke="#E4E2E2"/>
      <text x="25" y="35" class="header">${title}</text>
      
      <g transform="translate(25, 60)">
        <text x="0" y="0" class="stat">${translations.totalStars} <tspan x="180" class="bold">${data.totalStars}</tspan></text>
        <text x="0" y="25" class="stat">${translations.totalCommits} <tspan x="180" class="bold">${data.totalCommits}</tspan></text>
        <text x="0" y="50" class="stat">${translations.totalPRs} <tspan x="180" class="bold">${data.totalPRs}</tspan></text>
        <text x="0" y="75" class="stat">${translations.totalIssues} <tspan x="180" class="bold">${data.totalIssues}</tspan></text>
        <text x="0" y="100" class="stat">${translations.contributedTo} <tspan x="180" class="bold">${data.contributedTo}</tspan></text>
      </g>
    </svg>
  `;
}

export function generateLanguagesSVG(data: LanguageData[], theme: Theme, translations: Translations): string {
  const { title_color, text_color, bg_color } = theme;
  const totalSize = data.reduce((acc, lang) => acc + lang.size, 0);

  let currentX = 0;
  const barWidth = 445;
  const barHeight = 8;
  const bars = data.map((lang) => {
    const width = (lang.size / totalSize) * barWidth;
    const rect = `<rect x="${currentX}" y="0" width="${width}" height="${barHeight}" fill="${lang.color}"/>`;
    currentX += width;
    return rect;
  }).join("");

  const legend = data.map((lang, index) => {
    const percentage = ((lang.size / totalSize) * 100).toFixed(1);
    const y = index * 20;
    return `
      <g transform="translate(0, ${y})">
        <circle cx="5" cy="5" r="5" fill="${lang.color}"/>
        <text x="20" y="10" class="stat">${lang.name} <tspan class="bold">${percentage}%</tspan></text>
      </g>
    `;
  }).join("");

  return `
    <svg width="495" height="195" viewBox="0 0 495 195" fill="none" xmlns="http://www.w3.org/2000/svg">
      <style>
        .header { font: 600 18px 'Segoe UI', Ubuntu, Sans-Serif; fill: #${title_color}; }
        .stat { font: 400 14px 'Segoe UI', Ubuntu, Sans-Serif; fill: #${text_color}; }
        .bold { font-weight: 700; }
      </style>
      <rect x="0.5" y="0.5" width="494" height="194" rx="4.5" fill="#${bg_color}" stroke="#E4E2E2"/>
      <text x="25" y="35" class="header">${translations.topLangsTitle}</text>
      
      <g transform="translate(25, 55)">
        <mask id="bar-mask">
          <rect width="${barWidth}" height="${barHeight}" rx="4"/>
        </mask>
        <g mask="url(#bar-mask)">
          ${bars}
        </g>
      </g>

      <g transform="translate(25, 80)">
        ${legend}
      </g>
    </svg>
  `;
}

export function generateProjectSVG(data: ProjectData, theme: Theme): string {
  const { title_color, text_color, bg_color } = theme;

  return `
    <svg width="400" height="150" viewBox="0 0 400 150" fill="none" xmlns="http://www.w3.org/2000/svg">
      <style>
        .header { font: 600 18px 'Segoe UI', Ubuntu, Sans-Serif; fill: #${title_color}; }
        .description { font: 400 13px 'Segoe UI', Ubuntu, Sans-Serif; fill: #${text_color}; }
        .stat { font: 400 12px 'Segoe UI', Ubuntu, Sans-Serif; fill: #${text_color}; }
      </style>
      <rect x="0.5" y="0.5" width="399" height="149" rx="4.5" fill="#${bg_color}" stroke="#E4E2E2"/>
      <text x="25" y="35" class="header">${data.name}</text>
      <text x="25" y="60" class="description">${data.description.length > 50 ? data.description.substring(0, 47) + "..." : data.description}</text>
      
      <g transform="translate(25, 110)">
        <circle cx="5" cy="5" r="5" fill="${data.languageColor}"/>
        <text x="15" y="10" class="stat">${data.language}</text>
        
        <g transform="translate(100, 0)">
          <text x="0" y="10" class="stat">⭐ ${data.stars}</text>
        </g>
        
        <g transform="translate(180, 0)">
          <text x="0" y="10" class="stat">🍴 ${data.forks}</text>
        </g>
      </g>
    </svg>
  `;
}

export function generateErrorSVG(message: string): string {
  return `
    <svg width="495" height="195" viewBox="0 0 495 195" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0.5" y="0.5" width="494" height="194" rx="4.5" fill="#fffefe" stroke="#E4E2E2"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" fill="#D32F2F">
        Something went wrong:
      </text>
      <text x="50%" y="65%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#666">
        ${message}
      </text>
    </svg>
  `;
}
