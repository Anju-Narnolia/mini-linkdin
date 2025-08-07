"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../store/auth";
import { getMe, updateMe } from "../../lib/api";
import Image from "next/image";

export default function EditProfilePage() {
  const { token, user, setUser } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", bio: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!token) router.replace("/login");
  }, [token, router]);

  // Fetch latest user info
  useEffect(() => {
    if (!token) return;

    const fetchUser = async () => {
      try {
        const data = await getMe(token);
        setUser(data);
        setForm({ name: data.name || "", bio: data.bio || "" });
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [token, setUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const updated = await updateMe(token!, form);
      setUser(updated);
      setFormOpen(false);
    } catch (err) {
      setError((err as Error).message || "Update failed");
    } finally {
      setSaving(false);
    }
  };
  if (!token) return null;
  if (loading)
    return <div className="flex justify-center mt-10">Loading...</div>;

  return (
    <main className="flex flex-col items-center justify-center  p-4 max-w-8xl bg-indigo-300">
      <div className="w-full max-w-md flex items-center gap-6 border p-4 rounded-md shadow-md">
        <Image
          src={"https://www.w3schools.com/howto/img_avatar.png"}
          alt={user?.name || "Profile"}
          width={100}
          height={100}
          className="rounded-full"
        />
        <div>
          <h1 className="text-3xl font-bold mb-1">{user?.name}</h1>
          <h2 className="text-lg text-gray-600 mb-2">{user?.email}</h2>
          <p className="text-sm text-gray-500">{user?.bio}</p>
          <button
            className="mt-4 text-indigo-700 hover:underline font-semibold"
            onClick={() => setFormOpen(true)}
          >
            Edit Profile
          </button>
        </div>
      </div>

      {formOpen && (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 mt-8 w-full max-w-md border p-4 rounded-md shadow-sm"
        >
          <div>
            <label className="block mb-1 font-medium">Full Name</label>
            <input
              type="text"
              required
              className="input input-bordered w-full p-2 border border-gray-300 rounded"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">About</label>
            <textarea
              maxLength={300}
              className="textarea textarea-bordered w-full p-2 border border-gray-300 rounded"
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
            />
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              className="btn btn-primary bg-indigo-700 text-white px-4 py-2 rounded"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              className="btn btn-secondary text-gray-600 border px-4 py-2 rounded"
              onClick={() => setFormOpen(false)}
            >
              Cancel
            </button>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>
      )}
    </main>
  );
}
