import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Flame, Gift, Check, Sparkles,  ShoppingBag, } from "lucide-react";
import {
  useGetStreakStatusQuery,
  useClaimStreakMutation,
} from "@/store/apiSlice";

const StreakWidget = () => {
  const { data: streakData, isLoading } = useGetStreakStatusQuery();
  const [claimStreak, { isLoading: claiming }] = useClaimStreakMutation();
  const [justClaimed, setJustClaimed] = useState(null); // { tokens_won, current_streak }

  const streak = streakData?.data;
  const currentStreak = streak?.current_streak ?? 0;
  const claimedToday = streak?.claimed_today ?? false;
  const nextReward = streak?.next_reward ?? 0;
  const upcomingRewards = streak?.upcoming_rewards ?? [];

  const handleClaim = async () => {
    try {
      const res = await claimStreak().unwrap();
      setJustClaimed(res.data);
      toast.success(res.message || "Streak claimed!");
    } catch (err) {
      if (err?.status === 409) {
        toast.info("You've already claimed today — come back tomorrow!");
      } else {
        toast.error(err?.data?.message || "Couldn't claim streak");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white/90 rounded-2xl border border-border/80 shadow-[0_18px_45px_rgba(31,38,84,0.10)] p-4 sm:p-6 animate-pulse">
        <div className="h-5 bg-[hsl(var(--muted))] rounded w-1/3 mb-4" />
        <div className="h-16 bg-[hsl(var(--muted))] rounded-xl" />
      </div>
    );
  }

  return (
    <div className="bg-white/90 rounded-2xl border border-border/80 shadow-[0_18px_45px_rgba(31,38,84,0.10)] p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shrink-0">
            <Flame className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <h3 className="font-heading font-bold leading-none">Login Streak</h3>
            <p className="text-[11px] text-muted-foreground mt-1">
              Claim daily to keep it alive
            </p>
          </div>
        </div>
        {streak?.longest_streak > 0 && (
          <span className="text-[10px] px-2 py-1 rounded-full bg-[hsl(var(--muted))] text-muted-foreground font-medium whitespace-nowrap">
            Best: {streak.longest_streak}d
          </span>
        )}
      </div>

      {/* Current streak display */}
      <div className="bg-[hsl(var(--secondary))] rounded-xl p-4 mb-4 flex items-center justify-between">
        <div>
          <p className="text-[10px] text-muted-foreground mb-1">
            Current streak
          </p>
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono-num text-3xl font-bold leading-none">
              {currentStreak}
            </span>
            <span className="text-sm text-muted-foreground">
              day{currentStreak === 1 ? "" : "s"}
            </span>
          </div>
        </div>
        <AnimatePresence mode="wait">
          {claimedToday ? (
            <motion.div
              key="claimed"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center gap-1"
            >
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-[10px] text-green-600 font-medium">
                Done today
              </span>
            </motion.div>
          ) : (
            <motion.div
              key="pending"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-right"
            >
              <p className="text-[10px] text-muted-foreground mb-0.5">
                Today's reward
              </p>
              <div className="flex items-center justify-end gap-1.5">
  <ShoppingBag className="w-4 h-4 text-[hsl(var(--accent))]" />
  <p className="font-mono-num font-bold text-[hsl(var(--accent))]">
    +{nextReward}
  </p>
</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 7-day preview strip */}
      {upcomingRewards.length > 0 && (
        <div className="flex items-center gap-1.5 mb-4 overflow-x-auto pb-1">
          {upcomingRewards.map((reward, i) => {
            const dayNum = i + 1;
            const isPast = claimedToday
              ? dayNum <= currentStreak
              : dayNum < currentStreak + 1;
            const isCurrent = claimedToday
              ? dayNum === currentStreak
              : dayNum === currentStreak + 1;

            return (
              <div
                key={dayNum}
                className={`shrink-0 w-12 rounded-lg py-2 flex flex-col items-center gap-0.5 border transition-colors ${
                  isCurrent
                    ? "bg-[hsl(var(--primary))]/10 border-[hsl(var(--primary))]"
                    : isPast
                    ? "bg-[hsl(var(--muted))] border-transparent opacity-60"
                    : "bg-white border-border/60"
                }`}
              >
                <span className="text-[9px] text-muted-foreground font-medium">
                  Day {dayNum}
                </span>
                <div className="flex items-center gap-1">
  <ShoppingBag className="w-3 h-3 text-[hsl(var(--accent))]" />
  <span className="font-mono-num text-xs font-bold">
    {reward}
  </span>
</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Claim button */}
      <motion.button
        whileTap={{ scale: claimedToday ? 1 : 0.97 }}
        onClick={handleClaim}
        disabled={claimedToday || claiming}
        data-testid="claim-streak-button"
        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-colors ${
          claimedToday
            ? "bg-[hsl(var(--muted))] text-muted-foreground cursor-not-allowed"
            : "bg-[hsl(var(--primary))] text-white hover:opacity-90"
        }`}
      >
        {claiming ? (
          <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
        ) : claimedToday ? (
          <>
            <Check className="w-4 h-4" />
            Claimed for today
          </>
        ) : (
          <>
            <Gift className="w-4 h-4" />
            Claim Your Daily Reward
          </>
        )}
      </motion.button>

      {/* Claim success flash */}
      <AnimatePresence>
        {justClaimed && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            onAnimationComplete={() => {
              setTimeout(() => setJustClaimed(null), 2200);
            }}
            className="mt-3 flex items-center justify-center gap-1.5 text-xs font-medium text-[hsl(var(--accent))]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            +{justClaimed.tokens_won} shopping tokens added!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StreakWidget;