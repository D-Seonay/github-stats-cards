import { fetchTopRepos } from "../src/github-fetcher.js";
import { generateTopReposSVG, generateErrorSVG } from "../src/svg-generator.js";
import { getTheme } from "../src/themes.js";

export default async function handler(req: any, res: any) {
  const { username, theme, bg_color } = req.query;

  if (!username) {
    res.setHeader("Content-Type", "image/svg+xml");
    return res.status(400).send(generateErrorSVG("Username is required"));
  }

  try {
    const data = await fetchTopRepos(username as string);
    const themeObj = getTheme(theme as string, bg_color as string);
    const svg = generateTopReposSVG(data, themeObj);

    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "public, max-age=7200, s-maxage=86400, stale-while-revalidate=86400");
    return res.status(200).send(svg);
  } catch (error: any) {
    res.setHeader("Content-Type", "image/svg+xml");
    return res.status(500).send(generateErrorSVG(error.message));
  }
}
