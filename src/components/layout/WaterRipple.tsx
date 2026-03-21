"use client";

export default function WaterRipple() {
  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      {/* 바다 위 햇살 반사 - 우하단 영역 */}
      <div className="absolute bottom-[8%] right-[10%] h-32 w-48 animate-shimmer rounded-full bg-white/20 blur-2xl" />
      <div className="absolute bottom-[12%] right-[15%] h-20 w-64 animate-shimmer-slow rounded-full bg-white/15 blur-3xl" />
      <div className="absolute bottom-[5%] right-[8%] h-16 w-40 animate-shimmer-fast rounded-full bg-white/25 blur-xl" />

      {/* 작은 반짝임들 */}
      <div className="absolute bottom-[10%] right-[13%] h-3 w-3 animate-sparkle rounded-full bg-white/60 blur-sm" />
      <div className="absolute bottom-[15%] right-[18%] h-2 w-2 animate-sparkle-delayed rounded-full bg-white/50 blur-sm" />
      <div className="absolute bottom-[6%] right-[11%] h-2 w-2 animate-sparkle-slow rounded-full bg-white/55 blur-sm" />
      <div className="absolute bottom-[13%] right-[20%] h-2.5 w-2.5 animate-sparkle rounded-full bg-white/45 blur-sm" />
      <div className="absolute bottom-[4%] right-[16%] h-2 w-2 animate-sparkle-delayed rounded-full bg-white/50 blur-sm" />

      <style>{`
        @keyframes shimmer {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        @keyframes shimmer-slow {
          0%, 100% { opacity: 0.4; transform: scale(1) translateX(0); }
          50% { opacity: 0.8; transform: scale(1.05) translateX(10px); }
        }
        @keyframes shimmer-fast {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          30% { opacity: 0.9; transform: scale(1.15); }
          70% { opacity: 0.6; transform: scale(0.95); }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1.5); }
        }
        @keyframes sparkle-delayed {
          0%, 30% { opacity: 0; transform: scale(0.5); }
          60% { opacity: 1; transform: scale(1.5); }
          100% { opacity: 0; transform: scale(0.5); }
        }
        @keyframes sparkle-slow {
          0%, 20% { opacity: 0; }
          40% { opacity: 1; transform: scale(1.8); }
          60% { opacity: 0.3; }
          80% { opacity: 0.8; transform: scale(1); }
          100% { opacity: 0; }
        }
        .animate-shimmer { animation: shimmer 5s ease-in-out infinite; }
        .animate-shimmer-slow { animation: shimmer-slow 7s ease-in-out infinite; }
        .animate-shimmer-fast { animation: shimmer-fast 3s ease-in-out infinite; }
        .animate-sparkle { animation: sparkle 2s ease-in-out infinite; }
        .animate-sparkle-delayed { animation: sparkle-delayed 2.5s ease-in-out infinite; }
        .animate-sparkle-slow { animation: sparkle-slow 3.5s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
