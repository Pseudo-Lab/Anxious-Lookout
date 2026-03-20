"use client";

import { useAuthContext } from "@/components/auth/AuthProvider";

export function useAuth() {
  return useAuthContext();
}
