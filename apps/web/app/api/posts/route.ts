import { NextResponse } from "next/server";

const API_BASE = process.env.API_BASE;
if (!API_BASE) throw new Error("API_BASE is not set");

function upstreamPostsUrl(req: Request) {
  // req.url이 상대경로로 들어와도 안전하게 처리
  const u = new URL(req.url, "http://localhost");

  // 항상 API 서버의 /posts 로 보냄
  const upstream = new URL("/api/posts", API_BASE);
  upstream.search = u.search; // ?take=20 같은 쿼리 그대로 전달
  return upstream.toString();
}

export async function GET(req: Request) {
  const upstream = upstreamPostsUrl(req);

  const res = await fetch(upstream, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  return new NextResponse(await res.text(), {
    status: res.status,
    headers: { "Content-Type": res.headers.get("content-type") ?? "application/json" },
  });
}

export async function POST(req: Request) {
  const upstream = new URL("/api/posts", API_BASE).toString();

  const res = await fetch(upstream, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: await req.text(),
    cache: "no-store",
  });

  return new NextResponse(await res.text(), {
    status: res.status,
    headers: { "Content-Type": res.headers.get("content-type") ?? "application/json" },
  });
}
