"use client";

export default function WaterRipple() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-0 h-40 overflow-hidden">
      <svg
        className="absolute bottom-0 w-full"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        style={{ height: "100%" }}
      >
        <path
          className="animate-wave"
          d="M0,60 C240,100 480,20 720,60 C960,100 1200,20 1440,60 L1440,120 L0,120 Z"
          fill="rgba(147,197,253,0.15)"
        />
        <path
          className="animate-wave-slow"
          d="M0,70 C200,30 440,90 720,50 C1000,10 1240,80 1440,50 L1440,120 L0,120 Z"
          fill="rgba(147,197,253,0.1)"
        />
        <path
          className="animate-wave-slower"
          d="M0,80 C300,50 600,95 900,65 C1100,45 1300,85 1440,70 L1440,120 L0,120 Z"
          fill="rgba(191,219,254,0.12)"
        />
      </svg>
      <style>{`
        @keyframes wave {
          0% { transform: translateX(0); }
          50% { transform: translateX(-30px); }
          100% { transform: translateX(0); }
        }
        @keyframes wave-slow {
          0% { transform: translateX(0); }
          50% { transform: translateX(25px); }
          100% { transform: translateX(0); }
        }
        @keyframes wave-slower {
          0% { transform: translateX(0); }
          33% { transform: translateX(-15px); }
          66% { transform: translateX(15px); }
          100% { transform: translateX(0); }
        }
        .animate-wave { animation: wave 4s ease-in-out infinite; }
        .animate-wave-slow { animation: wave-slow 6s ease-in-out infinite; }
        .animate-wave-slower { animation: wave-slower 8s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
