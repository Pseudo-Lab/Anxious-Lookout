"use client";

import Link from "next/link";
import { SITE_DESCRIPTION } from "@/lib/constants";

export default function Hero() {
  return (
    <section className="relative mb-12 overflow-hidden rounded-2xl bg-white/30 px-8 py-16 shadow-sm ring-1 ring-white/50 backdrop-blur-sm">
      {/* Floating orbs */}
      <div className="absolute -left-16 top-4 h-56 w-56 animate-float rounded-full bg-white/40 blur-3xl" />
      <div className="absolute right-8 top-0 h-40 w-40 animate-float-delayed rounded-full bg-sky-200/30 blur-2xl" />
      <div className="absolute -bottom-12 -right-12 h-64 w-64 animate-float-slow rounded-full bg-blue-300/20 blur-3xl" />

      {/* Content */}
      <div className="relative">
        <p className="text-sm font-semibold uppercase tracking-widest text-sky-700">
          Anxious Lookout
        </p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-800">
          초조한 전망대
        </h1>
        <p className="mt-3 max-w-xl text-lg text-slate-600">
          {SITE_DESCRIPTION}
        </p>
        <div className="mt-6 flex gap-3">
          <Link
            href="/posts/"
            className="rounded-lg bg-slate-800 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-700"
          >
            글 둘러보기
          </Link>
          <Link
            href="/write/"
            className="rounded-lg border border-white/50 bg-white/50 px-5 py-2.5 text-sm font-medium text-slate-700 backdrop-blur-sm transition-colors hover:bg-white/80"
          >
            글 쓰기
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0) scale(1); }
          50% { transform: translateY(-15px) translateX(5px) scale(1.03); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(10px) translateX(-8px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateX(0) translateY(0); }
          33% { transform: translateX(8px) translateY(-5px); }
          66% { transform: translateX(-6px) translateY(3px); }
        }
        .animate-float { animation: float 7s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 12s ease-in-out infinite; }
      `}</style>
    </section>
  );
}
