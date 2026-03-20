import { getAllPosts } from "@/lib/posts/mdx";
import PostList from "@/components/posts/PostList";
import { SITE_DESCRIPTION } from "@/lib/constants";

export default function HomePage() {
  const posts = getAllPosts();

  return (
    <>
      <section className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">Observatory</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          {SITE_DESCRIPTION}
        </p>
      </section>
      <PostList posts={posts} />
    </>
  );
}
