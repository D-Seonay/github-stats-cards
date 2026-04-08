import { ActivityData, GithubData, LanguageData, ProjectData, StreakData, TopRepoData, Trophy, OrgData } from "./github-fetcher";
import { Theme } from "./themes";
import { Translations } from "./locales";
import { minifySVG } from "./utils";

const COMMON_STYLES = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  .animate {
    animation: fadeIn 0.6s ease-out;
  }
`;

const RANK_COLORS = {
  BRONZE: "#8d5524",
  SILVER: "#c0c0c0",
  GOLD: "#ffd700",
  PLATINUM: "#e5e4e2",
  DIAMOND: "#b9f2ff",
};

function getTerminalOverlay(theme: Theme): string {
  if (theme.bg_color === "000000" && theme.title_color === "00ff00") {
    return `
      <defs>
        <pattern id="scanline" width="495" height="4" patternUnits="userSpaceOnUse">
          <rect width="495" height="2" fill="#00ff00" fill-opacity="0.05" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#scanline)" pointer-events="none" />
    `;
  }
  return "";
}

export function generateTrophySVG(trophies: Trophy[], theme: Theme, customCSS?: string): string {
  const { title_color, bg_color, text_color } = theme;

  const trophyIcons = trophies.map((t, index) => {
    const x = (index % 3) * 150;
    const y = Math.floor(index / 3) * 70;
    const color = RANK_COLORS[t.rank];
    const delay = 300 + (index * 100);

    return `
      <g transform="translate(${x}, ${y})" class="animate" style="animation-delay: ${delay}ms">
        <circle cx="20" cy="20" r="18" fill="${color}" opacity="0.2" />
        <path d="M20 10 L24 18 L32 18 L26 24 L28 32 L20 28 L12 32 L14 24 L8 18 L16 18 Z" fill="${color}" />
        <text x="45" y="18" class="stat bold" style="fill: ${color}">${t.title}</text>
        <text x="45" y="32" class="stat small" style="fill: #${text_color}">${t.rank} (${t.value})</text>
      </g>
    `;
  }).join("");

  return minifySVG(`
    <svg width="495" height="195" viewBox="0 0 495 195" fill="none" xmlns="http://www.w3.org/2000/svg">
      <style>
        ${COMMON_STYLES}
        .header { font: 600 18px 'Segoe UI', Ubuntu, Sans-Serif; fill: #${title_color}; }
        .stat { font: 400 14px 'Segoe UI', Ubuntu, Sans-Serif; }
        .small { font-size: 10px; opacity: 0.7; }
        .bold { font-weight: 700; }
        ${customCSS || ""}
      </style>
      <rect x="0.5" y="0.5" width="494" height="194" rx="4.5" fill="#${bg_color}" stroke="#E4E2E2"/>
      <text x="25" y="35" class="header animate">Achievement Trophies</text>
      <g transform="translate(25, 65)">
        ${trophyIcons}
      </g>
      ${getTerminalOverlay(theme)}
    </svg>
  `);
}

export function generateRateLimitSVG(theme: Theme, customCSS?: string): string {
  const { title_color, text_color, bg_color } = theme;

  return minifySVG(`
    <svg width="495" height="195" viewBox="0 0 495 195" fill="none" xmlns="http://www.w3.org/2000/svg">
      <style>
        ${COMMON_STYLES}
        .header { font: 600 18px 'Segoe UI', Ubuntu, Sans-Serif; fill: #${title_color}; }
        .stat { font: 400 14px 'Segoe UI', Ubuntu, Sans-Serif; fill: #${text_color}; }
        ${customCSS || ""}
      </style>
      <rect x="0.5" y="0.5" width="494" height="194" rx="4.5" fill="#${bg_color}" stroke="#E4E2E2"/>
      <g class="animate">
        <text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" class="header">Rate Limit Exceeded</text>
        <text x="50%" y="65%" dominant-baseline="middle" text-anchor="middle" class="stat">
          GitHub API is temporarily unavailable. 
        </text>
        <text x="50%" y="80%" dominant-baseline="middle" text-anchor="middle" class="stat" style="opacity: 0.6; font-size: 12px;">
          Please try again in a few minutes.
        </text>
      </g>
      ${getTerminalOverlay(theme)}
    </svg>
  `);
}

export function generateActivitySVG(data: ActivityData[], theme: Theme, translations: Translations, customCSS?: string): string {
  const { title_color, text_color, bg_color } = theme;

  const rows = data.map((activity, index) => {
    const y = index * 25;
    return `
      <g transform="translate(0, ${y})" class="animate">
        <text x="0" y="0" class="stat bold">${activity.type}</text>
        <text x="100" y="0" class="stat">${activity.repo.length > 25 ? activity.repo.substring(0, 22) + "..." : activity.repo}</text>
        <text x="400" y="0" class="stat small text-right" text-anchor="end">${activity.date}</text>
      </g>
    `;
  }).join("");

  return minifySVG(`
    <svg width="495" height="195" viewBox="0 0 495 195" fill="none" xmlns="http://www.w3.org/2000/svg">
      <style>
        ${COMMON_STYLES}
        .header { font: 600 18px 'Segoe UI', Ubuntu, Sans-Serif; fill: #${title_color}; }
        .stat { font: 400 14px 'Segoe UI', Ubuntu, Sans-Serif; fill: #${text_color}; }
        .small { font-size: 12px; opacity: 0.6; }
        .bold { font-weight: 700; fill: #${title_color}; }
        ${customCSS || ""}
      </style>
      <rect x="0.5" y="0.5" width="494" height="194" rx="4.5" fill="#${bg_color}" stroke="#E4E2E2"/>
      <text x="25" y="35" class="header animate">${translations.recentActivityTitle}</text>
      
      <g transform="translate(25, 70)">
        ${rows}
      </g>
      ${getTerminalOverlay(theme)}
    </svg>
  `);
}

export function generateTopReposSVG(data: TopRepoData[], theme: Theme, translations: Translations, customCSS?: string): string {
  const { title_color, text_color, bg_color } = theme;

  const rows = data.map((repo, index) => {
    const y = index * 25;
    const truncatedName = repo.name.length > 18 ? repo.name.substring(0, 15) + "..." : repo.name;
    return `
      <g transform="translate(0, ${y})" class="animate">
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

  return minifySVG(`
    <svg width="495" height="195" viewBox="0 0 495 195" fill="none" xmlns="http://www.w3.org/2000/svg">
      <style>
        ${COMMON_STYLES}
        .header { font: 600 18px 'Segoe UI', Ubuntu, Sans-Serif; fill: #${title_color}; }
        .stat { font: 400 14px 'Segoe UI', Ubuntu, Sans-Serif; fill: #${text_color}; }
        .small { font-size: 12px; opacity: 0.8; }
        .bold { font-weight: 700; }
        ${customCSS || ""}
      </style>
      <rect x="0.5" y="0.5" width="494" height="194" rx="4.5" fill="#${bg_color}" stroke="#E4E2E2"/>
      <text x="25" y="35" class="header animate">${translations.topReposTitle}</text>
      
      <g transform="translate(25, 70)">
        ${rows}
      </g>
      ${getTerminalOverlay(theme)}
    </svg>
  `);
}

export function generateStreakSVG(data: StreakData, theme: Theme, translations: Translations, customCSS?: string): string {
  const { title_color, text_color, bg_color } = theme;

  return minifySVG(`
    <svg width="495" height="195" viewBox="0 0 495 195" fill="none" xmlns="http://www.w3.org/2000/svg">
      <style>
        ${COMMON_STYLES}
        .header { font: 600 18px 'Segoe UI', Ubuntu, Sans-Serif; fill: #${title_color}; }
        .stat { font: 400 14px 'Segoe UI', Ubuntu, Sans-Serif; fill: #${text_color}; }
        .bold { font: 700 24px 'Segoe UI', Ubuntu, Sans-Serif; fill: #${title_color}; }
        .label { font: 400 12px 'Segoe UI', Ubuntu, Sans-Serif; fill: #${text_color}; opacity: 0.8; }
        ${customCSS || ""}
      </style>
      <rect x="0.5" y="0.5" width="494" height="194" rx="4.5" fill="#${bg_color}" stroke="#E4E2E2"/>
      <text x="25" y="35" class="header animate">${translations.streakTitle}</text>
      
      <g transform="translate(25, 80)">
        <g transform="translate(0, 0)" class="animate">
          <text x="0" y="0" class="bold">${data.currentStreak}</text>
          <text x="0" y="20" class="label">${translations.currentStreak}</text>
        </g>
        <g transform="translate(160, 0)" class="animate">
          <text x="0" y="0" class="bold">${data.longestStreak}</text>
          <text x="0" y="20" class="label">${translations.longestStreak}</text>
        </g>
        <g transform="translate(320, 0)" class="animate">
          <text x="0" y="0" class="bold">${data.totalContributions}</text>
          <text x="0" y="20" class="label">${translations.totalContributions}</text>
        </g>
      </g>
      ${getTerminalOverlay(theme)}
    </svg>
  `);
}

export function generateStatsSVG(data: GithubData, theme: Theme, translations: Translations, hide: string[] = [], compact: boolean = false, customCSS?: string): string {
  const { title_color, text_color, bg_color } = theme;
  const title = translations.statsTitle.replace("{name}", data.name);

  const stats = [
    { key: "stars", label: translations.totalStars, value: data.totalStars },
    { key: "commits", label: translations.totalCommits, value: data.totalCommits },
    { key: "prs", label: translations.totalPRs, value: data.totalPRs },
    { key: "issues", label: translations.totalIssues, value: data.totalIssues },
    { key: "contribs", label: translations.contributedTo, value: data.contributedTo },
  ].filter(s => !hide.includes(s.key));

  const height = compact ? Math.max(100, 45 + stats.length * 25) : 195;
  const rowHeight = 25;

  const rows = stats.map((stat, index) => {
    const y = index * rowHeight;
    return `
      <text x="0" y="${y}" class="stat animate">
        ${stat.label} <tspan x="180" class="bold">${stat.value}</tspan>
      </text>
    `;
  }).join("");

  return minifySVG(`
    <svg width="495" height="${height}" viewBox="0 0 495 ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <style>
        ${COMMON_STYLES}
        .header { font: 600 18px 'Segoe UI', Ubuntu, Sans-Serif; fill: #${title_color}; }
        .stat { font: 400 14px 'Segoe UI', Ubuntu, Sans-Serif; fill: #${text_color}; }
        .bold { font-weight: 700; }
        ${customCSS || ""}
      </style>
      <rect x="0.5" y="0.5" width="494" height="${height - 1}" rx="4.5" fill="#${bg_color}" stroke="#E4E2E2"/>
      <text x="25" y="35" class="header animate">${title}</text>
      
      <g transform="translate(25, 65)">
        ${rows}
      </g>
      ${getTerminalOverlay(theme)}
    </svg>
  `);
}

export function generateLanguagesSVG(data: LanguageData[], theme: Theme, translations: Translations, customCSS?: string): string {
  const { title_color, text_color, bg_color } = theme;
  const totalSize = data.reduce((acc, lang) => acc + lang.size, 0);

  let currentX = 0;
  const barWidth = 445;
  const barHeight = 8;
  const bars = data.map((lang, index) => {
    const width = (lang.size / totalSize) * barWidth;
    const rect = `<rect x="${currentX}" y="0" width="${width}" height="${barHeight}" fill="${lang.color}"/>`;
    currentX += width;
    return rect;
  }).join("");

  const legend = data.map((lang, index) => {
    const percentage = ((lang.size / totalSize) * 100).toFixed(1);
    const y = index * 20;
    return `
      <g transform="translate(0, ${y})" class="animate">
        <circle cx="5" cy="5" r="5" fill="${lang.color}"/>
        <text x="20" y="10" class="stat">${lang.name} <tspan class="bold">${percentage}%</tspan></text>
      </g>
    `;
  }).join("");

  return minifySVG(`
    <svg width="495" height="195" viewBox="0 0 495 195" fill="none" xmlns="http://www.w3.org/2000/svg">
      <style>
        ${COMMON_STYLES}
        .header { font: 600 18px 'Segoe UI', Ubuntu, Sans-Serif; fill: #${title_color}; }
        .stat { font: 400 14px 'Segoe UI', Ubuntu, Sans-Serif; fill: #${text_color}; }
        .bold { font-weight: 700; }
        ${customCSS || ""}
      </style>
      <rect x="0.5" y="0.5" width="494" height="194" rx="4.5" fill="#${bg_color}" stroke="#E4E2E2"/>
      <text x="25" y="35" class="header animate">${translations.topLangsTitle}</text>
      
      <g transform="translate(25, 55)" class="animate">
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
      ${getTerminalOverlay(theme)}
    </svg>
  `);
}

export function generateProjectSVG(data: ProjectData, theme: Theme, customCSS?: string): string {
  const { title_color, text_color, bg_color } = theme;

  return minifySVG(`
    <svg width="400" height="150" viewBox="0 0 400 150" fill="none" xmlns="http://www.w3.org/2000/svg">
      <style>
        ${COMMON_STYLES}
        .header { font: 600 18px 'Segoe UI', Ubuntu, Sans-Serif; fill: #${title_color}; }
        .description { font: 400 13px 'Segoe UI', Ubuntu, Sans-Serif; fill: #${text_color}; }
        .stat { font: 400 12px 'Segoe UI', Ubuntu, Sans-Serif; fill: #${text_color}; }
        ${customCSS || ""}
      </style>
      <rect x="0.5" y="0.5" width="399" height="149" rx="4.5" fill="#${bg_color}" stroke="#E4E2E2"/>
      <text x="25" y="35" class="header animate">${data.name}</text>
      <text x="25" y="60" class="description animate">${data.description.length > 50 ? data.description.substring(0, 47) + "..." : data.description}</text>
      
      <g transform="translate(25, 110)" class="animate">
        <circle cx="5" cy="5" r="5" fill="${data.languageColor}"/>
        <text x="15" y="10" class="stat">${data.language}</text>
        
        <g transform="translate(100, 0)">
          <text x="0" y="10" class="stat">⭐ ${data.stars}</text>
        </g>
        
        <g transform="translate(180, 0)">
          <text x="0" y="10" class="stat">🍴 ${data.forks}</text>
        </g>
      </g>
      ${getTerminalOverlay(theme)}
    </svg>
  `);
}

export function generateOrgStatsSVG(data: OrgData, theme: Theme, customCSS?: string): string {
  const { title_color, text_color, bg_color } = theme;

  return minifySVG(`
    <svg width="495" height="195" viewBox="0 0 495 195" fill="none" xmlns="http://www.w3.org/2000/svg">
      <style>
        ${COMMON_STYLES}
        .header { font: 600 18px 'Segoe UI', Ubuntu, Sans-Serif; fill: #${title_color}; }
        .stat { font: 400 14px 'Segoe UI', Ubuntu, Sans-Serif; fill: #${text_color}; }
        .bold { font-weight: 700; }
        ${customCSS || ""}
      </style>
      <rect x="0.5" y="0.5" width="494" height="194" rx="4.5" fill="#${bg_color}" stroke="#E4E2E2"/>
      
      <g transform="translate(25, 35)">
        <image href="${data.avatarUrl}" x="0" y="0" width="40" height="40" />
        <text x="50" y="25" class="header animate">${data.name}</text>
      </g>

      <text x="25" y="90" class="stat animate" style="opacity: 0.8; font-size: 13px">
        ${data.description.length > 60 ? data.description.substring(0, 57) + "..." : data.description}
      </text>

      <g transform="translate(25, 130)">
        <text x="0" y="0" class="stat animate">Members: <tspan x="150" class="bold">${data.membersCount}</tspan></text>
        <text x="0" y="25" class="stat animate">Public Repos: <tspan x="150" class="bold">${data.reposCount}</tspan></text>
        <text x="0" y="50" class="stat animate">Total Stars: <tspan x="150" class="bold">${data.totalStars}</tspan></text>
      </g>
      ${getTerminalOverlay(theme)}
    </svg>
  `);
}

export function generateErrorSVG(message: string): string {
  return minifySVG(`
    <svg width="495" height="195" viewBox="0 0 495 195" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0.5" y="0.5" width="494" height="194" rx="4.5" fill="#fffefe" stroke="#E4E2E2"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" fill="#D32F2F">
        Something went wrong:
      </text>
      <text x="50%" y="65%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#666">
        ${message}
      </text>
    </svg>
  `);
}
