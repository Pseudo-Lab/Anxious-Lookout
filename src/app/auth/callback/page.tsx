"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        router.push("/");
      }
    });
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-300 border-t-indigo-600" />
      <p className="mt-4 text-sm text-stone-500">인증 처리 중...</p>
    </div>
  );
}
