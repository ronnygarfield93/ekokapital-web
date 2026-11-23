export function GovernanceTraderBg() {
  // Subtle institutional order-book horizontal depth bars (right & left edges)
  const bidBars = [
    { y: 120, w: 120 },
    { y: 152, w: 185 },
    { y: 184, w: 150 },
    { y: 216, w: 230 },
    { y: 248, w: 195 },
    { y: 280, w: 270 },
    { y: 312, w: 310 },
    { y: 344, w: 245 },
  ];

  const askBars = [
    { y: 110, w: 290 },
    { y: 142, w: 235 },
    { y: 174, w: 320 },
    { y: 206, w: 195 },
    { y: 238, w: 260 },
    { y: 270, w: 175 },
    { y: 302, w: 210 },
    { y: 334, w: 140 },
  ];

  const nodes = [
    { cx: 440, cy: 322, delay: "0.3s" },
    { cx: 745, cy: 268, delay: "1.6s" },
    { cx: 1120, cy: 178, delay: "2.7s" },
  ];

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden select-none"
    >
      <svg
        viewBox="0 0 1440 580"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
      >
        <defs>
          {/* Bid Depth (Emerald) Area */}
          <linearGradient id="ekoBidDepth" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.24" />
            <stop offset="65%" stopColor="#10b981" stopOpacity="0.07" />
            <stop offset="100%" stopColor="#071226" stopOpacity="0" />
          </linearGradient>

          {/* Ask Depth (Gold) Area */}
          <linearGradient id="ekoAskDepth" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e5be62" stopOpacity="0.26" />
            <stop offset="65%" stopColor="#cfa03b" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#071226" stopOpacity="0" />
          </linearGradient>

          {/* Institutional Signal Line */}
          <linearGradient id="ekoTraderSignal" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.18" />
            <stop offset="45%" stopColor="#60a5fa" stopOpacity="0.65" />
            <stop offset="80%" stopColor="#f4df9b" stopOpacity="0.88" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.7" />
          </linearGradient>

          {/* Mid-Price Vertical Glow */}
          <linearGradient id="ekoMidSpread" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f4df9b" stopOpacity="0" />
            <stop offset="50%" stopColor="#f4df9b" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#f4df9b" stopOpacity="0.1" />
          </linearGradient>

          {/* Soft Glow */}
          <filter id="ekoTraderGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Left Copy Contrast Mask */}
          <linearGradient id="ekoGcgFade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#071226" stopOpacity="0.72" />
            <stop offset="38%" stopColor="#071226" stopOpacity="0.38" />
            <stop offset="100%" stopColor="#071226" stopOpacity="0.12" />
          </linearGradient>
        </defs>

        {/* Subtle Terminal Coordinate Lines */}
        <g stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="3 9">
          <line x1="0" y1="95" x2="1440" y2="95" />
          <line x1="0" y1="195" x2="1440" y2="195" />
          <line x1="0" y1="295" x2="1440" y2="295" />
          <line x1="0" y1="395" x2="1440" y2="395" />
          <line x1="0" y1="495" x2="1440" y2="495" />
        </g>

        <g stroke="rgba(255,255,255,0.03)" strokeWidth="1">
          <line x1="240" y1="0" x2="240" y2="580" />
          <line x1="480" y1="0" x2="480" y2="580" />
          <line x1="960" y1="0" x2="960" y2="580" />
          <line x1="1200" y1="0" x2="1200" y2="580" />
        </g>

        {/* Faint Order-Book Horizontal Depth Bars (Left Bid / Right Ask) */}
        <g opacity="0.18">
          {bidBars.map((b, i) => (
            <rect
              key={`bid-${i}`}
              x="0"
              y={b.y}
              width={b.w}
              height="16"
              rx="3"
              fill="#34d399"
            />
          ))}
          {askBars.map((a, i) => (
            <rect
              key={`ask-${i}`}
              x={1440 - a.w}
              y={a.y}
              width={a.w}
              height="16"
              rx="3"
              fill="#e5be62"
            />
          ))}
        </g>

        {/* Market Depth Chart — Bid Side (Stepped Emerald) */}
        <path
          d="M 0 270 L 95 270 L 95 308 L 195 308 L 195 344 L 305 344 L 305 385 L 420 385 L 420 426 L 535 426 L 535 466 L 645 466 L 645 505 L 720 505 L 720 580 L 0 580 Z"
          fill="url(#ekoBidDepth)"
        />
        <path
          d="M 0 270 L 95 270 L 95 308 L 195 308 L 195 344 L 305 344 L 305 385 L 420 385 L 420 426 L 535 426 L 535 466 L 645 466 L 645 505 L 720 505"
          fill="none"
          stroke="#34d399"
          strokeWidth="2"
          strokeOpacity="0.62"
        />

        {/* Market Depth Chart — Ask Side (Stepped Gold) */}
        <path
          d="M 745 505 L 820 505 L 820 462 L 930 462 L 930 418 L 1045 418 L 1045 366 L 1165 366 L 1165 316 L 1285 316 L 1285 262 L 1440 262 L 1440 580 L 745 580 Z"
          fill="url(#ekoAskDepth)"
        />
        <path
          d="M 745 505 L 820 505 L 820 462 L 930 462 L 930 418 L 1045 418 L 1045 366 L 1165 366 L 1165 316 L 1285 316 L 1285 262 L 1440 262"
          fill="none"
          stroke="#ebd082"
          strokeWidth="2"
          strokeOpacity="0.68"
        />

        {/* Mid-Price Spread Vertical Line */}
        <line
          x1="732"
          y1="40"
          x2="732"
          y2="540"
          stroke="url(#ekoMidSpread)"
          strokeWidth="1.5"
          strokeDasharray="5 7"
        />

        {/* Smooth Institutional Index Wave Across Terminal */}
        <path
          d="M 0 435 C 140 418, 250 375, 440 322 C 575 284, 645 305, 745 268 C 890 214, 985 232, 1120 178 C 1245 128, 1345 108, 1440 76"
          fill="none"
          stroke="url(#ekoTraderSignal)"
          strokeWidth="2.4"
          strokeLinecap="round"
          filter="url(#ekoTraderGlow)"
        />

        {/* Secondary Animated Flowing Signal Line */}
        <path
          d="M 0 470 C 180 445, 320 398, 520 356 C 720 314, 880 285, 1080 236 C 1240 198, 1340 168, 1440 132"
          fill="none"
          stroke="rgba(125,211,252,0.4)"
          strokeWidth="1.5"
          strokeDasharray="6 7"
          className="eko-chart-flow"
        />

        {/* Live Trader Pulse Nodes */}
        {nodes.map((n) => (
          <g key={`tn-${n.cx}`}>
            <circle
              cx={n.cx}
              cy={n.cy}
              r="10"
              fill="none"
              stroke="#f4df9b"
              strokeWidth="1.4"
              style={{ animationDelay: n.delay }}
              className="eko-chart-pulse"
            />
            <circle
              cx={n.cx}
              cy={n.cy}
              r="3.8"
              fill="#f8e8b0"
              stroke="#071226"
              strokeWidth="1.4"
            />
          </g>
        ))}

        {/* Readability Vignette Over Left Copy */}
        <rect x="0" y="0" width="1440" height="580" fill="url(#ekoGcgFade)" />
      </svg>
    </div>
  );
}
