import { supabase } from "@/lib/supabase/client";
import type { PostDraft } from "@/lib/supabase/types";

export async function getPublishedPosts(): Promise<PostDraft[]> {
  const { data, error } = await supabase
    .from("post_drafts")
    .select("*, profiles:author_id(display_name)")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (
    (data ?? []).map((row: Record<string, unknown>) => {
      const profiles = row.profiles as { display_name: string } | null;
      return {
        ...row,
        author_name: profiles?.display_name ?? "",
        profiles: undefined,
      } as PostDraft;
    })
  );
}

function mapRowWithAuthor(row: Record<string, unknown>): PostDraft {
  const profiles = row.profiles as { display_name: string } | null;
  return {
    ...row,
    author_name: profiles?.display_name ?? "",
    profiles: undefined,
  } as PostDraft;
}

export async function getPublishedPostBySlug(
  slugOrId: string
): Promise<PostDraft | null> {
  const selectFields = "*, profiles:author_id(display_name)";

  // Try by slug first
  const { data: bySlug } = await supabase
    .from("post_drafts")
    .select(selectFields)
    .eq("slug", slugOrId)
    .eq("status", "published")
    .maybeSingle();

  if (bySlug) return mapRowWithAuthor(bySlug as Record<string, unknown>);

  // Fallback to id
  const { data: byId } = await supabase
    .from("post_drafts")
    .select(selectFields)
    .eq("id", slugOrId)
    .eq("status", "published")
    .maybeSingle();

  return byId ? mapRowWithAuthor(byId as Record<string, unknown>) : null;
}
