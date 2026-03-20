"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function LoginButton() {
  const { user, profile, loading, signOut } = useAuth();

  if (loading) {
    return (
      <span className="text-sm text-zinc-400">...</span>
    );
  }

  if (!user) {
    return (
      <Link
        href="/auth/login/"
        className="rounded-md bg-zinc-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        로그인
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-zinc-600 dark:text-zinc-400">
        {profile?.display_name || user.email}
      </span>
      <button
        onClick={() => signOut()}
        className="rounded-md border border-zinc-300 px-3 py-1 text-sm hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
      >
        로그아웃
      </button>
    </div>
  );
}
