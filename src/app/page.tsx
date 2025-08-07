import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
async function getPosts() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/posts`, {
    cache: 'no-store',
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function FeedPage() {
  const posts = await getPosts();
  return (
    <main className="flex flex-col items-center min-h-screen p-5">
      <h1 className="text-4xl font-bold mb-6">Public Feed</h1>
      <div className="w-full max-w-4xl space-y-16">
        {posts.length === 0 && (
          <div className="text-gray-500 text-center">No posts yet.</div>
        )}
        {posts.map((post: { _id: string; text: string; createdAt: string; user: { _id: string; name?: string } }) => (
          <div key={post._id} className="p-4 border rounded bg-gray-50 hover:shadow-indigo-400 shadow-lg">
            <div className='flex gap-2 items-center'>
              <Image
                src={"https://www.w3schools.com/howto/img_avatar.png"}
                alt={"user"}
                width={30}
                height={30}
                className="rounded-full"
              />
              <p className="font-semibold text-2xl"><Link href={`/users/${post.user._id}`}>{post.user?.name || 'Unknown User'}</Link>
              </p>
            </div>
            <div className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleString()}</div>
            <p className="mt-2">{post.text}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
