import { fetchStreak } from "@/src/github-fetcher";
import { generateStreakSVG, generateErrorSVG } from "@/src/svg-generator";
import { getTheme } from "@/src/themes";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");
  const theme = searchParams.get("theme");
  const bg_color = searchParams.get("bg_color");

  if (!username) {
    return new NextResponse(generateErrorSVG("Username is required"), {
      status: 400,
      headers: { "Content-Type": "image/svg+xml" },
    });
  }

  try {
    const data = await fetchStreak(username);
    const themeObj = getTheme(theme || "light", bg_color || undefined);
    const svg = generateStreakSVG(data, themeObj);

    return new NextResponse(svg, {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=7200, s-maxage=86400, stale-while-revalidate=86400",
      },
    });
  } catch (error: any) {
    return new NextResponse(generateErrorSVG(error.message), {
      status: 500,
      headers: { "Content-Type": "image/svg+xml" },
    });
  }
}
