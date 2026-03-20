import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/posts/mdx";
import PostContent from "@/components/posts/PostContent";
import TagBadge from "@/components/posts/TagBadge";
import CommentSection from "@/components/comments/CommentSection";
import LikeButton from "@/components/posts/LikeButton";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      type: "article",
      publishedTime: post.frontmatter.date,
      authors: [post.frontmatter.author],
      tags: post.frontmatter.tags,
    },
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article>
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-stone-900">
          {post.frontmatter.title}
        </h1>
        <p className="mt-2 text-stone-500">
          {post.frontmatter.description}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="text-sm text-stone-500">
            {post.frontmatter.author} &middot; {post.frontmatter.date}
          </span>
          <div className="flex gap-2">
            {post.frontmatter.tags?.map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
        </div>
      </header>
      <PostContent content={post.content} />
      <div className="mt-10 flex items-center justify-center border-t border-stone-200 pt-8">
        <LikeButton postSlug={slug} />
      </div>
      <CommentSection postSlug={slug} />
    </article>
  );
}
