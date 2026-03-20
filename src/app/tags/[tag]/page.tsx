import { getAllTags, getPostsByTag } from "@/lib/posts/mdx";
import PostList from "@/components/posts/PostList";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ tag: string }>;
}

export async function generateStaticParams() {
  const tags = getAllTags();
  return tags.map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  return {
    title: `"${decoded}" 태그 글 목록`,
    description: `"${decoded}" 태그가 달린 글 모음`,
  };
}

export default async function TagPage({ params }: PageProps) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  const posts = getPostsByTag(decoded);

  return (
    <>
      <h1 className="mb-8 text-3xl font-bold tracking-tight">
        <span className="text-zinc-400 dark:text-zinc-500">#</span> {decoded}
      </h1>
      <PostList posts={posts} />
    </>
  );
}
