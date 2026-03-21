"use client";

export default function WaterRipple() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-0 h-48 overflow-hidden">
      {/* Deep ocean base */}
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-blue-400/40 to-transparent" />

      <svg
        className="absolute bottom-0 w-[200%]"
        viewBox="0 0 2880 200"
        preserveAspectRatio="none"
        style={{ height: "100%" }}
      >
        {/* Wave 1 - 가장 뒤, 크고 느린 파도 */}
        <path
          className="animate-wave-1"
          d="M0,120 C180,80 360,140 540,100 C720,60 900,130 1080,100 C1260,70 1440,120 1620,90 C1800,60 1980,130 2160,100 C2340,70 2520,120 2700,90 C2790,75 2880,110 2880,110 L2880,200 L0,200 Z"
          fill="rgba(96,165,250,0.25)"
        />

        {/* Wave 2 - 중간, 선명한 물결 */}
        <path
          className="animate-wave-2"
          d="M0,140 C120,110 240,155 420,130 C600,105 720,150 900,125 C1080,100 1260,145 1440,125 C1620,105 1800,148 1980,128 C2160,108 2340,145 2520,130 C2700,115 2880,140 2880,140 L2880,200 L0,200 Z"
          fill="rgba(59,130,246,0.2)"
        />

        {/* Wave 3 - 앞쪽, 빠르고 작은 잔물결 */}
        <path
          className="animate-wave-3"
          d="M0,155 C90,145 180,165 360,150 C540,135 720,160 900,148 C1080,136 1260,158 1440,148 C1620,138 1800,160 1980,150 C2160,140 2340,158 2520,148 C2700,138 2880,155 2880,155 L2880,200 L0,200 Z"
          fill="rgba(96,165,250,0.18)"
        />

        {/* Wave 4 - 가장 앞, 거품 느낌 */}
        <path
          className="animate-wave-4"
          d="M0,168 C60,162 180,175 360,165 C540,155 660,172 900,163 C1140,154 1260,170 1440,162 C1620,154 1800,170 1980,163 C2160,156 2340,168 2520,162 C2700,156 2880,166 2880,166 L2880,200 L0,200 Z"
          fill="rgba(147,197,253,0.3)"
        />

        {/* 파도 꼭대기 하이라이트 */}
        <path
          className="animate-wave-3"
          d="M0,156 C90,150 180,160 360,152 C540,144 720,158 900,150 C1080,142 1260,156 1440,150 C1620,144 1800,158 1980,152 C2160,146 2340,156 2520,150 C2700,144 2880,154 2880,154 L2880,158 L0,158 Z"
          fill="rgba(255,255,255,0.15)"
        />
      </svg>

      <style>{`
        @keyframes wave1 {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes wave2 {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        @keyframes wave3 {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes wave4 {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-wave-1 { animation: wave1 12s linear infinite; }
        .animate-wave-2 { animation: wave2 10s linear infinite; }
        .animate-wave-3 { animation: wave3 7s linear infinite; }
        .animate-wave-4 { animation: wave4 9s linear infinite; }
      `}</style>
    </div>
  );
}
