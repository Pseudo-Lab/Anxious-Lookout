"use client";

import { useEffect, useState } from "react";
import { getPublishedPostBySlug } from "@/lib/drafts/published";
import PostContent from "./PostContent";
import TagBadge from "./TagBadge";
import LikeButton from "./LikeButton";
import CommentSection from "@/components/comments/CommentSection";
import type { PostDraft } from "@/lib/supabase/types";

interface DynamicPostViewProps {
  slug: string;
}

export default function DynamicPostView({ slug }: DynamicPostViewProps) {
  const [post, setPost] = useState<PostDraft | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    getPublishedPostBySlug(slug)
      .then((data) => {
        if (data) {
          setPost(data);
        } else {
          setNotFound(true);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-300 border-t-indigo-600" />
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="py-20 text-center text-stone-500">
        글을 찾을 수 없습니다.
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-stone-900">
          {post.title}
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="text-sm text-stone-500">
            {post.created_at.split("T")[0]}
          </span>
          <div className="flex gap-2">
            {post.tags?.map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
        </div>
      </header>
      <PostContent content={post.body} />
      <div className="mt-10 flex items-center justify-center border-t border-stone-200 pt-8">
        <LikeButton postSlug={slug} />
      </div>
      <CommentSection postSlug={slug} />
    </article>
  );
}
