"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function LoginButton() {
  const { user, profile, loading, signOut } = useAuth();

  if (loading) return null;

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/auth/login/?mode=signup"
          className="rounded-lg border border-indigo-600 px-4 py-1.5 text-sm font-medium text-indigo-600 transition-colors hover:bg-indigo-50"
        >
          회원가입
        </Link>
        <Link
          href="/auth/login/"
          className="rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
        >
          로그인
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-stone-600">
        {profile?.display_name || user.email}
      </span>
      <button
        onClick={() => signOut()}
        className="rounded-lg border border-stone-300 px-3 py-1 text-sm text-stone-500 transition-colors hover:bg-stone-100"
      >
        로그아웃
      </button>
    </div>
  );
}
