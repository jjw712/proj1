import { z } from "zod";

async function fetchJson(input: RequestInfo, init?: RequestInit) {
  const res = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const msg = (data && (data.message || data.error)) || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

export async function apiGet<T>(url: string, schema: z.ZodType<T>): Promise<T> {
  const data = await fetchJson(url);
  return schema.parse(data);
}

export async function apiPost<TBody, TRes>(
  url: string,
  body: TBody,
  schema: z.ZodType<TRes>,
): Promise<TRes> {
  const data = await fetchJson(url, {
    method: "POST",
    body: JSON.stringify(body),
  });
  return schema.parse(data);
}
