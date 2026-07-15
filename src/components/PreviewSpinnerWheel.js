import { useMemo } from "react";
import { useGetSpinnerSegmentsQuery } from "@/store/apiSlice";

// ─── Vibrant wheel palette — each segment gets a unique color ─────────────────
const SEGMENT_PALETTE = [
  { bg: "#FF6B6B", glow: "#ff4444" },
  { bg: "#4ECDC4", glow: "#2eb5ac" },
  { bg: "#FFD93D", glow: "#e6c200" },
  { bg: "#6C5CE7", glow: "#5a4bd1" },
  { bg: "#A8E6CF", glow: "#7ed8b0" },
  { bg: "#FF8A5C", glow: "#e87040" },
  { bg: "#81ECEC", glow: "#5ad4d4" },
  { bg: "#E056A0", glow: "#c93d86" },
  { bg: "#00B894", glow: "#009e7e" },
  { bg: "#FDCB6E", glow: "#e5b44d" },
  { bg: "#74B9FF", glow: "#4da3f0" },
  { bg: "#FD79A8", glow: "#e8608c" },
];

const getTextColor = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 160 ? "#ffffff" : "#1a1a2e";
};

/**
 * PreviewSpinnerWheel — A read-only, non-interactive replica of the full
 * Spinner page wheel. Fetches real segments from the API and renders
 * them exactly the same way the Spinner page does, with vertical text,
 * LED ring, pointer, dark band, and center hub.
 *
 * Props:
 *   size  — CSS width string, e.g. "220px" or "min(100%, 300px)"
 *   hover — if true, will rotate 30deg on parent :hover (group-hover)
 */
