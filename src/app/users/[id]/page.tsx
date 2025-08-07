'use client'
// import { PageProps } from "../../../../.next/types/app/layout";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
type Post = { _id: string; text: string };
type User = { name: string; bio: string; posts: Post[] };

export default function UserPage() {
  const params = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [postText, setPostText] = useState("");
  const [error, setError] = useState("");

  // Fetch user data
  useEffect(() => {
    console.log("User ID from URL:", params.id);

    const fetchUser = async () => {
      setLoading(true);
      const res = await fetch(`/api/users/${params.id}`);
      if (!res.ok) {
        setUser(null);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setUser(data);
      setLoading(false);
    };
    fetchUser();
  }, [params.id]);

  // Handle new post
  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch(`/api/users/${params.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: postText }),
    });
    if (!res.ok) {
      setError("Failed to post.");
      return;
    }
    const newPost = await res.json();
    setUser((prev) =>
      prev ? { ...prev, posts: [newPost, ...prev.posts] } : prev
    );
    setPostText("");
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <main className="flex flex-col items-center justify-center bg-gray-50">
      <div className=" bg-gray-100 p-10 border border-gray-100 rounded-md w-full items-center justify-center flex flex-col">
        <h1 className="text-2xl font-bold mb-4 ">User Profile</h1>
        <div className="max-w-5xl flex gap-8">
          <Image
            src={"https://www.w3schools.com/howto/img_avatar.png"}
            alt={user?.name || "Profile"}
            width={100}
            height={100}
            className="rounded-lg"
          />
          <div className="mb-6 p-4 rounded">
            <div className="font-semibold flex gap-2">Name:<p className="text-gray-600 font-medium"> {user.name}</p></div>
            <div className="font-semibold flex gap-2">Email:<p className="text-gray-600 font-medium"> {user.name}</p></div>
            <div className="font-semibold flex">Bio:<p className="text-gray-500 font-medium">{user.bio || "Nothing added to bio"}</p> </div>
          </div>
        </div>
      </div>
      <div className="p-10 max-w-5xl ">
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <h2 className="text-4xl font-bold mb-2">Posts</h2>
        
          <ul className="space-y-16 ">
            {user.posts.map((post) => (
              <li key={post._id} className="p-4 border rounded">
                {post.text}
              </li>
            ))}
          </ul>
        </div>
    </main>
  );
}