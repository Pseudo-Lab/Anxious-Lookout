export type UserRole = "admin" | "editor" | "commenter";

export type DraftStatus = "draft" | "published";

export type CommentStatus = "published" | "hidden" | "deleted" | "pending";

export interface Profile {
  id: string;
  display_name: string;
  role: UserRole;
  is_approved: boolean;
  avatar_url: string | null;
  created_at: string;
}

export interface PostMeta {
  post_slug: string;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  tags: string[];
  author_name: string;
  author_id: string | null;
  published_at: string | null;
  is_featured: boolean;
  created_at: string;
}

export interface PostDraft {
  id: string;
  author_id: string;
  title: string;
  slug: string | null;
  body: string;
  tags: string[];
  cover_image_url: string | null;
  status: DraftStatus;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  post_slug: string;
  user_id: string;
  parent_id: string | null;
  body: string;
  status: CommentStatus;
  created_at: string;
  updated_at: string;
}

export interface Attachment {
  id: string;
  owner_user_id: string;
  path: string;
  mime_type: string;
  size: number;
  created_at: string;
}
