import Link from "next/link";
import { getAllTags, getPostsByTag } from "@/lib/posts/mdx";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "태그",
  description: "모든 태그 목록",
};

export default function TagsPage() {
  const tags = getAllTags();

  return (
    <>
      <h1 className="mb-8 text-3xl font-bold tracking-tight">태그</h1>
      {tags.length === 0 ? (
        <p className="text-zinc-500 dark:text-zinc-400">
          아직 태그가 없습니다.
        </p>
      ) : (
        <div className="flex flex-wrap gap-3">
          {tags.map((tag) => {
            const count = getPostsByTag(tag).length;
            return (
              <Link
                key={tag}
                href={`/tags/${tag}/`}
                className="rounded-lg border border-zinc-200 px-4 py-2 text-sm hover:border-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-500"
              >
                {tag}{" "}
                <span className="text-zinc-400 dark:text-zinc-500">
                  ({count})
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
