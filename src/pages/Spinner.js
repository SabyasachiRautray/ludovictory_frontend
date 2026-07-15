import { useState, useRef, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/store/authSlice";
import {
  useSpinMutation,
  useGetSpinnerSegmentsQuery,
  useGetSpinnerHistoryQuery,
  useGetMeQuery,
  useGetAppConfigQuery,
} from "@/store/apiSlice";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Coins,
  RotateCw,
  History,
  ShoppingBag,
  Zap,
  Sparkles,
} from "lucide-react";

// ─── Vibrant wheel palette — each segment gets a unique color ─────────────────
const SEGMENT_PALETTE = [
  { bg: "#FF6B6B", glow: "#ff4444" }, // Coral red
  { bg: "#4ECDC4", glow: "#2eb5ac" }, // Teal
  { bg: "#FFD93D", glow: "#e6c200" }, // Golden yellow
  { bg: "#6C5CE7", glow: "#5a4bd1" }, // Purple
  { bg: "#A8E6CF", glow: "#7ed8b0" }, // Mint green
  { bg: "#FF8A5C", glow: "#e87040" }, // Orange
  { bg: "#81ECEC", glow: "#5ad4d4" }, // Cyan
  { bg: "#E056A0", glow: "#c93d86" }, // Pink
  { bg: "#00B894", glow: "#009e7e" }, // Emerald
  { bg: "#FDCB6E", glow: "#e5b44d" }, // Amber
  { bg: "#74B9FF", glow: "#4da3f0" }, // Sky blue
  { bg: "#FD79A8", glow: "#e8608c" }, // Rose
];

const getTextColor = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 160 ? "#ffffff" : "#1a1a2e";
};

