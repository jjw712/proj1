import { PostSchema } from "@/lib/schemas";

export default async function PostDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const res = await fetch(`http://localhost:3001/api/posts/${params.id}`, {
    cache: "no-store",
  });
  const data = await res.json();
  const post = PostSchema.parse(data);

  return (
    <main style={{ padding: 24 }}>
      <h1>{post.title}</h1>
      <p style={{ opacity: 0.7 }}>{post.createdAt}</p>
      <pre style={{ whiteSpace: "pre-wrap" }}>{post.content}</pre>
    </main>
  );
}
