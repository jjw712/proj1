'use client';

import { useState } from 'react';
import { apiGet } from '@/lib/api';
import type { Post, PostsListResponse } from '@/types/posts';
import { PostsListResponseSchema } from '@/types/posts';

type Props = {
  initial: PostsListResponse;
};

export default function PostsListClient({ initial }: Props) {
  const [items, setItems] = useState<Post[]>(initial.items);
  const [nextCursor, setNextCursor] = useState<number | null>(initial.nextCursor);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function loadMore() {
    if (loading || nextCursor === null) return;

    setLoading(true);
    setErr(null);

    try {
      const data = await apiGet(
        `/posts?take=20&cursor=${nextCursor}`,
        PostsListResponseSchema,
      );

      setItems((prev) => {
        const seen = new Set(prev.map((p) => p.id));
        const merged = [...prev];
        for (const p of data.items) {
          if (!seen.has(p.id)) merged.push(p);
        }
        return merged;
      });

      setNextCursor(data.nextCursor);
    } catch {
      setErr('load failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <ul>
        {items.map((p) => (
          <li key={p.id}>
            <b>{p.title}</b> - {p.content}
          </li>
        ))}
      </ul>

      {err && <p style={{ color: 'crimson' }}>{err}</p>}

      {nextCursor !== null ? (
        <button onClick={loadMore} disabled={loading} style={{ marginTop: 16 }}>
          {loading ? 'Loading...' : 'Load more'}
        </button>
      ) : (
        <p style={{ marginTop: 16, opacity: 0.7 }}>No more posts</p>
      )}
    </>
  );
}
