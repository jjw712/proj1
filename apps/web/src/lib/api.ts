import { ZodType } from 'zod';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE!;
if (!API_BASE) throw new Error('NEXT_PUBLIC_API_BASE is not set');

function makeUrl(path: string) {
  return (
    API_BASE.replace(/\/$/, '') +
    (path.startsWith('/') ? path : `/${path}`)
  );
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

export async function apiPost<T>(
  path: string,
  body: unknown,
  schema: ZodType<T>,
): Promise<T> {
  const res = await fetch(makeUrl(path), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    cache: 'no-store',
  });
  return parseOrThrow(res, schema);
}
