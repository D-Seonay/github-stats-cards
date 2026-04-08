import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");
  
  if (!username) return NextResponse.json([], { status: 400 });

  const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=50`, {
    headers: { Authorization: `bearer ${process.env.GH_TOKEN}` }
  });
  const data = await res.json();
  
  return NextResponse.json(Array.isArray(data) ? data.map((r: any) => r.name) : []);
}
