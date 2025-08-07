import { PageProps } from "../../../../.next/types/app/layout";

export default async function UserPage({ params }: PageProps) {
  const id = params;

  const res = await fetch(`http://localhost:3000/api/users/${id}`, {
    next: { revalidate: 60 }, // Optional: ISR
  });

  if (!res.ok) {
    return <div>User not found</div>;
  }

  const user = await res.json();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>
      <div className="w-full max-w-xl">
        <div className="mb-6 p-4 border rounded">
          <div className="font-semibold">Name: {user.name}</div>
          <div className="text-sm text-gray-500">Bio: {user.bio}</div>
        </div>
        <h2 className="text-xl font-bold mb-2">Posts</h2>
        <ul className="space-y-2">
          {user.posts.map((post: { _id: string; text: string }) => (
            <li key={post._id} className="p-2 border rounded">{post.text}</li>
          ))}
        </ul>
      </div>
    </main>
  );
}
