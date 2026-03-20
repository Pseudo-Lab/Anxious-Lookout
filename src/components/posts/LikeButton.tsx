"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getLikeCount, hasUserLiked, toggleLike } from "@/lib/likes/api";

interface LikeButtonProps {
  postSlug: string;
}

export default function LikeButton({ postSlug }: LikeButtonProps) {
  const { user } = useAuth();
  const [count, setCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    getLikeCount(postSlug).then(setCount);
  }, [postSlug]);

  useEffect(() => {
    if (user) {
      hasUserLiked(postSlug, user.id).then(setLiked);
    }
  }, [postSlug, user]);

  async function handleClick() {
    if (!user) return;

    setAnimating(true);
    setTimeout(() => setAnimating(false), 300);

    // Optimistic update
    setLiked(!liked);
    setCount((prev) => (liked ? prev - 1 : prev + 1));

    const result = await toggleLike(postSlug, user.id);
    setLiked(result.liked);
    setCount(result.count);
  }

  return (
    <button
      onClick={handleClick}
      disabled={!user}
      title={user ? (liked ? "추천 취소" : "추천") : "로그인 후 추천할 수 있습니다"}
      className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
        liked
          ? "bg-indigo-100 text-indigo-700 ring-1 ring-indigo-200"
          : user
            ? "bg-stone-100 text-stone-600 hover:bg-indigo-50 hover:text-indigo-600"
            : "cursor-default bg-stone-100 text-stone-400"
      } ${animating ? "scale-110" : "scale-100"}`}
    >
      <svg
        className={`h-5 w-5 transition-transform ${animating ? "scale-125" : ""}`}
        fill={liked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V3a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m7.594-9.75H12.72M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
        />
      </svg>
      {count > 0 && <span>{count}</span>}
    </button>
  );
}
