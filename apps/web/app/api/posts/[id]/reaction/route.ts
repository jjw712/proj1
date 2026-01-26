import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.API_BASE ?? "http://localhost:4000";

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }, // 핵심: Promise
) {
  const { id } = await ctx.params;          // 핵심: await

  const body = await req.text();
  const upstream = `${API_BASE}/api/posts/${id}/reaction`;

  const res = await fetch(upstream, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    cache: "no-store",
  });

  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: {
      "Content-Type": res.headers.get("content-type") ?? "application/json",
    },
  });
}
