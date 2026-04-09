import { NextResponse } from "next/server";

export async function GET() {
  const endpoints = [
    { name: "Stats Engine", path: "/api/stats" },
    { name: "Streak Calculator", path: "/api/streak" },
    { name: "Language Processor", path: "/api/top-langs" },
    { name: "Repository Tracker", path: "/api/top-repos" },
    { name: "Activity Feed", path: "/api/activity" },
    { name: "Trophy Milestones", path: "/api/trophies" },
    { name: "Organization Portal", path: "/api/org" },
  ];

  try {
    // Check GitHub Connectivity
    const startTime = Date.now();
    const ghResponse = await fetch("https://api.github.com/zen", {
      headers: { Authorization: `bearer ${process.env.GH_TOKEN}` }
    });
    const latency = Date.now() - startTime;

    return NextResponse.json({
      status: "operational",
      latency: `${latency}ms`,
      github_api: ghResponse.ok ? "connected" : "degraded",
      timestamp: new Date().toISOString(),
      services: endpoints.map(e => ({ ...e, status: "online" }))
    }, {
      status: 200,
      headers: { "Cache-Control": "no-store" }
    });
  } catch (error) {
    return NextResponse.json({
      status: "degraded",
      github_api: "disconnected",
      timestamp: new Date().toISOString(),
      services: endpoints.map(e => ({ ...e, status: "unknown" }))
    }, { status: 500 });
  }
}
