"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import {
  getAllProfiles,
  approveUser,
  revokeUser,
  updateUserRole,
} from "@/lib/admin/api";
import type { Profile, UserRole } from "@/lib/supabase/types";

const ROLES: UserRole[] = ["commenter", "editor", "admin"];

const roleLabel: Record<UserRole, string> = {
  commenter: "댓글 작성자",
  editor: "에디터",
  admin: "관리자",
};

function UserManagement() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      setProfiles(await getAllProfiles());
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(userId: string) {
    await approveUser(userId);
    await load();
  }

  async function handleRevoke(userId: string) {
    await revokeUser(userId);
    await load();
  }

  async function handleRoleChange(userId: string, role: UserRole) {
    await updateUserRole(userId, role);
    await load();
  }

  if (loading) return <p className="text-zinc-500">불러오는 중...</p>;

  const pendingUsers = profiles.filter((p) => !p.is_approved);
  const approvedUsers = profiles.filter((p) => p.is_approved);

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold">회원 관리</h1>

      {/* Pending approval */}
      {pendingUsers.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-yellow-600 dark:text-yellow-400">
            승인 대기 ({pendingUsers.length})
          </h2>
          <div className="space-y-3">
            {pendingUsers.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-md border border-yellow-200 bg-yellow-50 px-4 py-3 dark:border-yellow-900 dark:bg-yellow-950"
              >
                <div>
                  <span className="font-medium">{p.display_name}</span>
                  <span className="ml-2 text-sm text-zinc-500">
                    {new Date(p.created_at).toLocaleDateString("ko-KR")} 가입
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(p.id)}
                    className="rounded-md bg-green-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-green-700"
                  >
                    승인
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Approved users */}
      <section>
        <h2 className="mb-4 text-lg font-semibold">
          승인된 회원 ({approvedUsers.length})
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-200 text-xs uppercase text-zinc-500 dark:border-zinc-700">
              <tr>
                <th className="px-4 py-3">이름</th>
                <th className="px-4 py-3">역할</th>
                <th className="px-4 py-3">가입일</th>
                <th className="px-4 py-3">역할 변경</th>
                <th className="px-4 py-3">상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {approvedUsers.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3 font-medium">{p.display_name}</td>
                  <td className="px-4 py-3">{roleLabel[p.role]}</td>
                  <td className="px-4 py-3 text-zinc-500">
                    {new Date(p.created_at).toLocaleDateString("ko-KR")}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={p.role}
                      onChange={(e) =>
                        handleRoleChange(p.id, e.target.value as UserRole)
                      }
                      className="rounded-md border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>
                          {roleLabel[r]}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleRevoke(p.id)}
                      className="text-xs text-red-500 hover:underline"
                    >
                      승인 취소
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {approvedUsers.length === 0 && (
          <p className="mt-4 text-sm text-zinc-400">승인된 회원이 없습니다.</p>
        )}
      </section>
    </>
  );
}

export default function AdminUsersPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <UserManagement />
    </ProtectedRoute>
  );
}
