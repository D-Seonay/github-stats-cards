import { fetchTopLanguages } from "../src/github-fetcher.js";
import { generateLanguagesSVG, generateErrorSVG } from "../src/svg-generator.js";
import { getTheme } from "../src/themes.js";
import { getTranslations } from "../src/locales.js";

export default async function handler(req: any, res: any) {
  const { username, theme, bg_color, locale } = req.query;

  if (!username) {
    res.setHeader("Content-Type", "image/svg+xml");
    return res.status(400).send(generateErrorSVG("Username is required"));
  }

  try {
    const data = await fetchTopLanguages(username as string);
    const themeObj = getTheme(theme as string, bg_color as string);
    const translations = getTranslations(locale as string);
    const svg = generateLanguagesSVG(data, themeObj, translations);

    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "public, max-age=7200, s-maxage=86400, stale-while-revalidate=86400");
    return res.status(200).send(svg);
  } catch (error: any) {
    res.setHeader("Content-Type", "image/svg+xml");
    return res.status(500).send(generateErrorSVG(error.message));
  }
}
