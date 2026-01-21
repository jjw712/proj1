export default async function Home() {
  const res = await fetch('http://localhost:3000/posts', {
    cache: 'no-store',
  });
  const posts = await res.json();

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
