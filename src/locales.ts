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
};

export function getTranslations(locale: string = "en"): Translations {
  return locales[locale] || locales.en;
}
