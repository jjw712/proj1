export default async function Home() {
  const res = await fetch('http://localhost:4000/api/posts', {
    cache: 'no-store',
  });

  if (!res.ok) throw new Error(`API error ${res.status}`);

  const json = await res.json();
  const posts = json.items ?? [];

  return (
    <main style={{ padding: 40 }}>
      <h1>Posts</h1>
      <ul>
        {posts.map((p: any) => (
          <li key={p.id}>
            <b>{p.title}</b> - {p.content}
          </li>
        ))}
      </ul>
    </main>
  );
}
