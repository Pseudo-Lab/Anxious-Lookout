"use client";

import Link from "next/link";
import { SITE_DESCRIPTION } from "@/lib/constants";

export default function Hero() {
  return (
    <section className="relative mb-12 overflow-hidden rounded-2xl px-8 py-16 shadow-sm ring-1 ring-stone-200/60">
      {/* Animated gradient background */}
      <div className="absolute inset-0 -z-10 animate-gradient bg-[length:400%_400%] bg-gradient-to-br from-indigo-100 via-white to-amber-100" />

      {/* Floating orbs - CSS only, no JS */}
      <div className="absolute -left-20 -top-20 h-72 w-72 animate-float rounded-full bg-indigo-200/30 blur-3xl" />
      <div className="absolute -bottom-16 -right-16 h-64 w-64 animate-float-delayed rounded-full bg-amber-200/30 blur-3xl" />
      <div className="absolute left-1/2 top-1/3 h-48 w-48 animate-float-slow rounded-full bg-purple-200/20 blur-3xl" />

      {/* Content */}
      <div className="relative">
        <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
          Anxious Lookout
        </p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-stone-900">
          초조한 전망대
        </h1>
        <p className="mt-3 max-w-xl text-lg text-stone-500">
          {SITE_DESCRIPTION}
        </p>
        <div className="mt-6 flex gap-3">
          <Link
            href="/posts/"
            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
          >
            글 둘러보기
          </Link>
          <Link
            href="/write/"
            className="rounded-lg border border-stone-300 bg-white/60 px-5 py-2.5 text-sm font-medium text-stone-700 backdrop-blur-sm transition-colors hover:bg-white"
          >
            글 쓰기
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(15px) scale(1.03); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateX(0) translateY(0); }
          33% { transform: translateX(10px) translateY(-10px); }
          66% { transform: translateX(-10px) translateY(5px); }
        }
        .animate-gradient { animation: gradient-shift 8s ease infinite; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 7s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 10s ease-in-out infinite; }
      `}</style>
    </section>
  );
}
