"use client";

import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";
import LoginButton from "@/components/auth/LoginButton";
import { useProfile } from "@/hooks/useProfile";

export default function Header() {
  const { isApproved, isAdmin } = useProfile();

  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold tracking-tight">
          {SITE_NAME}
        </Link>
        <div className="flex items-center gap-6">
          <nav className="flex items-center gap-6 text-sm">
            <Link
              href="/"
              className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              홈
            </Link>
            <Link
              href="/tags/"
              className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              태그
            </Link>
            {isApproved && (
              <Link
                href="/write/"
                className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                글 쓰기
              </Link>
            )}
            {isAdmin && (
              <Link
                href="/admin/"
                className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
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
