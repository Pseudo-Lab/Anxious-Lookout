"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { getAllComments, moderateComment } from "@/lib/admin/api";
import type { Comment, CommentStatus } from "@/lib/supabase/types";

const statusLabel: Record<CommentStatus, string> = {
  published: "공개",
  hidden: "숨김",
  deleted: "삭제됨",
  pending: "대기",
};

const statusColor: Record<CommentStatus, string> = {
  published: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  hidden: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  deleted: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  pending: "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300",
};

function CommentManagement() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      setComments(await getAllComments());
    } finally {
      setLoading(false);
    }
  }

  async function handleModerate(commentId: string, status: CommentStatus) {
    await moderateComment(commentId, status);
    await load();
  }

  if (loading) return <p className="text-zinc-500">불러오는 중...</p>;

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold">댓글 관리</h1>

      <div className="space-y-3">
        {comments.map((c) => (
          <div
            key={c.id}
            className="rounded-md border border-zinc-200 p-4 dark:border-zinc-700"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-sm">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColor[c.status]}`}
                  >
                    {statusLabel[c.status]}
                  </span>
                  <span className="text-zinc-400">
                    글: {c.post_slug}
                  </span>
                  <span className="text-zinc-400">
                    {new Date(c.created_at).toLocaleDateString("ko-KR")}
                  </span>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm">{c.body}</p>
              </div>

              <div className="flex shrink-0 gap-2">
                {c.status !== "published" && (
                  <button
                    onClick={() => handleModerate(c.id, "published")}
                    className="rounded-md border border-green-300 px-3 py-1 text-xs text-green-700 hover:bg-green-50 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-950"
                  >
                    공개
                  </button>
                )}
                {c.status !== "hidden" && (
                  <button
                    onClick={() => handleModerate(c.id, "hidden")}
                    className="rounded-md border border-yellow-300 px-3 py-1 text-xs text-yellow-700 hover:bg-yellow-50 dark:border-yellow-700 dark:text-yellow-400 dark:hover:bg-yellow-950"
                  >
                    숨김
                  </button>
                )}
                {c.status !== "deleted" && (
                  <button
                    onClick={() => handleModerate(c.id, "deleted")}
                    className="rounded-md border border-red-300 px-3 py-1 text-xs text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-950"
                  >
                    삭제
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {comments.length === 0 && (
        <p className="mt-6 text-center text-sm text-zinc-400">
          댓글이 없습니다.
        </p>
      )}
    </>
  );
}

export default function AdminCommentsPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <CommentManagement />
    </ProtectedRoute>
  );
}
