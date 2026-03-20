import { supabase } from "@/lib/supabase/client";

export async function getLikeCount(postSlug: string): Promise<number> {
  const { count } = await supabase
    .from("post_likes")
    .select("*", { count: "exact", head: true })
    .eq("post_slug", postSlug);
  return count ?? 0;
}

export async function hasUserLiked(
  postSlug: string,
  userId: string
): Promise<boolean> {
  const { data } = await supabase
    .from("post_likes")
    .select("id")
    .eq("post_slug", postSlug)
    .eq("user_id", userId)
    .maybeSingle();
  return !!data;
}

export async function toggleLike(
  postSlug: string,
  userId: string
): Promise<{ liked: boolean; count: number }> {
  const liked = await hasUserLiked(postSlug, userId);

  if (liked) {
    await supabase
      .from("post_likes")
      .delete()
      .eq("post_slug", postSlug)
      .eq("user_id", userId);
  } else {
    await supabase
      .from("post_likes")
      .insert({ post_slug: postSlug, user_id: userId });
  }

  const count = await getLikeCount(postSlug);
  return { liked: !liked, count };
}
