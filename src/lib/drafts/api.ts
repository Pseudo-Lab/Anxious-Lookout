import { supabase } from "@/lib/supabase/client";
import type { PostDraft, DraftStatus } from "@/lib/supabase/types";

export async function getMyDrafts(authorId: string): Promise<PostDraft[]> {
  const { data, error } = await supabase
    .from("post_drafts")
    .select("*")
    .eq("author_id", authorId)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return (data as PostDraft[]) ?? [];
}

export async function getDraftById(id: string): Promise<PostDraft | null> {
  const { data, error } = await supabase
    .from("post_drafts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as PostDraft | null;
}

export async function createDraft(
  authorId: string,
  title: string,
  body: string,
  tags: string[]
): Promise<PostDraft> {
  const { data, error } = await supabase
    .from("post_drafts")
    .insert({
      author_id: authorId,
      title,
      body,
      tags,
      status: "draft",
    })
    .select()
    .single();

  if (error) throw error;
  return data as PostDraft;
}

export async function updateDraft(
  id: string,
  fields: {
    title?: string;
    body?: string;
    tags?: string[];
    cover_image_url?: string | null;
  }
): Promise<PostDraft> {
  const { data, error } = await supabase
    .from("post_drafts")
    .update(fields)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as PostDraft;
}

export async function publishDraft(id: string): Promise<PostDraft> {
  const { data, error } = await supabase
    .from("post_drafts")
    .update({ status: "published" as DraftStatus })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as PostDraft;
}

export async function deleteDraft(id: string): Promise<void> {
  const { error } = await supabase
    .from("post_drafts")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
