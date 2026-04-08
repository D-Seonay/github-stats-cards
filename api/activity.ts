import { fetchRecentActivity } from "@/src/github-fetcher";
import { generateActivitySVG, generateErrorSVG } from "@/src/svg-generator";
import { getTheme } from "@/src/themes";

export default async function handler(req: any, res: any) {
  const { username, theme, bg_color } = req.query;

  if (!username) {
    res.setHeader("Content-Type", "image/svg+xml");
    return res.status(400).send(generateErrorSVG("Username is required"));
  }

  try {
    const data = await fetchRecentActivity(username as string);
    const themeObj = getTheme(theme as string, bg_color as string);
    const svg = generateActivitySVG(data, themeObj);

    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "public, max-age=7200, s-maxage=86400, stale-while-revalidate=86400");
    return res.status(200).send(svg);
  } catch (error: any) {
    res.setHeader("Content-Type", "image/svg+xml");
    return res.status(500).send(generateErrorSVG(error.message));
  }
}
