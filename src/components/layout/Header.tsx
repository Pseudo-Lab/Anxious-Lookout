"use client";

import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";
import LoginButton from "@/components/auth/LoginButton";
import { useProfile } from "@/hooks/useProfile";

export default function Header() {
  const { isApproved, isAdmin } = useProfile();

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-stone-900">
          <span className="inline-block h-7 w-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600" />
          {SITE_NAME}
        </Link>
        <div className="flex items-center gap-6">
          <nav className="flex items-center gap-5 text-sm font-medium">
            <Link
              href="/"
              className="text-stone-500 transition-colors hover:text-indigo-600"
            >
              홈
            </Link>
            <Link
              href="/tags/"
              className="text-stone-500 transition-colors hover:text-indigo-600"
            >
              태그
            </Link>
            {isApproved && (
              <Link
                href="/write/"
                className="text-stone-500 transition-colors hover:text-indigo-600"
              >
                글 쓰기
              </Link>
            )}
            {isAdmin && (
              <Link
                href="/admin/"
                className="text-stone-500 transition-colors hover:text-indigo-600"
              >
                관리
              </Link>
            )}
          </nav>
          <LoginButton />
        </div>
      </div>
    </header>
  );
}
