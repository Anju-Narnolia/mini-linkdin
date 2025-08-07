'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../store/auth';

export default function NavBar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b bg-white shadow-sm">
      <Link href="/" className="font-bold text-2xl text-indigo-800">
        Mini-LinkedIn
      </Link>

      <div className="flex gap-4 items-center">
        {!user && (
          <>
            <Link
              href="/login"
              className="btn btn-sm btn-outline hover:underline hover:text-indigo-400 border border-indigo-700 py-2 px-4 rounded-md"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="btn btn-sm btn-outline text-gray-200 bg-indigo-700 hover:bg-indigo-900 p-2 rounded-md"
            >
              Register
            </Link>
          </>
        )}

        {user && (
          <>
            <Link
              href="/me"
              className="btn btn-sm btn-outline hover:underline hover:text-indigo-800 border border-indigo-800 px-4 py-2 rounded-md"
            >
              Profile
            </Link>
            <Link
              href="/posts/new"
              className="btn btn-sm btn-primary hover:text-indigo-900 px-4 py-2 bg-indigo-700 text-white rounded-md"
            >
              New Post
            </Link>
            <div className="flex items-center gap-2">
              <button
                onClick={handleLogout}
                className="btn btn-sm btn-outline text-red-900 border border-e-red-900 px-4 py-2 rounded-md hover:bg-red-200"
              >
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
