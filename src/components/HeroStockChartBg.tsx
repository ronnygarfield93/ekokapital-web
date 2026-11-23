export function HeroStockChartBg() {
  // Subtle institutional candlestick series across 1440x680 canvas
  const candles = [
    { x: 90, high: 470, low: 548, open: 530, close: 492, bull: true },
    { x: 145, high: 458, low: 536, open: 494, close: 514, bull: false },
    { x: 200, high: 440, low: 518, open: 506, close: 462, bull: true },
    { x: 255, high: 416, low: 492, open: 465, close: 432, bull: true },
    { x: 310, high: 424, low: 486, open: 438, close: 466, bull: false },
    { x: 365, high: 392, low: 474, open: 460, close: 410, bull: true },
    { x: 420, high: 364, low: 438, open: 412, close: 382, bull: true },
    { x: 475, high: 372, low: 434, open: 388, close: 412, bull: false },
    { x: 530, high: 342, low: 420, open: 408, close: 358, bull: true },
    { x: 585, high: 318, low: 392, open: 360, close: 332, bull: true },
    { x: 640, high: 325, low: 386, open: 336, close: 364, bull: false },
    { x: 695, high: 294, low: 372, open: 358, close: 310, bull: true },
    { x: 750, high: 262, low: 336, open: 312, close: 278, bull: true },
    { x: 805, high: 270, low: 330, open: 282, close: 306, bull: false },
    { x: 860, high: 238, low: 318, open: 302, close: 254, bull: true },
    { x: 915, high: 208, low: 286, open: 258, close: 224, bull: true },
    { x: 970, high: 214, low: 278, open: 228, close: 252, bull: false },
    { x: 1025, high: 184, low: 264, open: 248, close: 198, bull: true },
    { x: 1080, high: 158, low: 230, open: 202, close: 174, bull: true },
    { x: 1135, high: 164, low: 222, open: 178, close: 198, bull: false },
    { x: 1190, high: 132, low: 206, open: 194, close: 146, bull: true },
    { x: 1245, high: 108, low: 178, open: 148, close: 120, bull: true },
    { x: 1300, high: 114, low: 170, open: 124, close: 142, bull: false },
    { x: 1355, high: 84, low: 152, open: 138, close: 96, bull: true },
  ];

  const volumes = [
    26, 38, 32, 48, 28, 56, 44, 34, 62, 50, 36, 68, 54, 40, 74, 60, 42, 82, 66,
    46, 78, 88, 52, 92,
  ];

  const pulsePoints = [
    { cx: 585, cy: 332, delay: "0s" },
    { cx: 915, cy: 224, delay: "1.4s" },
    { cx: 1245, cy: 120, delay: "2.8s" },
  ];

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden select-none"
    >
      <svg
        viewBox="0 0 1440 680"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
      >
        <defs>
          {/* Primary Gold Area Gradient */}
          <linearGradient id="ekoGoldArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e5be62" stopOpacity="0.30" />
            <stop offset="55%" stopColor="#cfa03b" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#071226" stopOpacity="0" />
          </linearGradient>

          {/* Secondary Sky-Blue Index Area Gradient */}
          <linearGradient id="ekoBlueArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.22" />
            <stop offset="70%" stopColor="#1d4ed8" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#071226" stopOpacity="0" />
          </linearGradient>

          {/* Primary Gold Stroke Gradient */}
          <linearGradient id="ekoGoldLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#cfa03b" stopOpacity="0.25" />
            <stop offset="35%" stopColor="#ebd082" stopOpacity="0.72" />
            <stop offset="75%" stopColor="#f5dfa0" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.85" />
          </linearGradient>

          {/* Secondary Sky-Blue Stroke Gradient */}
          <linearGradient id="ekoBlueLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.15" />
            <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.7" />
          </linearGradient>

          {/* Soft Glow Filter for Trend Line */}
          <filter id="ekoChartGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Subtle Left Readability Fade */}
          <linearGradient id="ekoLeftFade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#071226" stopOpacity="0.72" />
            <stop offset="42%" stopColor="#071226" stopOpacity="0.34" />
            <stop offset="100%" stopColor="#071226" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Faint Price-Level Horizontal Axis Lines */}
        <g stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="4 8">
          <line x1="0" y1="115" x2="1440" y2="115" />
          <line x1="0" y1="225" x2="1440" y2="225" />
          <line x1="0" y1="335" x2="1440" y2="335" />
          <line x1="0" y1="445" x2="1440" y2="445" />
          <line x1="0" y1="555" x2="1440" y2="555" />
        </g>

        {/* Faint Vertical Time-Interval Guides */}
        <g stroke="rgba(255,255,255,0.035)" strokeWidth="1">
          <line x1="200" y1="0" x2="200" y2="680" />
          <line x1="420" y1="0" x2="420" y2="680" />
          <line x1="640" y1="0" x2="640" y2="680" />
          <line x1="860" y1="0" x2="860" y2="680" />
          <line x1="1080" y1="0" x2="1080" y2="680" />
          <line x1="1300" y1="0" x2="1300" y2="680" />
        </g>

        {/* Subtle Volume Histogram Bars Along Bottom */}
        <g opacity="0.22">
          {candles.map((c, idx) => {
            const h = volumes[idx] ?? 32;
            return (
              <rect
                key={`vol-${c.x}`}
                x={c.x - 9}
                y={680 - h}
                width="18"
                height={h}
                rx="3"
                fill={c.bull ? "#34d399" : "#cfa03b"}
                fillOpacity={c.bull ? "0.45" : "0.32"}
              />
            );
          })}
        </g>

        {/* Secondary Moving Average Area + Curve (Sky Blue) */}
        <path
          d="M 0 585 C 120 565, 220 520, 340 492 C 460 462, 560 432, 680 398 C 800 364, 920 318, 1060 278 C 1200 238, 1320 202, 1440 165 L 1440 680 L 0 680 Z"
          fill="url(#ekoBlueArea)"
        />
        <path
          d="M 0 585 C 120 565, 220 520, 340 492 C 460 462, 560 432, 680 398 C 800 364, 920 318, 1060 278 C 1200 238, 1320 202, 1440 165"
          fill="none"
          stroke="url(#ekoBlueLine)"
          strokeWidth="2"
          strokeDasharray="6 6"
          className="eko-chart-flow"
        />

        {/* Candlestick Series */}
        <g opacity="0.42">
          {candles.map((c) => {
            const top = Math.min(c.open, c.close);
            const bodyHeight = Math.max(8, Math.abs(c.close - c.open));
            const color = c.bull ? "#34d399" : "#e5be62";
            return (
              <g key={`candle-${c.x}`}>
                <line
                  x1={c.x}
                  y1={c.high}
                  x2={c.x}
                  y2={c.low}
                  stroke={color}
                  strokeWidth="1.6"
                  strokeOpacity="0.7"
                />
                <rect
                  x={c.x - 6}
                  y={top}
                  width="12"
                  height={bodyHeight}
                  rx="2.5"
                  fill={c.bull ? color : "rgba(229,190,98,0.28)"}
                  stroke={color}
                  strokeWidth="1.2"
                />
              </g>
            );
          })}
        </g>

        {/* Primary Gold Market Growth Area + Glowing Trend Line */}
        <path
          d="M 0 560 L 90 508 L 145 514 L 200 468 L 255 436 L 310 460 L 365 412 L 420 384 L 475 406 L 530 360 L 585 332 L 640 356 L 695 312 L 750 280 L 805 300 L 860 256 L 915 224 L 970 246 L 1025 200 L 1080 174 L 1135 192 L 1190 148 L 1245 120 L 1300 138 L 1355 96 L 1440 72 L 1440 680 L 0 680 Z"
          fill="url(#ekoGoldArea)"
        />
        <path
          d="M 0 560 L 90 508 L 145 514 L 200 468 L 255 436 L 310 460 L 365 412 L 420 384 L 475 406 L 530 360 L 585 332 L 640 356 L 695 312 L 750 280 L 805 300 L 860 256 L 915 224 L 970 246 L 1025 200 L 1080 174 L 1135 192 L 1190 148 L 1245 120 L 1300 138 L 1355 96 L 1440 72"
          fill="none"
          stroke="url(#ekoGoldLine)"
          strokeWidth="2.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#ekoChartGlow)"
          className="eko-chart-draw"
        />

        {/* Animated Live Data Beacons Along Primary Curve */}
        {pulsePoints.map((pt) => (
          <g key={`pt-${pt.cx}`}>
            <circle
              cx={pt.cx}
              cy={pt.cy}
              r="11"
              fill="none"
              stroke="#f4df9b"
              strokeWidth="1.5"
              style={{ animationDelay: pt.delay }}
              className="eko-chart-pulse"
            />
            <circle
              cx={pt.cx}
              cy={pt.cy}
              r="4.2"
              fill="#f8e8b0"
              stroke="#071226"
              strokeWidth="1.5"
            />
          </g>
        ))}

        {/* Soft Left-Side Vignette So Hero Copy Stays Crisp & High-Contrast */}
        <rect x="0" y="0" width="1440" height="680" fill="url(#ekoLeftFade)" />
      </svg>
    </div>
  );
}
