"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../store/auth";
import { createPost } from "../../../lib/api";

export default function NewPostPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      router.replace("/login");
    }
  }, [token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    setError(null);

    try {
      await createPost(token!, text);
      setText("");
      router.push("/"); // redirect after successful post
    } catch (err) {
      setError((err as Error).message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  if (!token) return null;

  return (
    <main className="flex flex-col items-center justify-center h-[40rem] bg-gray-100">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 border bg-white border-gray-200 shadow shadow-gray-400 p-5 space-y-2 w-1/2 rounded-2xl">
      <h1 className="text-4xl font-bold mb-4">Create Post</h1>
      <label>What do you want to share?</label>
        <textarea
          placeholder=" Enter here (max 1000 chars)"
          className="textarea textarea-bordered h-60 border-gray-200 border p-2 bg-gray-100 rounded-md shadow"
          maxLength={1000}
          required
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          type="submit"
          className="btn btn-primary bg-indigo-700 text-white py-2 rounded-md hover:bg-indigo-950 cursor-pointer text-lg"
          disabled={loading || !text.trim()}
        >
          {loading ? "Posting..." : "Post"}
        </button>
        {error && <div className="text-red-500 text-sm">{error}</div>}
      </form>
    </main>
  );
}
