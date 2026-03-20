"use client";

import Link from "next/link";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

function AdminDashboard() {
  const links = [
    {
      href: "/admin/users/",
      title: "회원 관리",
      desc: "회원 승인, 역할 변경",
    },
    {
      href: "/admin/posts/",
      title: "글 관리",
      desc: "발행된 글 조회, MDX 복사",
    },
    {
      href: "/admin/comments/",
      title: "댓글 관리",
      desc: "댓글 모더레이션, 숨김/삭제",
    },
  ];

  return (
    <>
      <h1 className="mb-8 text-2xl font-bold">관리자 대시보드</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="rounded-lg border border-zinc-200 p-5 hover:border-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-500"
          >
            <h2 className="font-semibold">{l.title}</h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {l.desc}
            </p>
          </Link>
        ))}
      </div>
    </>
  );
}

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminDashboard />
    </ProtectedRoute>
  );
}
