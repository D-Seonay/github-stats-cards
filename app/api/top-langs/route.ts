import { fetchTopLanguages, RateLimitError } from "@/src/github-fetcher";
import { generateLanguagesSVG, generateErrorSVG, generateRateLimitSVG } from "@/src/svg-generator";
import { getTheme } from "@/src/themes";
import { getTranslations } from "@/src/locales";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");
  const theme = searchParams.get("theme");
  const bg_color = searchParams.get("bg_color");
  const locale = searchParams.get("locale");
  const custom_css = searchParams.get("custom_css") || undefined;
  const font = searchParams.get("font") || undefined;

  const themeObj = getTheme(theme || "light", bg_color || undefined);

  if (!username) {
    return new NextResponse(generateErrorSVG("Username is required"), {
      status: 400,
      headers: { "Content-Type": "image/svg+xml" },
    });
  }

  try {
    const data = await fetchTopLanguages(username);
    const translations = getTranslations(locale || "en");
    const svg = generateLanguagesSVG(data, themeObj, translations, custom_css, font);

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
