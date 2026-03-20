"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import DynamicPostView from "@/components/posts/DynamicPostView";

function ViewContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  if (!id) {
    return (
      <div className="py-20 text-center text-stone-500">
        글을 찾을 수 없습니다.
      </div>
    );
  }

  return <DynamicPostView slug={id} />;
}

export default function ViewPage() {
  return (
    <Suspense>
      <ViewContent />
    </Suspense>
  );
}
