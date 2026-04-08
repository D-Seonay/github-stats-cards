export interface Translations {
  statsTitle: string;
  totalStars: string;
  totalCommits: string;
  totalPRs: string;
  totalIssues: string;
  contributedTo: string;
  topLangsTitle: string;
  streakTitle: string;
  currentStreak: string;
  longestStreak: string;
  totalContributions: string;
  topReposTitle: string;
  recentActivityTitle: string;
}

export const locales: Record<string, Translations> = {
  en: {
    statsTitle: "{name}'s GitHub Stats",
    totalStars: "Total Stars:",
    totalCommits: "Total Commits:",
    totalPRs: "Total PRs:",
    totalIssues: "Total Issues:",
    contributedTo: "Contributed to:",
    topLangsTitle: "Most Used Languages",
    streakTitle: "Contribution Streak",
    currentStreak: "Current Streak",
    longestStreak: "Longest Streak",
    totalContributions: "Total Contributions",
    topReposTitle: "Top Repositories",
    recentActivityTitle: "Recent Activity",
  },
  fr: {
    statsTitle: "Statistiques GitHub de {name}",
    totalStars: "Total d'étoiles :",
    totalCommits: "Total de commits :",
    totalPRs: "Total de Pull Requests :",
    totalIssues: "Total d'Issues :",
    contributedTo: "Dépôts contribués :",
    topLangsTitle: "Langages les plus utilisés",
    streakTitle: "Série de contributions",
    currentStreak: "Série actuelle",
    longestStreak: "Plus longue série",
    totalContributions: "Contributions totales",
    topReposTitle: "Meilleurs dépôts",
    recentActivityTitle: "Activité récente",
  },
  es: {
    statsTitle: "Estadísticas de GitHub de {name}",
    totalStars: "Estrellas totales:",
    totalCommits: "Commits totales:",
    totalPRs: "PRs totales:",
    totalIssues: "Issues totales:",
    contributedTo: "Contribuyó a:",
    topLangsTitle: "Lenguajes más usados",
    streakTitle: "Racha de contribuciones",
    currentStreak: "Racha actual",
    longestStreak: "Mejor racha",
    totalContributions: "Contribuciones totales",
    topReposTitle: "Mejores repositorios",
    recentActivityTitle: "Actividad reciente",
  },
  de: {
    statsTitle: "GitHub-Statistiken von {name}",
    totalStars: "Sterne insgesamt:",
    totalCommits: "Commits insgesamt:",
    totalPRs: "PRs insgesamt:",
    totalIssues: "Issues insgesamt:",
    contributedTo: "Mitgewirkt an:",
    topLangsTitle: "Meistgenutzte Sprachen",
    streakTitle: "Beitragsserie",
    currentStreak: "Aktuelle Serie",
    longestStreak: "Längste Serie",
    totalContributions: "Beiträge insgesamt",
    topReposTitle: "Top-Repositories",
    recentActivityTitle: "Neueste Aktivitäten",
  },
  jp: {
    statsTitle: "{name} の GitHub 統計",
    totalStars: "スター合計:",
    totalCommits: "コミット合計:",
    totalPRs: "PR 合計:",
    totalIssues: "Issue 合計:",
    contributedTo: "貢献したリポジトリ:",
    topLangsTitle: "主な使用言語",
    streakTitle: "コントリビューションの継続数",
    currentStreak: "現在の継続数",
    longestStreak: "最大継続数",
    totalContributions: "合計コントリビューション",
    topReposTitle: "トップリポジトリ",
    recentActivityTitle: "最近のアクティビティ",
  },
};

export function getTranslations(locale: string = "en"): Translations {
  return locales[locale] || locales.en;
}
