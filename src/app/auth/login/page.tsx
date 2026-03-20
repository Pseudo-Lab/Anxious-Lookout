"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSignUp, setIsSignUp] = useState(searchParams.get("mode") === "signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    setSubmitting(true);

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: displayName || email },
        },
      });
      if (error) {
        setError(error.message);
      } else {
        setMessage("확인 이메일을 발송했습니다. 메일함을 확인해주세요.");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
      } else {
        router.push("/");
      }
    }

    setSubmitting(false);
  }

  return (
    <div className="mx-auto max-w-sm py-12">
      <h1 className="mb-8 text-center text-2xl font-bold text-stone-900">
        {isSignUp ? "회원가입" : "로그인"}
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {isSignUp && (
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700">표시 이름</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="스터디에서 사용할 이름"
            />
          </div>
        )}

        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">이메일</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="email@example.com"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="6자 이상"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
        {message && (
          <p className="text-sm text-green-600">{message}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
        >
          {submitting
            ? "처리 중..."
            : isSignUp
              ? "회원가입"
              : "로그인"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-stone-500">
        {isSignUp ? "이미 계정이 있나요?" : "아직 계정이 없나요?"}{" "}
        <button
          onClick={() => {
            setIsSignUp(!isSignUp);
            setError("");
            setMessage("");
          }}
          className="font-medium text-indigo-600 hover:underline"
        >
          {isSignUp ? "로그인" : "회원가입"}
        </button>
      </p>
    </div>
  );
}
