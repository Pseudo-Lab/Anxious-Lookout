import Link from "next/link";
import type { Post } from "@/types/post";
import TagBadge from "./TagBadge";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const { slug, frontmatter } = post;

  return (
    <article className="group border-b border-zinc-100 py-8 first:pt-0 last:border-b-0 dark:border-zinc-800">
      <Link href={`/posts/${slug}/`} className="block">
        <h2 className="text-xl font-semibold tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400">
          {frontmatter.title}
        </h2>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          {frontmatter.description}
        </p>
      </Link>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <span className="text-sm text-zinc-500 dark:text-zinc-500">
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
