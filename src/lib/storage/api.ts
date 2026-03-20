import { supabase } from "@/lib/supabase/client";

const BUCKET = "blog-images";

export async function uploadImage(
  userId: string,
  file: File
): Promise<string> {
  const ext = file.name.split(".").pop() ?? "png";
  const path = `${userId}/${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type });

  if (uploadError) throw uploadError;

  // Get public URL
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);

  // Track in attachments table
  await supabase.from("attachments").insert({
    owner_user_id: userId,
    path,
    mime_type: file.type,
    size: file.size,
  });

  return data.publicUrl;
}

export async function deleteImage(path: string): Promise<void> {
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) throw error;

  await supabase.from("attachments").delete().eq("path", path);
}
