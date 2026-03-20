"use client";

import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import type { UserRole } from "@/lib/supabase/types";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: UserRole;
  requireApproved?: boolean;
  fallback?: ReactNode;
}

export default function ProtectedRoute({
  children,
  requiredRole,
  requireApproved = false,
  fallback,
}: ProtectedRouteProps) {
  const { loading, user } = useAuth();
  const { role, isApproved } = useProfile();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-zinc-500">
        로딩 중...
      </div>
    );
  }

  if (!user) {
    return (
      fallback ?? (
        <div className="py-20 text-center">
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            로그인이 필요합니다.
          </p>
          <a
            href="/auth/login/"
            className="mt-4 inline-block text-blue-600 hover:underline"
          >
            로그인하기
          </a>
        </div>
      )
    );
  }

  if (requireApproved && !isApproved) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          관리자 승인을 기다리고 있습니다.
        </p>
        <p className="mt-2 text-sm text-zinc-500">
          승인 후 글 작성과 댓글 기능을 이용할 수 있습니다.
        </p>
      </div>
    );
  }

  if (requiredRole) {
    const roleLevel: Record<UserRole, number> = {
      commenter: 0,
      editor: 1,
      admin: 2,
    };
    if (role && roleLevel[role] < roleLevel[requiredRole]) {
      return (
        <div className="py-20 text-center text-zinc-600 dark:text-zinc-400">
          접근 권한이 없습니다.
        </div>
      );
    }
  }

  return <>{children}</>;
}
