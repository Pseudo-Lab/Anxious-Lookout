import Link from "next/link";

interface TagBadgeProps {
  tag: string;
}

export default function TagBadge({ tag }: TagBadgeProps) {
  return (
    <Link
      href={`/posts?tag=${encodeURIComponent(tag)}`}
      className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600 transition-colors hover:bg-indigo-100"
    >
      {tag}
    </Link>
  );
}
