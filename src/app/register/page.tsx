"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../store/auth";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await register(form.name, form.email, form.password);
      if (!res.success) {
        setError(res.error || "Registration failed");
        return;
      }
      router.push("/");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center bg-indigo-100 min-h-screen">
      <div className="flex flex-col items-center justify-center border border-indigo-200 bg-white shadow-md rounded-lg p-8 max-w-3xl">
        <h1 className="text-3xl font-bold mb-4">Register</h1>
        <form className="flex flex-col gap-4 w-80" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-md font-medium">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="border border-gray-300 bg-indigo-100 p-2 rounded-md"
              required
              value={form.name}
              onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-md font-medium">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="border border-gray-300 bg-indigo-100 p-2 rounded-md"
              required
              value={form.email}
              onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-md font-medium">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="border border-gray-300 bg-indigo-100 p-2 rounded-md"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
            />
          </div>
          <button
            type="submit"
            className="bg-indigo-700 hover:bg-indigo-900 text-white p-2 rounded-md"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
          {error && <div className="text-red-500 text-sm">{error}</div>}
        </form>
        <p className="text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-700 hover:text-indigo-900 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}
