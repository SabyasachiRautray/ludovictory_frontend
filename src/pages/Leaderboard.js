import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/store/authSlice';
import { useGetLeaderboardQuery, useGetMyRankQuery } from '@/store/apiSlice';
import { motion } from 'framer-motion';
import {
  Trophy, Medal, Crown, Coins, Users, Zap,
  Flame, TrendingUp, Star, Award, Sparkles,
} from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

const Leaderboard = () => {
  const sessionUser = useSelector(selectCurrentUser);

  const { data, isLoading } = useGetLeaderboardQuery();

  const { data: myRankData } = useGetMyRankQuery(undefined, {
    skip: !sessionUser,
  });

  const leaders = data?.data || [];
  const myRank = myRankData?.data || null;

  const podium = leaders.slice(0, 3);
  const rest = leaders.slice(3);

  const podiumConfig = [
    {
      icon: Crown,
      gradient: 'from-[#FFD700] via-[#FFC107] to-[#FF8F00]',
      ring: 'ring-[#FFD700]/40',
      shadow: 'shadow-[0_0_30px_rgba(255,215,0,0.25)]',
      bg: 'bg-gradient-to-br from-[#FFFDE7] to-[#FFF8E1]',
      badge: '🥇',
      label: '1st Place',
    },
    {
      icon: Medal,
      gradient: 'from-[#B0BEC5] via-[#90A4AE] to-[#78909C]',
      ring: 'ring-[#90A4AE]/30',
      shadow: 'shadow-[0_0_24px_rgba(144,164,174,0.2)]',
      bg: 'bg-gradient-to-br from-[#ECEFF1] to-[#CFD8DC]',
      badge: '🥈',
      label: '2nd Place',
    },
    {
      icon: Trophy,
      gradient: 'from-[#CD7F32] via-[#B8860B] to-[#A0522D]',
      ring: 'ring-[#CD7F32]/30',
      shadow: 'shadow-[0_0_24px_rgba(205,127,50,0.2)]',
      bg: 'bg-gradient-to-br from-[#FFF3E0] to-[#FFE0B2]',
      badge: '🥉',
      label: '3rd Place',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-16 pb-20 md:pb-6"
    >
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* ── Gorgeous Header ──────────────────────────────────────────── */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="text-center mb-10"
        >
          <motion.div variants={fadeUp} className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-[hsl(var(--accent))]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[hsl(var(--accent))]">
              Hall of Champions
            </span>
            <Sparkles className="w-5 h-5 text-[hsl(var(--accent))]" />
          </motion.div>
          <motion.h1
            variants={fadeUp}
            className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold"
          >
            Leader
            <span className="bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] bg-clip-text text-transparent">
              board
            </span>
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-3 text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
            Top earners by shopping tokens. Spin more, earn more, rise to the top!
          </motion.p>
        </motion.div>

        {/* ── My Rank Banner ───────────────────────────────────────────── */}
        {myRank?.rank && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative mb-8 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(31,38,84,0.12)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--primary))]/8 via-[hsl(var(--accent))]/6 to-[hsl(var(--primary))]/8" />
            <div className="relative flex items-center justify-between px-5 sm:px-8 py-5 border border-[hsl(var(--primary))]/15 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent))] flex items-center justify-center shadow-lg">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Your Position</p>
                  <p className="font-heading font-bold text-xl sm:text-2xl">
                    Rank <span className="text-[hsl(var(--accent))]">#{myRank.rank}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-5 sm:gap-8">
                <div className="text-center">
                  <div className="flex items-center gap-1.5 justify-center">
                    <Coins className="w-4 h-4 text-[hsl(var(--accent))]" />
                    <span className="font-mono-num text-lg sm:text-xl font-bold text-[hsl(var(--accent))]">
                      {myRank.total_shopping_tokens_earned?.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">Tokens Earned</p>
                </div>
                <div className="text-center hidden sm:block">
                  <div className="flex items-center gap-1.5 justify-center">
                    <Zap className="w-4 h-4 text-[hsl(var(--primary))]" />
                    <span className="font-mono-num text-lg font-bold">{myRank.total_spins}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Spins</p>
                </div>
                <div className="text-center hidden sm:block">
                  <div className="flex items-center gap-1.5 justify-center">
                    <Users className="w-4 h-4 text-[hsl(var(--primary))]" />
                    <span className="font-mono-num text-lg font-bold">{myRank.total_referrals}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Referrals</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Not yet ranked nudge ──────────────────────────────────────── */}
        {!myRank?.rank && sessionUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mb-8 py-4 px-6 rounded-2xl border border-dashed border-[hsl(var(--accent))]/30 bg-[hsl(var(--accent))]/5"
          >
            <Flame className="w-5 h-5 text-[hsl(var(--accent))] mx-auto mb-1" />
            <p className="text-sm text-muted-foreground">
              🎯 You're not ranked yet — <span className="font-semibold text-foreground">spin the wheel</span> to earn shopping tokens and appear here
            </p>
          </motion.div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-3 border-[hsl(var(--accent))] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : leaders.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Trophy className="w-16 h-16 mx-auto mb-4 opacity-15" />
            <p className="font-heading font-bold text-lg">No data yet</p>
            <p className="text-sm mt-2">Spin the wheel to appear on the leaderboard!</p>
          </div>
        ) : (
          <>
            {/* ── Podium — 3 gorgeous cards ──────────────────────────────── */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              data-testid="leaderboard-podium"
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-10"
            >
              {podium.map((entry, i) => {
                const config = podiumConfig[i];
                const Icon = config.icon;
                const isMe = entry.user?.id === sessionUser?.id;
                return (
                  <motion.div
                    key={entry.user?.id}
                    variants={fadeUp}
                    className={`relative rounded-2xl border p-5 sm:p-6 text-center overflow-hidden ${config.bg} ${config.shadow} ${
                      isMe
                        ? `border-[hsl(var(--accent))]/50 ring-2 ${config.ring}`
                        : 'border-white/60'
                    }`}
                  >
                    {/* Decorative shimmer */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/40 to-transparent rounded-bl-full pointer-events-none" />

                    {/* Badge */}
                    <div className="text-3xl mb-2">{config.badge}</div>

                    {/* Icon circle */}
                    <div className={`w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center bg-gradient-to-br ${config.gradient} shadow-lg`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>

                    <p className="font-heading font-bold text-base sm:text-lg truncate">
                      {entry.user?.username || '—'}
                      {isMe && (
                        <span className="ml-1.5 text-xs text-[hsl(var(--accent))] font-semibold">(you)</span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {entry.user?.full_name}
                    </p>

                    {/* Token count — big and bold */}
                    <div className="flex items-center justify-center gap-1.5 mt-4">
                      <Coins className="w-5 h-5 text-[hsl(var(--accent))]" />
                      <span className="font-mono-num font-bold text-xl sm:text-2xl text-[hsl(var(--accent))]">
                        {entry.total_shopping_tokens_earned?.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">Shopping Tokens Earned</p>

                    {/* Stats row */}
                    <div className="flex items-center justify-center gap-4 mt-3 pt-3 border-t border-black/5">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Zap className="w-3 h-3 text-[hsl(var(--primary))]" />{entry.total_spins} spins
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Users className="w-3 h-3 text-[hsl(var(--primary))]" />{entry.total_referrals} refs
                      </span>
                    </div>

                    <p className="text-xs font-medium text-muted-foreground mt-2">{config.label}</p>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* ── Auto-Scrolling List (rank 4–50) ────────────────────────── */}
            {rest.length > 0 && (
              <div
                data-testid="leaderboard-list"
                className="bg-white rounded-2xl border border-border/50 shadow-[0_16px_48px_rgba(31,38,84,0.08)] overflow-hidden flex flex-col h-[580px]"
              >
                {/* Decorative header bar — static at top */}
                <div className="relative z-20 flex items-center gap-2 px-5 py-4 border-b border-border/30 bg-gradient-to-r from-[hsl(var(--primary))]/5 via-[hsl(var(--accent))]/3 to-white shrink-0">
                  <TrendingUp className="w-5 h-5 text-[hsl(var(--primary))]" />
                  <span className="font-heading font-extrabold text-base text-foreground">Rising Stars</span>
                  <span className="text-xs font-semibold text-muted-foreground ml-auto">Rank #{rest[0]?.rank} – #{rest[rest.length - 1]?.rank}</span>
                </div>

                {/* Scroll container — animation is confined here */}
                <div className="relative flex-1 overflow-hidden bg-gray-50/30">
                  {/* Fade masks */}
                  <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none" />
                  <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />

                  <div className="animate-leaderboard px-4 py-4">
                    {[...rest, ...rest].map((entry, idx) => {
                      const isMe = entry.user?.id === sessionUser?.id;
                      const rankNum = entry.rank;
                      
                      // Soft light-themed color schemes for each card
                      const cardThemes = [
                        { bg: 'bg-rose-50/40 hover:bg-rose-50/70', text: 'text-rose-600', border: 'border-rose-100/70', badge: 'bg-rose-100/50 text-rose-700' },
                        { bg: 'bg-sky-50/40 hover:bg-sky-50/70', text: 'text-sky-600', border: 'border-sky-100/70', badge: 'bg-sky-100/50 text-sky-700' },
                        { bg: 'bg-emerald-50/40 hover:bg-emerald-50/70', text: 'text-emerald-600', border: 'border-emerald-100/70', badge: 'bg-emerald-100/50 text-emerald-700' },
                        { bg: 'bg-violet-50/40 hover:bg-violet-50/70', text: 'text-violet-600', border: 'border-violet-100/70', badge: 'bg-violet-100/50 text-violet-700' },
                        { bg: 'bg-amber-50/40 hover:bg-amber-50/70', text: 'text-amber-600', border: 'border-amber-100/70', badge: 'bg-amber-100/50 text-amber-700' },
                        { bg: 'bg-teal-50/40 hover:bg-teal-50/70', text: 'text-teal-600', border: 'border-teal-100/70', badge: 'bg-teal-100/50 text-teal-700' },
                      ];
                      const themeIdx = (rankNum - 4) % cardThemes.length;
                      const theme = cardThemes[themeIdx >= 0 ? themeIdx : 0];

                      return (
                        <div
                          key={`rank-${entry.user?.id}-${idx}`}
                          className={`flex items-center justify-between p-4 sm:p-5 rounded-2xl border transition-all duration-300 shrink-0 ${
                            isMe
                              ? 'bg-gradient-to-r from-[hsl(var(--accent))]/15 to-white border-[hsl(var(--accent))]/40 shadow-[0_8px_24px_rgba(197,143,34,0.16)] ring-1 ring-[hsl(var(--accent))]/25'
                              : `${theme.bg} ${theme.border} shadow-[0_4px_16px_rgba(31,38,84,0.04)] hover:shadow-[0_8px_24px_rgba(31,38,84,0.08)] hover:border-slate-300/80`
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            {/* Multicolor rank badge */}
                            <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl border flex items-center justify-center font-mono-num font-black text-base sm:text-lg transition-transform duration-300 hover:scale-105 ${
                              isMe
                                ? 'bg-gradient-to-br from-[hsl(var(--accent))] to-[hsl(var(--accent))]/80 text-white border-transparent shadow-md'
                                : `${theme.badge} border-black/5`
                            }`}>
                              #{rankNum}
                            </div>
                            <div>
                              <p className="font-heading font-extrabold text-base sm:text-lg text-slate-800">
                                {entry.user?.username || '—'}
                                {isMe && <span className="ml-2 text-xs text-[hsl(var(--accent))] font-bold">(you)</span>}
                              </p>
                              <div className="flex items-center gap-4 mt-1 text-xs font-semibold text-muted-foreground">
                                <span className="flex items-center gap-1.5 hover:text-slate-700">
                                  <Zap className="w-3.5 h-3.5 text-[hsl(var(--primary))]" /> {entry.total_spins} spins
                                </span>
                                <span className="flex items-center gap-1.5 hover:text-slate-700">
                                  <Users className="w-3.5 h-3.5 text-[hsl(var(--primary))]" /> {entry.total_referrals} refs
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Coins className="w-5 h-5 text-[hsl(var(--accent))]" />
                              <span className="font-mono-num font-black text-lg sm:text-xl text-slate-800">
                                {entry.total_shopping_tokens_earned?.toLocaleString()}
                              </span>
                            </div>
                            <p className="text-[10px] sm:text-xs font-bold text-muted-foreground mt-0.5">Shopping Tokens</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

export default Leaderboard;