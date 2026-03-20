"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { getAllDrafts } from "@/lib/admin/api";
import type { PostDraft } from "@/lib/supabase/types";

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function generateMdx(draft: PostDraft): string {
  const tags = draft.tags?.map((t) => `"${t}"`).join(", ") ?? "";
  const date = new Date().toISOString().split("T")[0];
  return `---
title: "${draft.title}"
description: ""
date: "${date}"
author: "작성자"
tags: [${tags}]
---

${draft.body}
`;
}

function PostManagement() {
  const [drafts, setDrafts] = useState<PostDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<PostDraft | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadDrafts();
  }, []);

  async function loadDrafts() {
    setLoading(true);
    try {
      setDrafts(await getAllDrafts());
    } finally {
      setLoading(false);
    }
  }

  function handleCopyMdx(draft: PostDraft) {
    const mdx = generateMdx(draft);
    navigator.clipboard.writeText(mdx);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const statusLabel: Record<string, string> = {
    draft: "초안",
    published: "발행됨",
  };

  const statusColor: Record<string, string> = {
    draft: "text-zinc-400",
    published: "text-green-600 dark:text-green-400",
  };

  if (loading) return <p className="text-zinc-500">불러오는 중...</p>;

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold">글 관리</h1>

      <div className="flex gap-6">
        {/* List */}
        <div className="w-72 shrink-0">
          <div className="space-y-2">
            {drafts.map((d) => (
              <button
                key={d.id}
                onClick={() => setSelected(d)}
                className={`w-full rounded-md border px-4 py-3 text-left text-sm hover:border-zinc-400 dark:hover:border-zinc-500 ${
                  selected?.id === d.id
                    ? "border-zinc-400 dark:border-zinc-500"
                    : "border-zinc-200 dark:border-zinc-700"
                }`}
              >
                <div className="truncate font-medium">{d.title}</div>
                <div className="mt-1 flex items-center gap-2 text-xs">
                  <span className={statusColor[d.status]}>
                    {statusLabel[d.status]}
                  </span>
                  <span className="text-zinc-400">
                    {new Date(d.updated_at).toLocaleDateString("ko-KR")}
                  </span>
                </div>
              </button>
            ))}
            {drafts.length === 0 && (
              <p className="text-sm text-zinc-400">글이 없습니다.</p>
            )}
          </div>
        </div>

        {/* Detail */}
        <div className="flex-1">
          {selected ? (
            <div>
              <h2 className="text-xl font-semibold">{selected.title}</h2>
              <div className="mt-2 flex items-center gap-3 text-sm text-zinc-500">
                <span className={statusColor[selected.status]}>
                  {statusLabel[selected.status]}
                </span>
                <span>태그: {selected.tags?.join(", ") || "없음"}</span>
              </div>

              {/* Markdown preview */}
              <div className="mt-4 max-h-96 overflow-y-auto rounded-md border border-zinc-200 p-4 text-sm dark:border-zinc-700">
                <pre className="whitespace-pre-wrap">{selected.body}</pre>
              </div>

              {/* Copy as MDX */}
              {selected.status === "published" && (
                <div className="mt-4">
                  <button
                    onClick={() => handleCopyMdx(selected)}
                    className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
                  >
                    {copied ? "복사됨!" : "MDX로 복사"}
                  </button>
                  <p className="mt-2 text-xs text-zinc-400">
                    복사 후 content/posts/&#123;slug&#125;.mdx 파일로 Git
                    커밋하면 정적 사이트에 반영됩니다.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="py-12 text-center text-zinc-400">
              왼쪽에서 글을 선택하세요.
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default function AdminPostsPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <PostManagement />
    </ProtectedRoute>
  );
}
