import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/store/authSlice';
import { useGetMeQuery, useGetMyRankQuery } from '@/store/apiSlice';
import { WinnersTicker, UsersTicker } from '@/components/Tickers';
import PreviewSpinnerWheel from '@/components/PreviewSpinnerWheel';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Coins, Trophy, ShoppingBag,
  Users, Zap, Wallet, Sparkles, ArrowRight
} from 'lucide-react';

const DashboardSpinner = () => (
  <Link
    to="/spinner"
    className="group block h-full bg-white/90 rounded-2xl border border-border/80 p-6 shadow-[0_18px_45px_rgba(31,38,84,0.10)] hover:border-[rgba(197,143,34,0.46)] hover:shadow-[0_0_0_1px_rgba(197,143,34,0.24),0_24px_54px_rgba(31,38,84,0.15)] transition-all overflow-hidden"
  >
    <div className="flex flex-col items-center justify-between h-full gap-6">
      {/* Header Text */}
      <div className="text-center">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] text-xs font-bold mb-3">
          <Sparkles className="w-3.5 h-3.5" /> Try Your Luck
        </span>
        <h3 className="font-heading text-2xl font-bold">Spin the Wheel</h3>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
          Use referral tokens to spin and win shopping tokens instantly!
        </p>
      </div>

      {/* Real Spinner Wheel */}
      <div className="my-4">
        <PreviewSpinnerWheel size="min(100%, 220px)" hover={true} />
      </div>

      {/* CTA Bottom */}
      <span className="inline-flex items-center gap-2 text-sm font-bold text-[hsl(var(--accent))]">
        Spin Now <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </span>
    </div>
  </Link>
);

const Dashboard = () => {
  const sessionUser = useSelector(selectCurrentUser);

  // Fresh wallet balances — poll every 30s
  const { data: meData } = useGetMeQuery(undefined, {
    skip: !sessionUser,
    pollingInterval: 30000,
  });

  // User's personal leaderboard rank + stats
  const { data: rankData } = useGetMyRankQuery(undefined, {
    skip: !sessionUser,
  });

  // Prefer live API data, fall back to sessionStorage user
  const user = meData?.data || sessionUser;
  const wallet = meData?.data?.wallet || null;

  const referralBalance = wallet?.referral_token_balance ?? user?.referral_token_balance ?? 0;
  const shoppingBalance = wallet?.shopping_token_balance ?? user?.shopping_token_balance ?? 0;
  const myRank = rankData?.data || null;

  const wallets = [
    {
      label: 'Referral Tokens',
      value: referralBalance,
      icon: Coins,
      accent: 'text-[hsl(var(--accent))]',
      glow: 'neon-glow-cyan',
      note: 'Earned from invites • used to spin',
      testId: 'dashboard-wallet-balance',
    },
    {
      label: 'Shopping Tokens',
      value: shoppingBalance,
      icon: ShoppingBag,
      accent: 'text-[hsl(var(--primary))]',
      glow: 'neon-glow-amber',
      note: 'Earned from spins • used in bazaar',
      testId: 'dashboard-shopping-wallet-balance',
    },
  ];

  const stats = [
    {
      icon: Trophy,
      iconColor: 'text-[hsl(var(--accent))]',
      value: myRank?.rank ? `#${myRank.rank}` : '—',
      label: 'Your Rank',
    },
    {
      icon: Zap,
      iconColor: 'text-[hsl(var(--accent))]',
      value: myRank?.total_spins ?? 0,
      label: 'Spins Done',
    },
    {
      icon: Users,
      iconColor: 'text-[hsl(var(--primary))]',
      value: myRank?.total_referrals ?? 0,
      label: 'Referrals',
    },
    {
      icon: Wallet,
      iconColor: 'text-[hsl(var(--accent))]',
      value: myRank?.total_shopping_tokens_earned?.toLocaleString() ?? 0,
      label: 'Tokens Earned',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-16 pb-20 md:pb-6"
    >
      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* ── Hero Wallet ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 rounded-2xl border border-border/80 shadow-[0_18px_45px_rgba(31,38,84,0.10)] p-6 mb-8 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(650px_circle_at_50%_0%,rgba(197,143,34,0.16),transparent_62%),radial-gradient(480px_circle_at_95%_20%,rgba(31,38,84,0.09),transparent_56%)]" />

          <div className="relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-muted-foreground text-sm">Welcome back,</p>
                <h1 className="font-heading text-2xl sm:text-3xl font-bold mt-1">
                  {user?.full_name || 'Player'}
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5">
                  @{user?.username}
                </p>
              </div>

              {/* Two wallet cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full sm:w-auto">
                {wallets.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      data-testid={item.testId}
                      className={`flex items-center gap-3 bg-[hsl(var(--secondary))] rounded-2xl px-4 py-3 min-w-0 ${item.glow}`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-white/70 flex items-center justify-center shrink-0">
                        <Icon className={`w-6 h-6 ${item.accent}`} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground truncate">{item.label}</p>
                        <p className="font-mono-num text-2xl sm:text-3xl font-bold neon-text-cyan">
                          {item.value.toLocaleString()}
                        </p>
                        <p className="text-[10px] text-muted-foreground truncate">{item.note}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Stats Row ─────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
              {stats.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="bg-[hsl(var(--muted))] rounded-xl p-3 text-center">
                    <Icon className={`w-5 h-5 mx-auto mb-1 ${s.iconColor}`} />
                    <p className="font-mono-num text-lg font-bold">{s.value}</p>
                    <p className="text-[10px] text-muted-foreground">{s.label}</p>
                  </div>
                );
              })}
            </div>

            {/* Nudge unranked users toward the spinner */}
            {!myRank?.rank && (
              <p className="text-xs text-center text-muted-foreground mt-3">
                🎯 Spin the wheel to appear on the leaderboard
              </p>
            )}
          </div>
        </motion.div>

        {/* ── 3-Column Layout: Leaderboard | Spinner | New Players ───── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          
          {/* Top Earners */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/90 rounded-2xl border border-border/80 p-6 shadow-[0_18px_45px_rgba(31,38,84,0.10)] flex flex-col"
          >
            <div className="flex flex-col items-center justify-center text-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[hsl(var(--accent))]/20 to-transparent flex items-center justify-center mb-3">
                <Trophy className="w-6 h-6 text-[hsl(var(--accent))]" />
              </div>
              <h3 className="font-heading text-xl sm:text-2xl font-bold">Top Earners</h3>
              <p className="text-xs text-muted-foreground mt-1">Highest shopping token balances</p>
            </div>
            <div className="flex-1 overflow-hidden">
              <WinnersTicker />
            </div>
          </motion.div>

          {/* Spinner component in the middle */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative z-10 flex flex-col h-full"
          >
            <DashboardSpinner />
          </motion.div>

          {/* New Players */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/90 rounded-2xl border border-border/80 p-6 shadow-[0_18px_45px_rgba(31,38,84,0.10)] flex flex-col"
          >
            <div className="flex flex-col items-center justify-center text-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[hsl(var(--primary))]/20 to-transparent flex items-center justify-center mb-3">
                <Users className="w-6 h-6 text-[hsl(var(--primary))]" />
              </div>
              <h3 className="font-heading text-xl sm:text-2xl font-bold">New Players</h3>
              <p className="text-xs text-muted-foreground mt-1">Recently joined the community</p>
            </div>
            <div className="flex-1 overflow-hidden">
              <UsersTicker />
            </div>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;