import { supabase } from "@/lib/supabase/client";
import type { Comment } from "@/lib/supabase/types";

export async function getComments(postSlug: string): Promise<Comment[]> {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("post_slug", postSlug)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data as Comment[]) ?? [];
}

export async function createComment(
  postSlug: string,
  userId: string,
  body: string,
  parentId?: string
): Promise<Comment> {
  const { data, error } = await supabase
    .from("comments")
    .insert({
      post_slug: postSlug,
      user_id: userId,
      body,
      parent_id: parentId ?? null,
      status: "published",
    })
    .select()
    .single();

  if (error) throw error;
  return data as Comment;
}

export async function updateComment(
  commentId: string,
  body: string
): Promise<Comment> {
  const { data, error } = await supabase
    .from("comments")
    .update({ body })
    .eq("id", commentId)
    .select()
    .single();

  if (error) throw error;
  return data as Comment;
}

export async function deleteComment(commentId: string): Promise<void> {
  const { error } = await supabase
    .from("comments")
    .update({ status: "deleted" })
    .eq("id", commentId);

  if (error) throw error;
}
