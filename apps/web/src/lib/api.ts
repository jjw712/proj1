import { ZodType } from 'zod';

function makeUrl(path: string) {
  const p = path.startsWith('/') ? path : `/${path}`;

  // 브라우저(클라)에서는 상대경로 OK
  if (typeof window !== 'undefined') return p;

  // 서버에서는 절대 URL이 필요할 수 있음 (네가 지금 여기서 터짐)
  const host = process.env.NEXT_PUBLIC_APP_ORIGIN || process.env.APP_ORIGIN;
  if (host) {
    return new URL(p, host).toString();
  }

  // NEXT 서버 런타임에서 기본 제공: VERCEL_URL 같은 거 없으면 fallback
  const fallback = `http://localhost:${process.env.PORT ?? '3001'}`;
  return new URL(p, fallback).toString();
}

async function parseOrThrow<T>(res: Response, schema: ZodType<T>) {
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API ${res.status} ${text}`);
  }
  const json = await res.json();
  return schema.parse(json);
}

export async function apiGet<T>(path: string, schema: ZodType<T>): Promise<T> {
  const res = await fetch(makeUrl(path), { cache: 'no-store' });
  return parseOrThrow(res, schema);
}

export async function apiPost<T>(path: string, body: unknown, schema: ZodType<T>): Promise<T> {
  const res = await fetch(makeUrl(path), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return parseOrThrow(res, schema);
}

export async function apiDelete(path: string): Promise<void> {
  const res = await fetch(makeUrl(path), { method: 'DELETE' });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API ${res.status} ${text}`);
  }
}

export async function apiPatch<T>(path: string, body: unknown, schema: ZodType<T>): Promise<T> {
  const res = await fetch(makeUrl(path), {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return parseOrThrow(res, schema);
}
