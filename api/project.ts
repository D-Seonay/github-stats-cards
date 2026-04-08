import { fetchProject } from "@/src/github-fetcher";
import { generateProjectSVG, generateErrorSVG } from "@/src/svg-generator";
import { getTheme } from "@/src/themes";

export default async function handler(req: any, res: any) {
  const { username, repo, theme, bg_color } = req.query;

  if (!username || !repo) {
    res.setHeader("Content-Type", "image/svg+xml");
    return res.status(400).send(generateErrorSVG("Username and Repo are required"));
  }

  try {
    const data = await fetchProject(username as string, repo as string);
    const themeObj = getTheme(theme as string, bg_color as string);
    const svg = generateProjectSVG(data, themeObj);

    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "public, max-age=7200, s-maxage=86400, stale-while-revalidate=86400");
    return res.status(200).send(svg);
  } catch (error: any) {
    res.setHeader("Content-Type", "image/svg+xml");
    return res.status(500).send(generateErrorSVG(error.message));
  }
}
