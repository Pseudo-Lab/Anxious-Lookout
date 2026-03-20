"use client";

import { useAuth } from "./useAuth";
import type { UserRole } from "@/lib/supabase/types";

export function useProfile() {
  const { profile, loading } = useAuth();

  const role: UserRole | null = profile?.role ?? null;
  const isAdmin = role === "admin";
  const isEditor = role === "editor" || role === "admin";
  const isApproved = profile?.is_approved ?? false;
  const isAuthenticated = profile !== null;

  return { profile, role, isAdmin, isEditor, isApproved, isAuthenticated, loading };
}
