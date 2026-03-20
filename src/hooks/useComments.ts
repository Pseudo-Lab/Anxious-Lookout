"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
} from "@/lib/comments/api";
import type { Comment } from "@/lib/supabase/types";

export function useComments(postSlug: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getComments(postSlug);
      setComments(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "댓글을 불러올 수 없습니다.");
    } finally {
      setLoading(false);
    }
  }, [postSlug]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  async function add(userId: string, body: string, parentId?: string) {
    const comment = await createComment(postSlug, userId, body, parentId);
    setComments((prev) => [...prev, comment]);
    return comment;
  }

  async function edit(commentId: string, body: string) {
    const updated = await updateComment(commentId, body);
    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? updated : c))
    );
    return updated;
  }

  async function remove(commentId: string) {
    await deleteComment(commentId);
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId ? { ...c, status: "deleted" as const } : c
      )
    );
  }

  return { comments, loading, error, add, edit, remove, refresh: fetch };
}
