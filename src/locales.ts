export interface Translations {
  statsTitle: string;
  totalStars: string;
  totalCommits: string;
  totalPRs: string;
  totalIssues: string;
  contributedTo: string;
  topLangsTitle: string;
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
  },
  fr: {
    statsTitle: "Statistiques GitHub de {name}",
    totalStars: "Total d'étoiles :",
    totalCommits: "Total de commits :",
    totalPRs: "Total de Pull Requests :",
    totalIssues: "Total d'Issues :",
    contributedTo: "Dépôts contribués :",
    topLangsTitle: "Langages les plus utilisés",
  },
  es: {
    statsTitle: "Estadísticas de GitHub de {name}",
    totalStars: "Estrellas totales:",
    totalCommits: "Commits totales:",
    totalPRs: "PRs totales:",
    totalIssues: "Issues totales:",
    contributedTo: "Contribuyó a:",
    topLangsTitle: "Lenguajes más usados",
  },
  de: {
    statsTitle: "GitHub-Statistiken von {name}",
    totalStars: "Sterne insgesamt:",
    totalCommits: "Commits insgesamt:",
    totalPRs: "PRs insgesamt:",
    totalIssues: "Issues insgesamt:",
    contributedTo: "Mitgewirkt an:",
    topLangsTitle: "Meistgenutzte Sprachen",
  },
  jp: {
    statsTitle: "{name} の GitHub 統計",
    totalStars: "スター合計:",
    totalCommits: "コミット合計:",
    totalPRs: "PR 合計:",
    totalIssues: "Issue 合計:",
    contributedTo: "貢献したリポジトリ:",
    topLangsTitle: "主な使用言語",
  },
};

export function getTranslations(locale: string = "en"): Translations {
  return locales[locale] || locales.en;
}
