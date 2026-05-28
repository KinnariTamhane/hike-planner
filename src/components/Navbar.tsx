"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  // Fix hydration error by only rendering after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (!isMounted) {
    return (
      <nav className="bg-white shadow-md sticky top-0 z-50 h-16" />
    );
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Layout */}
        <div className="sm:hidden">
          <div className="flex justify-between items-center h-14">
          <Link href="/" className="text-2xl font-bold text-green-700">
            Hike Planner
          </Link>
          {user ? (
            <button
              onClick={handleLogout}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Logout
            </button>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                href="/login"
                className="text-gray-700 hover:text-green-600 font-medium"
              >
                Login
              </Link>
            </div>
          )}
        </div>
        {user && (
          <div className="flex justify-between items-center mb-3 pb-3 border-t border-gray-100">
            <span className="text-gray-900 font-medium">Hi, {user.name}</span>
            <Link
              href="/saved"
              className="text-gray-700 hover:text-green-600"
              aria-label="Saved Hikes"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
              </svg>
            </Link>
          </div>
        )}
        </div>

        {/* Desktop Layout */}
        <div className="hidden sm:flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-green-700">
            Hike Planner
          </Link>
          <div className="flex items-center space-x-4">
            {user ? (
            <>
              <span className="text-gray-900 font-medium">Hi, {user.name}</span>
              <Link
                href="/saved"
                className="text-gray-700 hover:text-green-600"
                aria-label="Saved Hikes"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                </svg>
              </Link>
              <button
                onClick={handleLogout}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-gray-700 hover:text-green-600 font-medium"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Register
              </Link>
            </>
          )}
          </div>
        </div>
      </div>
    </nav>
  );
}