// ─── Spinner page ─────────────────────────────────────────────────────────────
const Spinner = () => {
  const sessionUser = useSelector(selectCurrentUser);

  const { data: segmentsData } = useGetSpinnerSegmentsQuery({
    limit: 20,
    is_active: "true",
  });
  const { data: meData } = useGetMeQuery(undefined, { skip: !sessionUser });
  const { data: historyData } = useGetSpinnerHistoryQuery({
    page: 1,
    limit: 20,
  });
  const { data: configData } = useGetAppConfigQuery();

  const [spinMutation] = useSpinMutation();

  // ── State ──────────────────────────────────────────────────────────────────
  const rotationRef = useRef(0);
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState(null);

  const segments = segmentsData?.data || [];
  const history = historyData?.data || [];

  const wallet = meData?.data?.wallet || null;
  const referralBalance =
    wallet?.referral_token_balance ?? sessionUser?.referral_token_balance ?? 0;
  const shoppingBalance =
    wallet?.shopping_token_balance ?? sessionUser?.shopping_token_balance ?? 0;

  const spinCost = configData?.data?.spin_cost ?? 1;

  const segCount = segments.length;
  const segAngle = segCount > 0 ? 360 / segCount : 0;

  // ── Build LED bulb positions around the ring ───────────────────────────────
  const ledCount = 32;
  const ledBulbs = useMemo(() => {
    const viewCenter = 220;
    const ledRadius = 208; // perfectly centered in the dark ring
    return Array.from({ length: ledCount }, (_, i) => {
      const angle = (i / ledCount) * 360 - 90;
      const rad = angle * (Math.PI / 180);
      return {
        x: viewCenter + ledRadius * Math.cos(rad),
        y: viewCenter + ledRadius * Math.sin(rad),
        delay: i * 0.06,
      };
    });
  }, []);

  // ── Spin handler ──────────────────────────────────────────────────────────
  const handleSpin = useCallback(async () => {
    if (isSpinning || referralBalance < spinCost || segCount === 0) return;

    setIsSpinning(true);
    setResult(null);

    try {
      const res = await spinMutation().unwrap();
      const {
        result_label,
        tokens_won,
        tokens_spent,
        referral_token_balance,
        shopping_token_balance,
      } = res.data;

      const segIndex = segments.findIndex(
        (s) =>
          s.label.trim().toLowerCase() === result_label.trim().toLowerCase(),
      );
      const targetIndex = segIndex === -1 ? 0 : segIndex;

      const segCenter = targetIndex * segAngle + segAngle / 2;
      const finalAngle = (360 - (segCenter % 360) + 360) % 360;

      const currentOrientation = rotationRef.current % 360;
      const difference = (finalAngle - currentOrientation + 360) % 360;

      const fullRotations = 8 + Math.floor(Math.random() * 4);
      const totalRotation =
        rotationRef.current + fullRotations * 360 + difference;

      rotationRef.current = totalRotation;
      setRotation(totalRotation);

      setTimeout(() => {
        setResult({
          result_label,
          tokens_won,
          tokens_spent,
          referral_token_balance,
          shopping_token_balance,
        });
        setIsSpinning(false);

        if (tokens_won > 0) {
          toast.success(`🎉 You won ${tokens_won} shopping tokens!`);
        } else {
          toast("Better luck next time!", { icon: "🎰" });
        }
      }, 5000);
    } catch (err) {
      toast.error(err?.data?.message || "Spin failed");
      setIsSpinning(false);
    }
  }, [isSpinning, referralBalance, segCount, segments, segAngle, spinMutation]);

  // ── Loading state ─────────────────────────────────────────────────────────
  if (segCount === 0) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[hsl(var(--accent))] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground text-sm">Loading spinner...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-16 pb-20 md:pb-6 bg-[radial-gradient(ellipse_at_top,rgba(31,38,84,0.06),transparent_60%)]"
    >
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="text-center mb-6">
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="font-heading text-3xl sm:text-4xl font-bold mb-1"
          >
            <span className="inline-flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-[hsl(var(--accent))]" />
              Spin & Win
              <Sparkles className="w-6 h-6 text-[hsl(var(--accent))]" />
            </span>
          </motion.h1>
        </div>

        {/* ── Wallet strip ─────────────────────────────────────────────── */}
        <div className="flex gap-3 justify-center mb-8">
          <div className="flex items-center gap-2 bg-white/90 border border-border/80 rounded-full px-4 py-2 shadow-sm">
            <Coins className="w-4 h-4 text-[hsl(var(--primary))]" />
            <div>
              <p className="text-[10px] text-muted-foreground leading-none">
                Referral (to spend)
              </p>
              <p className="font-mono-num font-bold text-sm">
                {referralBalance.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/90 border border-border/80 rounded-full px-4 py-2 shadow-sm">
            <ShoppingBag className="w-4 h-4 text-[hsl(var(--accent))]" />
            <div>
              <p className="text-[10px] text-muted-foreground leading-none">
                Shopping (to earn)
              </p>
              <p className="font-mono-num font-bold text-sm">
                {shoppingBalance.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* ── Wheel column ────────────────────────────────────────────── */}
          <div className="lg:col-span-2">
            <div className="bg-white/90 rounded-3xl border border-border/80 shadow-[0_24px_60px_rgba(31,38,84,0.14)] p-6 sm:p-8">
              {/* Wheel wrapper */}
              <div
                className="relative mx-auto select-none"
                style={{ width: "min(100%, 420px)", aspectRatio: "1" }}
              >
                {/* Pulsing outer glow */}
                <motion.div
                  className="absolute inset-[-16px] rounded-full pointer-events-none"
                  animate={{
                    boxShadow: isSpinning
                      ? [
                          "0 0 40px 12px rgba(255,107,107,0.3), 0 0 80px 24px rgba(110,50,255,0.2)",
                          "0 0 60px 18px rgba(78,205,196,0.3), 0 0 100px 36px rgba(255,138,92,0.2)",
                          "0 0 40px 12px rgba(255,217,61,0.3), 0 0 80px 24px rgba(224,86,160,0.2)",
                        ]
                      : "0 0 30px 6px rgba(110,50,255,0.2), 0 0 60px 12px rgba(255,107,107,0.1)",
                  }}
                  transition={
                    isSpinning
                      ? {
                          duration: 1.2,
                          repeat: Infinity,
                          repeatType: "reverse",
                        }
                      : { duration: 2 }
                  }
                />

                {/* Dark ring behind LEDs + LED bulbs */}
                <div className="absolute inset-[-5%] z-10 pointer-events-none">
                  <svg viewBox="0 0 440 440" className="w-full h-full">
                    <circle
                      cx="220"
                      cy="220"
                      r="208"
                      fill="none"
                      stroke="#1a1a2e"
                      strokeWidth="22"
                      opacity="0.9"
                    />
                    <circle
                      cx="220"
                      cy="220"
                      r="219"
                      fill="none"
                      stroke="rgba(197,143,34,0.4)"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx="220"
                      cy="220"
                      r="197"
                      fill="none"
                      stroke="rgba(197,143,34,0.4)"
                      strokeWidth="1.5"
                    />
                    {ledBulbs.map((led, i) => (
                      <circle
                        key={i}
                        cx={led.x}
                        cy={led.y}
                        r="5"
                        fill={
                          isSpinning
                            ? i % 2 === 0
                              ? "#FFD93D"
                              : "#FF6B6B"
                            : i % 2 === 0
                              ? "rgba(255,217,61,0.6)"
                              : "rgba(255,107,107,0.4)"
                        }
                        style={{
                          filter: isSpinning
                            ? `drop-shadow(0 0 8px ${i % 2 === 0 ? "#FFD93D" : "#FF6B6B"})`
                            : `drop-shadow(0 0 3px ${i % 2 === 0 ? "rgba(255,217,61,0.5)" : "rgba(255,107,107,0.3)"})`,
                          animation: isSpinning
                            ? `pulse 0.8s ${led.delay}s infinite alternate`
                            : "none",
                        }}
                      />
                    ))}
                  </svg>
                </div>

                {/* Pointer — neon triangle pointing down */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center">
                  <div
                    className="w-6 h-6 rounded-full border-2 border-white z-20"
                    style={{
                      background: "linear-gradient(135deg, #FFD93D, #FF6B6B)",
                      boxShadow: "0 0 16px 4px rgba(255,217,61,0.6)",
                    }}
                  />
                  <div
                    className="w-0 h-0 -mt-0.5"
                    style={{
                      borderLeft: "12px solid transparent",
                      borderRight: "12px solid transparent",
                      borderTop: "22px solid #FFD93D",
                      filter: "drop-shadow(0 0 8px rgba(255,217,61,0.6))",
                    }}
                  />
                </div>

                {/* The spinning wheel */}
                <div
                  data-testid="spin-page-wheel"
                  className="w-full h-full rounded-full overflow-hidden"
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    transition: isSpinning
                      ? "transform 5s cubic-bezier(0.15, 0.85, 0.25, 1.0)"
                      : "none",
                    willChange: "transform",
                    boxShadow:
                      "inset 0 0 20px rgba(0,0,0,0.3), 0 0 40px rgba(0,0,0,0.2)",
                  }}
                >
                  <svg
                    viewBox="0 0 400 400"
                    className="w-full h-full"
                    style={{ display: "block" }}
                  >
                    <defs>
                      {segments.map((seg, i) => {
                        const palette =
                          SEGMENT_PALETTE[i % SEGMENT_PALETTE.length];
                        return (
                          <radialGradient
                            key={`grad-${i}`}
                            id={`segGrad-${i}`}
                            cx="50%"
                            cy="50%"
                            r="55%"
                          >
                            <stop
                              offset="0%"
                              stopColor={palette.bg}
                              stopOpacity="1"
                            />
                            <stop
                              offset="100%"
                              stopColor={palette.glow}
                              stopOpacity="1"
                            />
                          </radialGradient>
                        );
                      })}
                      <filter
                        id="innerShadow"
                        x="-20%"
                        y="-20%"
                        width="140%"
                        height="140%"
                      >
                        <feGaussianBlur
                          in="SourceAlpha"
                          stdDeviation="3"
                          result="blur"
                        />
                        <feOffset dx="0" dy="2" result="offset" />
                        <feComposite
                          in="SourceGraphic"
                          in2="offset"
                          operator="over"
                        />
                      </filter>
                    </defs>

                    <circle
                      cx="200"
                      cy="200"
                      r="199"
                      fill="none"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="2"
                    />
                    <circle
                      cx="200"
                      cy="200"
                      r="194"
                      fill="none"
                      stroke="rgba(255,255,255,0.06)"
                      strokeWidth="1"
                    />

                    {segments.map((seg, i) => {
                      const angle = 360 / segCount;
                      const startAngle = i * angle;
                      const endAngle = (i + 1) * angle;
                      const startRad = (startAngle - 90) * (Math.PI / 180);
                      const endRad = (endAngle - 90) * (Math.PI / 180);
                      const x1 = 200 + 192 * Math.cos(startRad);
                      const y1 = 200 + 192 * Math.sin(startRad);
                      const x2 = 200 + 192 * Math.cos(endRad);
                      const y2 = 200 + 192 * Math.sin(endRad);
                      const largeArc = angle > 180 ? 1 : 0;
                      const midAngle = startAngle + angle / 2;
                      const midRad = (midAngle - 90) * (Math.PI / 180);

                      // Text starts near the hub and runs OUTWARD toward the rim
                      const textStartR = 64;
                      const textX = 200 + textStartR * Math.cos(midRad);
                      const textY = 200 + textStartR * Math.sin(midRad);

                      const palette = SEGMENT_PALETTE[i % SEGMENT_PALETTE.length];
                      const textColor = getTextColor(palette.bg);

                      // Base font size per segment-count tier — scaled dynamically for long labels
                      let fontSize = segCount > 10 ? 17 : segCount > 6 ? 22 : 26;
                      if (seg.label.length > 12) {
                        fontSize = Math.round(fontSize * 0.72);
                      } else if (seg.label.length > 8) {
                        fontSize = Math.round(fontSize * 0.85);
                      }

                      return (
                        <g key={seg.id}>
                          <path
                            d={`M200,200 L${x1},${y1} A192,192 0 ${largeArc},1 ${x2},${y2} Z`}
                            fill={`url(#segGrad-${i})`}
                            stroke="rgba(255,255,255,0.25)"
                            strokeWidth="1.5"
                          />
                          <line
                            x1="200" y1="200" x2={x1} y2={y1}
                            stroke="rgba(255,255,255,0.35)"
                            strokeWidth="1.5"
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

                          {/* Tiny token icon near edge for reward segments */}
                          {seg.tokens_won > 0 &&
                            (() => {
                              const iconR = 192 * 0.88;
                              const iconX = 200 + iconR * Math.cos(midRad);
                              const iconY = 200 + iconR * Math.sin(midRad);
                              return (
                                <g
                                  transform={`rotate(${midAngle}, ${iconX}, ${iconY})`}
                                >
                                  <circle
                                    cx={iconX}
                                    cy={iconY}
                                    r="8"
                                    fill="rgba(255,255,255,0.25)"
                                  />
                                  <text
                                    x={iconX}
                                    y={iconY}
                                    fill={textColor}
                                    fontSize="7"
                                    fontWeight="900"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fontFamily="system-ui, sans-serif"
                                  >
                                    🪙
                                  </text>
                                </g>
                              );
                            })()}
                        </g>
                      );
                    })}

                    {/* Center hub — glowing gradient */}
                    <circle
                      cx="200"
                      cy="200"
                      r="34"
                      fill="url(#centerGradOuter)"
                      stroke="rgba(255,255,255,0.3)"
                      strokeWidth="2"
                    />
                    <defs>
                      <radialGradient id="centerGradOuter">
                        <stop offset="0%" stopColor="#2d2b6b" />
                        <stop offset="100%" stopColor="#1a1a3e" />
                      </radialGradient>
                      <radialGradient id="centerGradInner">
                        <stop offset="0%" stopColor="#FFD93D" />
                        <stop offset="100%" stopColor="#FF6B6B" />
                      </radialGradient>
                    </defs>
                    <circle
                      cx="200"
                      cy="200"
                      r="26"
                      fill="url(#centerGradInner)"
                    />
                    <text
                      x="200"
                      y="200"
                      fill="#1a1a2e"
                      fontSize="9"
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

                {/* Clickable SPIN center button — overlays the hub */}
                <button
                  onClick={handleSpin}
                  disabled={isSpinning || referralBalance < spinCost}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-[15%] h-[15%] rounded-full cursor-pointer disabled:cursor-not-allowed"
                  style={{ background: "transparent" }}
                  aria-label="Spin the wheel"
                />
              </div>

              {/* ── Spin button ────────────────────────────────────────── */}
              <div className="text-center mt-8">
                <motion.button
                  data-testid="spin-page-spin-button"
                  whileTap={{ scale: 0.96 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={handleSpin}
                  disabled={isSpinning || referralBalance < spinCost}
                  className="relative px-10 py-4 rounded-2xl font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden text-white"
                  style={{
                    background: isSpinning
                      ? "hsl(220 40% 30%)"
                      : "linear-gradient(135deg, hsl(220 60% 25%) 0%, hsl(220 60% 35%) 100%)",
                    boxShadow: isSpinning
                      ? "none"
                      : "0 8px 32px rgba(31,38,84,0.35), 0 0 0 1px rgba(197,143,34,0.3)",
                  }}
                >
                  {!isSpinning && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  )}
                  <span className="relative flex items-center gap-2 justify-center">
                    <RotateCw
                      className={`w-5 h-5 ${isSpinning ? "animate-spin" : ""}`}
                    />
                    {isSpinning ? (
                      "Spinning..."
                    ) : (
                      <span>
                        {isSpinning
                          ? "Spinning..."
                          : `Spin — ${spinCost} Referral Token${spinCost > 1 ? "s" : ""}`}
                      </span>
                    )}
                  </span>
                </motion.button>

                {referralBalance < 1 && (
                  <p className="text-xs text-red-400 mt-2">
                    You need at least {spinCost} referral token
                    {spinCost > 1 ? "s" : ""} to spin
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  Winnings go to your shopping token balance
                </p>
              </div>

              {/* ── Result banner ──────────────────────────────────────── */}
              <AnimatePresence>
                {result && (
                  <motion.div
                    data-testid="spin-result-dialog"
                    initial={{ opacity: 0, y: 16, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ type: "spring", damping: 20, stiffness: 300 }}
                    className="mt-6 rounded-2xl overflow-hidden"
                    style={{
                      background:
                        result.tokens_won > 0
                          ? "linear-gradient(135deg, rgba(197,143,34,0.12), rgba(197,143,34,0.04))"
                          : "hsl(var(--muted))",
                      border:
                        result.tokens_won > 0
                          ? "1px solid rgba(197,143,34,0.3)"
                          : "1px solid hsl(var(--border) / 0.5)",
                    }}
                  >
                    <div className="p-5 text-center">
                      {result.tokens_won > 0 ? (
                        <>
                          <p className="text-sm text-muted-foreground mb-2">
                            🎉 You landed on
                          </p>
                          <p className="font-heading font-bold text-lg mb-2">
                            {result.result_label}
                          </p>
                          <div className="flex items-center justify-center gap-2 mb-3">
                            <ShoppingBag className="w-6 h-6 text-[hsl(var(--accent))]" />
                            <span className="font-mono-num text-4xl font-bold text-[hsl(var(--accent))]">
                              +{result.tokens_won}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            shopping tokens earned
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-2xl mb-2">😅</p>
                          <p className="font-heading font-bold">
                            {result.result_label}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            No tokens this time — try again!
                          </p>
                        </>
                      )}

                      <div className="flex gap-3 justify-center mt-4">
                        <div className="bg-white/60 rounded-xl px-3 py-2 text-center">
                          <p className="text-[10px] text-muted-foreground">
                            Referral left
                          </p>
                          <p className="font-mono-num font-bold text-sm">
                            {result.referral_token_balance}
                          </p>
                        </div>
                        <div className="bg-white/60 rounded-xl px-3 py-2 text-center">
                          <p className="text-[10px] text-muted-foreground">
                            Shopping total
                          </p>
                          <p className="font-mono-num font-bold text-sm text-[hsl(var(--accent))]">
                            {result.shopping_token_balance}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ── History + Legend column ─────────────────────────────────── */}
          <div className="lg:col-span-1 space-y-4">
            {/* Recent spins */}
            <div className="bg-white/90 rounded-2xl border border-border/80 shadow-[0_18px_45px_rgba(31,38,84,0.10)] overflow-hidden">
              <div className="flex items-center gap-2 p-4 border-b border-border/40">
                <History className="w-4 h-4 text-[hsl(var(--primary))]" />
                <h3 className="font-heading font-bold text-sm">Recent Spins</h3>
                {history.length > 0 && (
                  <span className="ml-auto text-xs text-muted-foreground">
                    {history.length} spins
                  </span>
                )}
              </div>

              <div className="divide-y divide-border/30 max-h-[480px] overflow-y-auto">
                {history.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground text-sm">
                    <Zap className="w-8 h-8 mx-auto mb-2 opacity-20" />
                    <p>No spins yet</p>
                    <p className="text-xs mt-1">Hit spin to get started!</p>
                  </div>
                ) : (
                  history.map((h) => {
                    const isWin = h.tokens_won > 0;
                    return (
                      <div
                        key={h.id}
                        className="flex items-center justify-between px-4 py-3 hover:bg-black/5 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full shrink-0 ${isWin ? "bg-[hsl(var(--accent))]" : "bg-muted-foreground/30"}`}
                          />
                          <span className="text-sm truncate max-w-[120px]">
                            {h.result_label}
                          </span>
                        </div>
                        <div className="text-right shrink-0">
                          <span
                            className={`font-mono-num text-sm font-bold ${
                              isWin
                                ? "text-[hsl(var(--accent))]"
                                : "text-muted-foreground"
                            }`}
                          >
                            {isWin ? `+${h.tokens_won}` : "—"}
                          </span>
                          <p className="text-[10px] text-muted-foreground">
                            {h.created_at
                              ? new Date(h.created_at).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : ""}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Segment legend */}
            <div className="bg-white/90 rounded-2xl border border-border/80 shadow-[0_18px_45px_rgba(31,38,84,0.10)] p-4">
              <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                Wheel Segments
              </p>
              <div className="space-y-1.5">
                {segments.map((seg, i) => {
                  const palette = SEGMENT_PALETTE[i % SEGMENT_PALETTE.length];
                  return (
                    <div
                      key={seg.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-sm shrink-0"
                          style={{
                            background: palette.bg,
                            boxShadow: `0 0 6px ${palette.glow}40`,
                          }}
                        />
                        <span className="text-xs truncate">{seg.label}</span>
                      </div>
                      <span className="text-xs font-mono-num font-bold text-[hsl(var(--accent))]">
                        {seg.tokens_won > 0 ? `+${seg.tokens_won}` : "—"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inline keyframes for LED pulse animation */}
      <style>{`
        @keyframes pulse {
          0% { opacity: 0.3; r: 3; }
          100% { opacity: 1; r: 5; }
        }
      `}</style>
    </motion.div>
  );
};

export default Spinner;