const PreviewSpinnerWheel = ({ size = "220px", hover = true }) => {
  const { data: segmentsData } = useGetSpinnerSegmentsQuery({
    limit: 20,
    is_active: "true",
  });

  const segments = segmentsData?.data || [];
  const segCount = segments.length;
  const segAngle = segCount > 0 ? 360 / segCount : 0;

  // LED bulbs positions
  const ledCount = 24;
  const ledBulbs = useMemo(() => {
    const vc = 220, lr = 208;
    return Array.from({ length: ledCount }, (_, i) => {
      const angle = (i / ledCount) * 360 - 90;
      const rad = angle * (Math.PI / 180);
      return { x: vc + lr * Math.cos(rad), y: vc + lr * Math.sin(rad) };
    });
  }, []);

  // Fallback while loading
  if (segCount === 0) {
    return (
      <div
        className="rounded-full bg-gradient-to-br from-[hsl(var(--primary))]/20 to-[hsl(var(--accent))]/20 flex items-center justify-center"
        style={{ width: size, aspectRatio: "1" }}
      >
        <div className="w-6 h-6 border-2 border-[hsl(var(--accent))] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div
      className="relative mx-auto select-none"
      style={{ width: size, aspectRatio: "1" }}
    >
      {/* Outer glow */}
      <div
        className="absolute inset-[-8px] rounded-full opacity-50 pointer-events-none"
        style={{
          background:
            "conic-gradient(#FF6B6B,#FFD93D,#4ECDC4,#6C5CE7,#FF8A5C,#E056A0,#74B9FF,#FF6B6B)",
          filter: "blur(12px)",
        }}
      />

      {/* Dark ring + LED bulbs */}
      <div className="absolute inset-[-5%] z-10 pointer-events-none">
        <svg viewBox="0 0 440 440" className="w-full h-full">
          <circle cx="220" cy="220" r="208" fill="none" stroke="#1a1a2e" strokeWidth="18" opacity="0.9" />
          <circle cx="220" cy="220" r="217" fill="none" stroke="rgba(197,143,34,0.4)" strokeWidth="1" />
          <circle cx="220" cy="220" r="199" fill="none" stroke="rgba(197,143,34,0.4)" strokeWidth="1" />
          {ledBulbs.map((led, i) => (
            <circle
              key={i}
              cx={led.x}
              cy={led.y}
              r="4"
              fill={i % 2 === 0 ? "rgba(255,217,61,0.65)" : "rgba(255,107,107,0.5)"}
              style={{
                filter: `drop-shadow(0 0 3px ${i % 2 === 0 ? "rgba(255,217,61,0.5)" : "rgba(255,107,107,0.3)"})`,
              }}
            />
          ))}
        </svg>
      </div>

      {/* Pointer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center">
        <div
          className="w-5 h-5 rounded-full border-2 border-white z-20"
          style={{
            background: "linear-gradient(135deg, #FFD93D, #FF6B6B)",
            boxShadow: "0 0 12px 3px rgba(255,217,61,0.5)",
          }}
        />
        <div
          className="w-0 h-0 -mt-0.5"
          style={{
            borderLeft: "9px solid transparent",
            borderRight: "9px solid transparent",
            borderTop: "16px solid #FFD93D",
            filter: "drop-shadow(0 0 6px rgba(255,217,61,0.5))",
          }}
        />
      </div>

      {/* Spinning wheel face */}
      <div
        className={`w-full h-full rounded-full overflow-hidden z-10 relative ${
          hover
            ? "transition-transform duration-700 group-hover:rotate-[30deg]"
            : ""
        }`}
        style={{
          boxShadow: "inset 0 0 16px rgba(0,0,0,0.25), 0 0 30px rgba(0,0,0,0.15)",
        }}
      >
        <svg viewBox="0 0 400 400" className="w-full h-full" style={{ display: "block" }}>
          <defs>
            {segments.map((_, i) => {
              const palette = SEGMENT_PALETTE[i % SEGMENT_PALETTE.length];
              return (
                <radialGradient key={`pg-${i}`} id={`previewGrad-${i}`} cx="50%" cy="50%" r="55%">
                  <stop offset="0%" stopColor={palette.bg} stopOpacity="1" />
                  <stop offset="100%" stopColor={palette.glow} stopOpacity="1" />
                </radialGradient>
              );
            })}
          </defs>

          {/* Segments */}
          {segments.map((seg, i) => {
            const angle = segAngle;
            const startAngle = i * angle;
            const endAngle = (i + 1) * angle;
            const startRad = (startAngle - 90) * (Math.PI / 180);
            const endRad = (endAngle - 90) * (Math.PI / 180);
            const R = 192;
            const x1 = 200 + R * Math.cos(startRad);
            const y1 = 200 + R * Math.sin(startRad);
            const x2 = 200 + R * Math.cos(endRad);
            const y2 = 200 + R * Math.sin(endRad);
            const largeArc = angle > 180 ? 1 : 0;
            const midAngle = startAngle + angle / 2;
            const midRad = (midAngle - 90) * (Math.PI / 180);
            const palette = SEGMENT_PALETTE[i % SEGMENT_PALETTE.length];
            const textColor = getTextColor(palette.bg);

            // Text starts near the hub and runs OUTWARD toward the rim
            const textStartR = 64;
            const textX = 200 + textStartR * Math.cos(midRad);
            const textY = 200 + textStartR * Math.sin(midRad);

            // Base font size per segment-count tier — scaled dynamically for long labels
            let fontSize = segCount > 10 ? 17 : segCount > 6 ? 22 : 26;
            if (seg.label.length > 12) {
              fontSize = Math.round(fontSize * 0.72);
            } else if (seg.label.length > 8) {
              fontSize = Math.round(fontSize * 0.85);
            }

            return (
              <g key={seg.id || i}>
                <path
                  d={`M200,200 L${x1},${y1} A${R},${R} 0 ${largeArc},1 ${x2},${y2} Z`}
                  fill={`url(#previewGrad-${i})`}
                  stroke="rgba(255,255,255,0.25)"
                  strokeWidth="1.5"
                />
                <line
                  x1="200" y1="200" x2={x1} y2={y1}
                  stroke="rgba(255,255,255,0.35)" strokeWidth="1.5"
                />
                {/* Radial label — reads outward from hub to rim */}
                <text
                  x={textX}
                  y={textY}
                  fill="#ffffff"
                  stroke="#ffffff"
                  strokeWidth="0.4"
                  fontSize={fontSize}
                  fontWeight="900"
                  textAnchor="start"
                  dominantBaseline="middle"
                  fontFamily="'Space Grotesk', system-ui, -apple-system, sans-serif"
                  transform={`rotate(${midAngle - 90}, ${textX}, ${textY})`}
                  style={{
                    textShadow: "0 2px 6px rgba(0,0,0,0.6), 0 0 3px rgba(0,0,0,0.95)",
                    letterSpacing: "0.01em",
                  }}
                >
                  {seg.label}
                </text>
              </g>
            );
          })}

          {/* Center hub */}
          <circle cx="200" cy="200" r="30" fill="#2d2b6b" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
          <circle cx="200" cy="200" r="22" fill="url(#previewCenterGrad)" />
          <defs>
            <radialGradient id="previewCenterGrad">
              <stop offset="0%" stopColor="#FFD93D" />
              <stop offset="100%" stopColor="#FF6B6B" />
            </radialGradient>
          </defs>
          <text
            x="200" y="200"
            fill="#1a1a2e"
            fontSize="8"
            fontWeight="900"
            textAnchor="middle"
            dominantBaseline="middle"
            fontFamily="system-ui, sans-serif"
            letterSpacing="1"
          >
            SPIN
          </text>
        </svg>
      </div>
    </div>
  );
};

export { SEGMENT_PALETTE, getTextColor };
export default PreviewSpinnerWheel;
