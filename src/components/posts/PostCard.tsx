import Link from "next/link";
import type { Post } from "@/types/post";
import TagBadge from "./TagBadge";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const { slug, frontmatter } = post;

  return (
    <article className="group rounded-xl bg-white p-6 shadow-sm ring-1 ring-stone-200/60 transition-all hover:shadow-md hover:ring-indigo-200">
      <Link href={`/posts/${slug}/`} className="block">
        <h2 className="text-xl font-semibold tracking-tight text-stone-900 transition-colors group-hover:text-indigo-600">
          {frontmatter.title}
        </h2>
        <p className="mt-2 line-clamp-2 text-stone-500">
          {frontmatter.description}
        </p>
      </Link>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span className="text-sm text-stone-400">
          {frontmatter.author} &middot; {frontmatter.date}
        </span>
        <div className="flex gap-2">
          {frontmatter.tags?.map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
      </div>
    </article>
  );
}
