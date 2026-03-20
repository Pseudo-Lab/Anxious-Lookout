"use client";

import { useEffect, useState } from "react";
import { getPublishedPosts } from "@/lib/drafts/published";
import type { Post } from "@/types/post";
import type { PostDraft } from "@/lib/supabase/types";
import PostList from "./PostList";

interface SupabasePostsProps {
  mdxPosts: Post[];
}

function draftToPost(draft: PostDraft): Post {
  return {
    slug: draft.slug || draft.id,
    frontmatter: {
      title: draft.title,
      description: "",
      date: draft.created_at.split("T")[0],
      author: "",
      tags: draft.tags ?? [],
    },
    content: draft.body,
    source: "supabase" as const,
  };
}

export default function SupabasePosts({ mdxPosts }: SupabasePostsProps) {
  const [allPosts, setAllPosts] = useState<Post[]>(mdxPosts);

  useEffect(() => {
    getPublishedPosts()
      .then((drafts) => {
        const supabasePosts = drafts.map(draftToPost);
        const mdxSlugs = new Set(mdxPosts.map((p) => p.slug));
        const uniqueSupabase = supabasePosts.filter(
          (p) => !mdxSlugs.has(p.slug)
        );
        const merged = [...mdxPosts, ...uniqueSupabase].sort(
          (a, b) =>
            new Date(b.frontmatter.date).getTime() -
            new Date(a.frontmatter.date).getTime()
        );
        setAllPosts(merged);
      })
      .catch(() => {
        // Supabase 실패 시 MDX만 표시
      });
  }, [mdxPosts]);

  return <PostList posts={allPosts} />;
}
