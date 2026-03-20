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
      date: draft.created_at.split("T")[0],
      author: "",
      tags: draft.tags ?? [],
    },
    content: draft.body,
    source: "supabase",
  };
}

export default function SupabasePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

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

  return <PostList posts={posts} />;
}
