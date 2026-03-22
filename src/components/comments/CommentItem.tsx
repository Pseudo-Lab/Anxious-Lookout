"use client";

import { useState } from "react";
import type { Comment, Profile } from "@/lib/supabase/types";
import CommentForm from "./CommentForm";

interface CommentItemProps {
  comment: Comment;
  authorProfile: Profile | null;
  currentUserId: string | null;
  isAdmin: boolean;
  depth: number;
  parentAuthorName?: string | null;
  parentBody?: string | null;
  onEdit: (commentId: string, body: string) => Promise<unknown>;
  onDelete: (commentId: string) => Promise<unknown>;
  onReply: (body: string, parentId: string) => Promise<unknown>;
}

const MAX_INDENT = 3;

export default function CommentItem({
  comment,
  authorProfile,
  currentUserId,
  isAdmin,
  depth,
  parentAuthorName,
  parentBody,
  onEdit,
  onDelete,
  onReply,
}: CommentItemProps) {
  const [editing, setEditing] = useState(false);
  const [replying, setReplying] = useState(false);

  if (comment.status === "deleted") {
    return (
      <div className="py-3 text-sm text-zinc-400 italic dark:text-zinc-500">
        삭제된 댓글입니다.
      </div>
    );
  }

  if (comment.status === "hidden") {
    return (
      <div className="py-3 text-sm text-zinc-400 italic dark:text-zinc-500">
        숨김 처리된 댓글입니다.
      </div>
    );
  }

  const isOwner = currentUserId === comment.user_id;
  const canEdit = isOwner;
  const canDelete = isOwner || isAdmin;

  return (
    <div className={`py-4 ${depth > 0 ? "border-l-2 border-zinc-100 pl-4 dark:border-zinc-800" : ""}`} style={depth > 0 ? { marginLeft: `${Math.min(depth, MAX_INDENT) * 1.5}rem` } : undefined}>
      {depth > 0 && parentAuthorName && parentBody && (
        <div className="mb-2 flex items-start gap-1.5 rounded-md bg-stone-100/60 px-3 py-1.5 text-xs text-stone-500">
          <span className="shrink-0 font-medium text-stone-600">{parentAuthorName}:</span>
          <span className="line-clamp-1">{parentBody}</span>
        </div>
      )}
      <div className="flex items-center gap-2 text-sm">
        <span className="font-medium">
          {authorProfile?.display_name ?? "알 수 없음"}
        </span>
        <span className="text-zinc-400 dark:text-zinc-500">
          {new Date(comment.created_at).toLocaleString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>

      {editing ? (
        <div className="mt-2">
          <CommentForm
            initialValue={comment.body}
            submitLabel="수정"
            onSubmit={async (body) => {
              await onEdit(comment.id, body);
              setEditing(false);
            }}
            onCancel={() => setEditing(false)}
          />
        </div>
      ) : (
        <>
          <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed">
            {comment.body}
          </p>
          <div className="mt-2 flex gap-3 text-xs text-zinc-400">
            {currentUserId && (
              <button
                onClick={() => setReplying(!replying)}
                className="hover:text-zinc-600 dark:hover:text-zinc-300"
              >
                답글
              </button>
            )}
            {canEdit && (
              <button
                onClick={() => setEditing(true)}
                className="hover:text-zinc-600 dark:hover:text-zinc-300"
              >
                수정
              </button>
            )}
            {canDelete && (
              <button
                onClick={() => onDelete(comment.id)}
                className="hover:text-red-500"
              >
                삭제
              </button>
            )}
          </div>
        </>
      )}

      {replying && (
        <div className="mt-3">
          <CommentForm
            placeholder="답글을 작성하세요..."
            submitLabel="답글"
            onSubmit={async (body) => {
              await onReply(body, comment.id);
              setReplying(false);
            }}
            onCancel={() => setReplying(false)}
          />
        </div>
      )}
    </div>
  );
}
