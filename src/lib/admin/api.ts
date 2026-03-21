import { supabase } from "@/lib/supabase/client";
import type { PostDraft, Profile, Comment } from "@/lib/supabase/types";

// ---- Drafts (관리자 조회용) ----

export async function getAllDrafts(): Promise<PostDraft[]> {
  const { data, error } = await supabase
    .from("post_drafts")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return (data as PostDraft[]) ?? [];
}

// ---- Users ----

export async function getAllProfiles(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data as Profile[]) ?? [];
}

export async function approveUser(userId: string): Promise<void> {
  const { error } = await supabase
    .from("profiles")
    .update({ is_approved: true })
    .eq("id", userId);

  if (error) throw error;
}

export async function revokeUser(userId: string): Promise<void> {
  const { error } = await supabase
    .from("profiles")
    .update({ is_approved: false })
    .eq("id", userId);

  if (error) throw error;
}

export async function updateUserRole(
  userId: string,
  role: Profile["role"]
): Promise<void> {
  const { error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", userId);

  if (error) throw error;
}

// ---- Comments ----

export async function getAllComments(): Promise<Comment[]> {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as Comment[]) ?? [];
}

export async function moderateComment(
  commentId: string,
  status: Comment["status"]
): Promise<void> {
  const { error } = await supabase
    .from("comments")
    .update({ status })
    .eq("id", commentId);

  if (error) throw error;
}
