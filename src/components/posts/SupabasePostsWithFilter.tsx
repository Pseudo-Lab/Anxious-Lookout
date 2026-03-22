"use client";

import { useEffect, useState } from "react";
import { getPublishedPosts } from "@/lib/drafts/published";
import type { Post } from "@/types/post";
import type { PostDraft } from "@/lib/supabase/types";
import PostList from "./PostList";

function draftToPost(draft: PostDraft): Post {
  return {
    slug: draft.slug || draft.id,
    frontmatter: {
      title: draft.title,
      description: "",
      date: new Date(draft.created_at).toLocaleString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
      author: draft.author_name ?? "",
      tags: draft.tags ?? [],
    },
    content: draft.body,
    source: "supabase",
  };
}

export default function SupabasePostsWithFilter() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    getPublishedPosts()
      .then((drafts) => {
        setPosts(drafts.map(draftToPost));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-stone-300 border-t-indigo-600" />
      </div>
    );
  }

  // 모든 태그 수집
  const tagCounts = new Map<string, number>();
  posts.forEach((p) => {
    p.frontmatter.tags?.forEach((tag) => {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    });
  });
  const tags = [...tagCounts.entries()].sort((a, b) => b[1] - a[1]);

  const filtered = selectedTag
    ? posts.filter((p) => p.frontmatter.tags?.includes(selectedTag))
    : posts;

  return (
    <>
      {tags.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedTag(null)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              !selectedTag
                ? "bg-indigo-600 text-white"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            전체 ({posts.length})
          </button>
          {tags.map(([tag, count]) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                selectedTag === tag
                  ? "bg-indigo-600 text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {tag} ({count})
            </button>
          ))}
        </div>
      )}
      <PostList posts={filtered} />
    </>
  );
}
