import { apiGet } from '@/lib/api';
import PostsListClient from '@/components/PostsListClient';
import { PostsListResponseSchema } from '@/types/posts';

export default async function Home() {
  const first = await apiGet('/posts?take=20', PostsListResponseSchema);

  return (
    <main style={{ padding: 40 }}>
      <h1>Posts</h1>
      <PostsListClient initial={first} />
    </main>
  );
}
