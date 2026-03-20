import SupabasePostsWithFilter from "@/components/posts/SupabasePostsWithFilter";

export default function AllPostsPage() {
  return (
    <>
      <h1 className="mb-8 text-2xl font-bold text-stone-900">전체 글</h1>
      <SupabasePostsWithFilter />
    </>
  );
}
