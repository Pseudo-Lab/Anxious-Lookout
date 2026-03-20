import { getAllPosts } from "@/lib/posts/mdx";
import { SITE_DESCRIPTION } from "@/lib/constants";
import PostList from "@/components/posts/PostList";
import SupabasePosts from "@/components/posts/SupabasePosts";

export default function HomePage() {
  const mdxPosts = getAllPosts();

  return (
    <>
      <section className="mb-12 rounded-2xl bg-gradient-to-br from-indigo-50 via-white to-amber-50 px-8 py-12 shadow-sm ring-1 ring-stone-200/60">
        <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
          Anxious Lookout
        </p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-stone-900">
          초조한 전망대
        </h1>
        <p className="mt-3 max-w-xl text-lg text-stone-500">
          {SITE_DESCRIPTION}
        </p>
      </section>

      <section>
        <h2 className="mb-6 text-lg font-semibold text-stone-800">
          최근 글
        </h2>
        <SupabasePosts mdxPosts={mdxPosts} />
      </section>
    </>
  );
}
