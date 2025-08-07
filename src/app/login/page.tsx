"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../../lib/api"; // your login API function
import Link from "next/link";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await login(form);

      // ✅ Store user and token locally
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));

      // ✅ Redirect
      router.push("/");
    } catch (err) {
      setError((err as Error).message||"Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center bg-indigo-100 h-[44rem]">
      <div className="flex flex-col items-center justify-center border border-indigo-200 bg-white shadow-md rounded-lg p-8 max-w-3xl">
        <h1 className="text-3xl font-bold mb-4">Login</h1>

        <form className="flex flex-col gap-4 w-80" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-md font-medium">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="input input-bordered border border-gray-300 bg-indigo-100 p-2 rounded-md"
              required
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-md font-medium">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="input input-bordered border border-gray-300 bg-indigo-100 p-2 rounded-md"
              required
              minLength={6}
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary hover:bg-indigo-900 bg-indigo-700 text-white p-2 rounded-md"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {error && <div className="text-red-500 text-sm">{error}</div>}
        </form>

        <p className="text-sm text-gray-500 mt-4">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-indigo-700 hover:text-indigo-900 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </main>
  );
}
