"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useComments } from "@/hooks/useComments";
import { supabase } from "@/lib/supabase/client";
import type { Profile } from "@/lib/supabase/types";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";

interface CommentSectionProps {
  postSlug: string;
}

export default function CommentSection({ postSlug }: CommentSectionProps) {
  const { user } = useAuth();
  const { isAdmin } = useProfile();
  const { comments, loading, error, add, edit, remove } =
    useComments(postSlug);
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});

  // Fetch profiles for comment authors
  useEffect(() => {
    const userIds = [...new Set(comments.map((c) => c.user_id))];
    const missing = userIds.filter((id) => !profiles[id]);
    if (missing.length === 0) return;

    supabase
      .from("profiles")
      .select("*")
      .in("id", missing)
      .then(({ data }) => {
        if (!data) return;
        setProfiles((prev) => {
          const next = { ...prev };
          data.forEach((p) => {
            next[p.id] = p as Profile;
          });
          return next;
        });
      });
  }, [comments, profiles]);

  // Organize into threads: top-level + replies
  const topLevel = comments.filter((c) => !c.parent_id);
  const replies = comments.filter((c) => c.parent_id);

  function getReplies(parentId: string) {
    return replies.filter((r) => r.parent_id === parentId);
  }

  return (
    <section className="mt-12 rounded-xl bg-white/40 p-6 ring-1 ring-stone-200/40 backdrop-blur-sm">
      <h2 className="mb-6 text-xl font-semibold">
        댓글 {comments.filter((c) => c.status === "published").length > 0 &&
          `(${comments.filter((c) => c.status === "published").length})`}
      </h2>

      {loading && (
        <p className="text-sm text-zinc-500">댓글을 불러오는 중...</p>
      )}

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {!loading && (
        <div className="divide-y divide-stone-200/60">
          {topLevel.map((comment) => (
            <div key={comment.id}>
              <CommentItem
                comment={comment}
                authorProfile={profiles[comment.user_id] ?? null}
                currentUserId={user?.id ?? null}
                isAdmin={isAdmin}
                onEdit={edit}
                onDelete={remove}
                onReply={async (body, parentId) => {
                  if (!user) return;
                  await add(user.id, body, parentId);
                }}
              />
              {getReplies(comment.id).map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  authorProfile={profiles[reply.user_id] ?? null}
                  currentUserId={user?.id ?? null}
                  isAdmin={isAdmin}
                  onEdit={edit}
                  onDelete={remove}
                  onReply={async (body, parentId) => {
                    if (!user) return;
                    await add(user.id, body, parentId);
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      )}

      {user ? (
        <div className="mt-6">
          <CommentForm
            onSubmit={async (body) => {
              await add(user.id, body);
            }}
          />
        </div>
      ) : (
        <p className="mt-6 text-sm text-zinc-500">
          댓글을 작성하려면{" "}
          <a href="/auth/login/" className="text-blue-600 hover:underline">
            로그인
          </a>
          이 필요합니다.
        </p>
      )}
    </section>
  );
}
