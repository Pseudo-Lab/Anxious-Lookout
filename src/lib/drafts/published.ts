import { supabase } from "@/lib/supabase/client";
import type { PostDraft } from "@/lib/supabase/types";

export async function getPublishedPosts(): Promise<PostDraft[]> {
  const { data, error } = await supabase
    .from("post_drafts")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as PostDraft[]) ?? [];
}

export async function getPublishedPostBySlug(
  slugOrId: string
): Promise<PostDraft | null> {
  // Try by slug first
  const { data: bySlug } = await supabase
    .from("post_drafts")
    .select("*")
    .eq("slug", slugOrId)
    .eq("status", "published")
    .maybeSingle();

  if (bySlug) return bySlug as PostDraft;

  // Fallback to id
  const { data: byId } = await supabase
    .from("post_drafts")
    .select("*")
    .eq("id", slugOrId)
    .eq("status", "published")
    .maybeSingle();

  return (byId as PostDraft) ?? null;
}
