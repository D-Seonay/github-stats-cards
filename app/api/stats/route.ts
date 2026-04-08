import { fetchStats, RateLimitError } from "@/src/github-fetcher";
import { generateStatsSVG, generateErrorSVG, generateRateLimitSVG } from "@/src/svg-generator";
import { getTheme } from "@/src/themes";
import { getTranslations } from "@/src/locales";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");
  const theme = searchParams.get("theme");
  const bg_color = searchParams.get("bg_color");
  const locale = searchParams.get("locale");

  const themeObj = getTheme(theme || "light", bg_color || undefined);

  if (!username) {
    return new NextResponse(generateErrorSVG("Username is required"), {
      status: 400,
      headers: { "Content-Type": "image/svg+xml" },
    });
  }

  try {
    const data = await fetchStats(username);
    const translations = getTranslations(locale || "en");
    const svg = generateStatsSVG(data, themeObj, translations);

    return new NextResponse(svg, {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=7200, s-maxage=86400, stale-while-revalidate=86400",
      },
    });
  } catch (error: any) {
    if (error instanceof RateLimitError) {
      return new NextResponse(generateRateLimitSVG(themeObj), {
        status: 403,
        headers: { "Content-Type": "image/svg+xml", "Cache-Control": "no-store" },
      });
    }
    return new NextResponse(generateErrorSVG(error.message), {
      status: 500,
      headers: { "Content-Type": "image/svg+xml" },
    });
  }
}
