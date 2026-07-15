import { Link, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "@/store/authSlice";
import { useGetLeaderboardQuery, useGetProductsQuery } from "@/store/apiSlice";
import { UsersTicker } from "@/components/Tickers";
import PreviewSpinnerWheel from "@/components/PreviewSpinnerWheel";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Coins,
  RotateCw,
  Trophy,
  ShoppingBag,
  Gamepad2,
  Gift,
  ArrowRight,
  Sparkles,
  Shield,
  Users,
  Zap,
  Crown,
  Medal,
  UserPlus,
  Calendar,
  Target,
  Eye,
  Rocket,
  Star,
  Clock,
  Smartphone,
} from "lucide-react";
import { useRef } from "react";

const HERO_IMG =
  "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&q=80";

const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.12 } } };
const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};

const features = [
  {
    icon: RotateCw,
    title: "Spin & Win",
    desc: "Spin the wheel daily to earn tokens. Every spin is a chance to win big!",
    color: "primary",
  },
  {
    icon: Trophy,
    title: "Prize House",
    desc: "Use tokens to enter prize draws with massive reward multipliers.",
    color: "accent",
  },
  {
    icon: ShoppingBag,
    title: "Shopping Bazaar",
    desc: "Redeem tokens for real products — gadgets, gift cards & more.",
    color: "primary",
  },
  {
    icon: Gamepad2,
    title: "PvP Game Zone",
    desc: "Challenge players in Dice Tic Tac Toe. Winner takes the pot!",
    color: "accent",
  },
  {
    icon: Gift,
    title: "Referral Rewards",
    desc: "Invite friends and earn 200 tokens per referral. They get 100 too!",
    color: "primary",
  },
  {
    icon: Zap,
    title: "Instant Rewards",
    desc: "Tokens credited instantly. No waiting, no hassle, just play.",
    color: "accent",
  },
];

const stats = [
  { label: "Active Players", value: "10K+", icon: Users },
  { label: "Tokens Distributed", value: "5M+", icon: Coins },
  { label: "Games Played", value: "50K+", icon: Gamepad2 },
  { label: "Prizes Won", value: "2K+", icon: Trophy },
];



const rankIcons = [Crown, Medal, Trophy];

// ─── Upcoming Events Data ────────────────────────────────────────────────────
const upcomingEvents = [
  {
    id: 1,
    title: "Mega Spin Fiesta",
    date: "Aug 15, 2026",
    desc: "Triple token rewards on every spin! Spin your way to the top of the leaderboard.",
    gradient: "from-[#e74c3c] to-[#c0392b]",
    icon: RotateCw,
  },
  {
    id: 2,
    title: "PvP Championship",
    date: "Aug 22, 2026",
    desc: "Compete in the ultimate Dice Tic Tac Toe tournament. Grand prize: 50,000 tokens!",
    gradient: "from-[#3498db] to-[#2980b9]",
    icon: Gamepad2,
  },
  {
    id: 3,
    title: "Referral Rush Week",
    date: "Sep 1-7, 2026",
    desc: "Earn 5x referral bonuses. Invite friends and stack up massive token rewards.",
    gradient: "from-[#2ecc71] to-[#27ae60]",
    icon: Gift,
  },
  {
    id: 4,
    title: "Flash Prize Drop",
    date: "Sep 10, 2026",
    desc: "Exclusive limited-time prizes unlocked for 24 hours only. Don't miss out!",
    gradient: "from-[#f39c12] to-[#e67e22]",
    icon: Star,
  },
  {
    id: 5,
    title: "Weekend Warriors",
    date: "Every Weekend",
    desc: "Double tokens on all weekend spins. Play more, earn more every Saturday & Sunday.",
    gradient: "from-[#9b59b6] to-[#8e44ad]",
    icon: Zap,
  },
  {
    id: 6,
    title: "New Year Bonanza",
    date: "Jan 1, 2027",
    desc: "Kick off the year with 10x multipliers and exclusive New Year prize drops.",
    gradient: "from-[#e91e63] to-[#c2185b]",
    icon: Sparkles,
  },
];

// ─── Upcoming Events Carousel ────────────────────────────────────────────────
const UpcomingEventsCarousel = () => (
  <section className="relative z-10 py-14 sm:py-20 overflow-hidden">
    <div className="max-w-6xl mx-auto px-4 mb-10">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={stagger}
        className="text-center"
      >
        <motion.div variants={fadeUp} className="flex items-center justify-center gap-2 mb-3">
          <Calendar className="w-5 h-5 text-[hsl(var(--accent))]" />
          <span className="text-xs font-bold uppercase tracking-widest text-[hsl(var(--accent))]">
            What's Coming
          </span>
        </motion.div>
        <motion.h2 variants={fadeUp} className="font-heading text-3xl sm:text-4xl font-bold">
          Upcoming{" "}
          <span className="bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] bg-clip-text text-transparent">
            Events
          </span>
        </motion.h2>
        <motion.p variants={fadeUp} className="mt-3 text-muted-foreground max-w-xl mx-auto">
          Mark your calendar — exciting events, bonus rewards, and limited-time drops are on the way.
        </motion.p>
      </motion.div>
    </div>

    {/* Auto-scrolling marquee */}
    <div className="relative">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-r from-[hsl(var(--background))] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-l from-[hsl(var(--background))] to-transparent z-10 pointer-events-none" />

      <div className="animate-marquee">
        {[...upcomingEvents, ...upcomingEvents].map((event, i) => {
          const Icon = event.icon;
          return (
            <div
              key={`event-${event.id}-${i}`}
              className="flex-shrink-0 w-[300px] sm:w-[340px] rounded-2xl border border-white/60 bg-white/90 shadow-[0_18px_45px_rgba(31,38,84,0.10)] overflow-hidden hover:shadow-[0_24px_54px_rgba(31,38,84,0.16)] transition-shadow cursor-default"
            >
              {/* Gradient header */}
              <div className={`bg-gradient-to-r ${event.gradient} p-4 flex items-center gap-3`}>
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-heading font-bold text-white text-sm truncate">
                    {event.title}
                  </h4>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3 text-white/70" />
                    <span className="text-[11px] text-white/80 font-medium">{event.date}</span>
                  </div>
                </div>
              </div>
              {/* Body */}
              <div className="p-4">
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {event.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

// ─── Landing Spinner ─────────────────────────────────────────────────────────
const LandingSpinner = () => (
  <Link
    to="/register"
    data-testid="landing-spinner-cta"
    className="group block h-full bg-white/90 rounded-2xl border border-border/80 p-4 sm:p-5 shadow-[0_18px_45px_rgba(31,38,84,0.10)] hover:border-[rgba(197,143,34,0.46)] hover:shadow-[0_0_0_1px_rgba(197,143,34,0.24),0_24px_54px_rgba(31,38,84,0.15)] transition-all overflow-hidden"
  >
    <div className="flex flex-col items-center justify-between h-full gap-5">
      {/* Real Spinner Wheel */}
      <div className="shrink-0">
        <PreviewSpinnerWheel size="min(100%, 240px)" hover={true} />
      </div>

      {/* Text content */}
      <div className="text-center flex-1 flex flex-col justify-between">
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" /> Try Your Luck
          </span>
          <h3 className="font-heading text-2xl font-bold mt-4">Spin the Wheel</h3>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            Tap the wheel to create your account and start earning referral tokens
            from your first spin.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 mt-5 text-sm font-bold text-[hsl(var(--accent))] self-center">
          Register to Spin{" "}
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </div>
  </Link>
);

// ─── Landing Leaderboard ─────────────────────────────────────────────────────
const LandingLeaderboard = () => {
  const { data, isLoading } = useGetLeaderboardQuery({ limit: 10 });
  const leaders = data?.data || [];

  return (
    <div className="h-full flex flex-col bg-white/90 rounded-2xl border border-border/80 p-4 sm:p-5 shadow-[0_18px_45px_rgba(31,38,84,0.10)]">
      <div className="flex items-center justify-center gap-3 mb-6">
        <Trophy className="w-7 h-7 text-[hsl(var(--accent))]" />
        <h3 className="font-heading text-3xl font-black bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] bg-clip-text text-transparent">
          Leaderboard
        </h3>
      </div>
      {isLoading ? (
        <div className="text-sm text-muted-foreground py-10 text-center">
          Loading leaders...
        </div>
      ) : leaders.length === 0 ? (
        <div className="text-sm text-muted-foreground py-10 text-center">
          No leaders yet. Take the first spot!
        </div>
      ) : (
        <div className="relative h-[340px] overflow-hidden">
          <div className="animate-leaderboard space-y-2">
            {[...leaders, ...leaders].map((leader, index) => {
              const actualIndex = index % leaders.length;
              const Icon = rankIcons[actualIndex] || Trophy;

              return (
                <div
                  key={`${leader.user_id}-${index}`}
                  className="flex items-center gap-3 rounded-xl bg-[hsl(var(--muted))] px-3 py-2.5"
                >
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0">
                    <Icon
                      className={`w-4 h-4 ${actualIndex === 0
                        ? "text-[hsl(var(--accent))]"
                        : "text-[hsl(var(--primary))]"
                        }`}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">
                      {leader.username}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Rank #{leader.rank || actualIndex + 1}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 text-[hsl(var(--accent))]">
                    <Coins className="w-3.5 h-3.5" />
                    <span className="font-bold">
                      {leader.total_shopping_tokens_earned?.toLocaleString() || 0}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Products Carousel ───────────────────────────────────────────────────────
const fallbackProducts = [
  { id: "f1", name: "Wireless Earbuds", description: "Premium sound quality with active noise cancellation", token_cost: 5000, image_url: "https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400&q=80" },
  { id: "f2", name: "Smart Watch", description: "Track your fitness goals and stay connected", token_cost: 8000, image_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80" },
  { id: "f3", name: "Gift Card ₹500", description: "Redeemable across major online stores", token_cost: 3000, image_url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80" },
  { id: "f4", name: "Bluetooth Speaker", description: "Portable speaker with deep bass and 12h battery", token_cost: 4500, image_url: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80" },
  { id: "f5", name: "Power Bank 20000mAh", description: "Fast charging power bank for all devices", token_cost: 3500, image_url: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&q=80" },
  { id: "f6", name: "Gaming Mouse", description: "RGB gaming mouse with programmable buttons", token_cost: 2500, image_url: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&q=80" },
];

const ProductsCarousel = () => {
  const { data, isLoading } = useGetProductsQuery({ page: 1, limit: 20 });
  const apiProducts = data?.data || [];
  const products = apiProducts.length > 0 ? apiProducts : fallbackProducts;

  if (isLoading) {
    return (
      <section className="relative z-10 py-16 overflow-hidden">
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-2 border-[hsl(var(--accent))] border-t-transparent rounded-full animate-spin" />
        </div>
      </section>
    );
  }

  return (
    <section className="relative z-10 py-14 sm:py-20 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 mb-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={stagger}
          className="text-center"
        >
          <motion.div variants={fadeUp} className="flex items-center justify-center gap-2 mb-3">
            <ShoppingBag className="w-5 h-5 text-[hsl(var(--accent))]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[hsl(var(--accent))]">
              Redeem Tokens
            </span>
          </motion.div>
          <motion.h2 variants={fadeUp} className="font-heading text-3xl sm:text-4xl font-bold">
            Our{" "}
            <span className="bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] bg-clip-text text-transparent">
              Products
            </span>
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Explore amazing products you can redeem with your earned tokens. From gadgets to gift cards — we've got it all.
          </motion.p>
        </motion.div>
      </div>

      {/* Auto-scrolling products — same style as Upcoming Events */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-r from-[hsl(var(--background))] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-l from-[hsl(var(--background))] to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee">
          {(() => {
            // Repeat products enough times to fill viewport (min 12 items per half)
            const repeatCount = Math.max(2, Math.ceil(12 / products.length));
            const half = Array.from({ length: repeatCount }, () => products).flat();
            return [...half, ...half].map((product, i) => (
              <Link
                to="/register"
                key={`product-${product.id}-${i}`}
                className="flex-shrink-0 w-[300px] sm:w-[340px] rounded-2xl border border-white/60 bg-white/90 shadow-[0_18px_45px_rgba(31,38,84,0.10)] overflow-hidden hover:shadow-[0_24px_54px_rgba(31,38,84,0.16)] transition-shadow group"
              >
                <div className="h-40 overflow-hidden bg-[hsl(var(--muted))]">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag className="w-10 h-10 opacity-20" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h4 className="font-heading font-bold text-sm truncate">{product.name}</h4>
                  {product.description && (
                    <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">
                      {product.description}
                    </p>
                  )}
                  <div className="flex items-center gap-1.5 mt-3">
                    <Coins className="w-3.5 h-3.5 text-[hsl(var(--accent))]" />
                    <span className="font-mono-num font-bold text-sm">
                      {product.token_cost?.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-muted-foreground">tokens</span>
                  </div>
                </div>
              </Link>
            ));
          })()}
        </div>
      </div>
    </section>
  );
};

// ─── Mission & Vision ────────────────────────────────────────────────────────
const MissionVision = () => (
  <section className="relative z-10 py-16 sm:py-24 bg-white/45 backdrop-blur-sm border-y border-border/40">
    <div className="max-w-6xl mx-auto px-4">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        variants={stagger}
        className="text-center mb-14"
      >
        <motion.h2 variants={fadeUp} className="font-heading text-3xl sm:text-4xl font-bold">
          Our{" "}
          <span className="bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] bg-clip-text text-transparent">
            Mission & Vision
          </span>
        </motion.h2>
        <motion.p variants={fadeUp} className="mt-3 text-muted-foreground max-w-xl mx-auto">
          What drives us every day — and where we're headed.
        </motion.p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={stagger}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Mission */}
        <motion.div
          variants={fadeUp}
          className="bg-white/90 rounded-2xl border border-border/80 p-8 shadow-[0_18px_45px_rgba(31,38,84,0.10)] hover:shadow-[0_24px_54px_rgba(31,38,84,0.15)] transition-shadow"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[hsl(var(--primary))]/20 to-[hsl(var(--accent))]/10 border border-border/60 flex items-center justify-center mb-6">
            <Target className="w-7 h-7 text-[hsl(var(--primary))]" />
          </div>
          <h3 className="font-heading text-2xl font-bold mb-4">Our Mission</h3>
          <p className="text-muted-foreground leading-relaxed">
            To empower every player through an engaging, transparent, and
            rewarding gaming experience. We believe fun should come with real
            value — that's why LudooVictory turns every spin, game, and
            referral into meaningful token rewards you can redeem for actual
            products.
          </p>
          <div className="flex items-center gap-2 mt-6 text-sm font-bold text-[hsl(var(--primary))]">
            <Rocket className="w-4 h-4" />
            Making gaming rewarding for everyone
          </div>
        </motion.div>

        {/* Vision */}
        <motion.div
          variants={fadeUp}
          className="bg-white/90 rounded-2xl border border-border/80 p-8 shadow-[0_18px_45px_rgba(31,38,84,0.10)] hover:shadow-[0_24px_54px_rgba(31,38,84,0.15)] transition-shadow"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[hsl(var(--accent))]/20 to-[hsl(var(--primary))]/10 border border-border/60 flex items-center justify-center mb-6">
            <Eye className="w-7 h-7 text-[hsl(var(--accent))]" />
          </div>
          <h3 className="font-heading text-2xl font-bold mb-4">Our Vision</h3>
          <p className="text-muted-foreground leading-relaxed">
            To become the #1 token-based gaming platform where millions of
            players earn, compete, and grow together. We envision a world
            where entertainment and opportunity go hand in hand — where skill,
            luck, and community drive real-world rewards.
          </p>
          <div className="flex items-center gap-2 mt-6 text-sm font-bold text-[hsl(var(--accent))]">
            <Star className="w-4 h-4" />
            The future of play-to-earn gaming
          </div>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

// ─── Main Landing Page ───────────────────────────────────────────────────────
const LandingPage = () => {
  const isAuth = useSelector(selectIsAuthenticated);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  if (isAuth) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,hsl(var(--background))_0%,hsl(var(--secondary))_52%,hsl(var(--background))_100%)] overflow-hidden">
      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1.5 h-1.5 rounded-full bg-[hsl(var(--accent))]/45 shadow-[0_0_18px_rgba(197,143,34,0.42)]"
            style={{ left: `${15 + i * 15}%`, top: `${20 + (i % 3) * 25}%` }}
            animate={{ y: [0, -30, 0], opacity: [0.2, 0.6, 0.2] }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.4,
            }}
          />
        ))}
      </div>

      {/* Top Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-border/50 shadow-[0_8px_28px_rgba(31,38,84,0.08)]">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 h-16 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.05 }}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-[hsl(var(--primary))] via-[hsl(var(--primary))] to-[hsl(var(--accent))] flex items-center justify-center shadow-lg shadow-[hsl(var(--accent))]/25 shrink-0"
            >
              <span className="text-base font-bold text-[hsl(var(--primary-foreground))]">
                <div className="w-10 h-10 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent))] shadow-lg shadow-[hsl(var(--accent))]/20">
                  <img
                    src="/logo.png"
                    alt="LudoVictory"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              </span>
            </motion.div>
            <span className="font-heading font-bold text-lg sm:text-xl truncate">
              LudooVictory
            </span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <Link
              to="/login"
              data-testid="landing-login-btn"
              className="px-2.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-foreground hover:bg-black/5 transition-colors whitespace-nowrap"
            >
              Log In
            </Link>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/register"
                data-testid="landing-signup-btn"
                className="px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:opacity-90 transition-opacity shadow-lg shadow-[hsl(var(--primary))]/20 whitespace-nowrap"
              >
                <span className="sm:hidden">Sign Up</span>
                <span className="hidden sm:inline">Sign Up Free</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════════════
          1. HERO SECTION (kept as-is)
          ═══════════════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden"
      >
        <div className="absolute inset-0">
          <motion.div style={{ y: heroY }} className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(1200px_circle_at_25%_14%,rgba(197,143,34,0.22),transparent_58%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_78%_20%,rgba(31,38,84,0.18),transparent_54%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(620px_circle_at_52%_82%,rgba(197,143,34,0.12),transparent_50%)]" />
          </motion.div>
          <motion.div
            style={{ y: heroY, opacity: heroOpacity }}
            className="absolute inset-0"
          >
            <img
              src={HERO_IMG}
              alt="Gaming Arena"
              className="w-full h-full object-cover opacity-[0.14] mix-blend-multiply"
            />
          </motion.div>
        </div>

        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 max-w-4xl mx-auto px-4 text-center"
        >
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp} className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 border border-[hsl(var(--accent))]/30 text-[hsl(var(--primary))] text-sm font-medium shadow-[0_10px_26px_rgba(31,38,84,0.08)]">
                <Sparkles className="w-4 h-4" /> Earn 100 Tokens on Signup
              </span>
            </motion.div>
            <motion.h1
              variants={fadeUp}
              className="font-heading text-4xl sm:text-5xl md:text-7xl font-bold leading-tight"
            >
              Play. Earn.
              <br />
              <span className="bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] bg-clip-text text-transparent">
                Win Rewards.
              </span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              LudooVictory is the ultimate token-based gaming platform. Spin
              wheels, play PvP games, enter prize draws, and redeem tokens for
              real products.
            </motion.p>
            <motion.div
              variants={fadeUp}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/register"
                  data-testid="hero-signup-btn"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--primary))]/90 text-[hsl(var(--primary-foreground))] hover:opacity-95 transition-opacity shadow-xl shadow-[hsl(var(--primary))]/25 neon-glow-cyan"
                >
                  Get Started <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-lg border border-border/80 hover:bg-black/5 transition-colors"
              >
                Already a Player? Log In
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          2. UPCOMING EVENTS (NEW — auto-scrolling horizontal carousel)
          ═══════════════════════════════════════════════════════════════════ */}
      <UpcomingEventsCarousel />

      {/* ═══════════════════════════════════════════════════════════════════
          3. SPIN & LEADERBOARD — Leaderboard LEFT, Spinner CENTER, New Players RIGHT
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-16 sm:py-20 bg-white/45 backdrop-blur-sm border-y border-border/40">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={stagger}
            className="text-center mb-10"
          >
            <motion.h2 variants={fadeUp} className="font-heading text-3xl sm:text-4xl font-bold">
              Join the{" "}
              <span className="text-[hsl(var(--accent))]">Live Action</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Spin, climb the leaderboard, and see new players joining LudooVictory in real time.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.18 }}
            variants={stagger}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch"
          >
            {/* LEFT — Leaderboard */}
            <motion.div variants={fadeUp} className="flex flex-col h-full">
              <LandingLeaderboard />
            </motion.div>
            {/* CENTER — Spinner */}
            <motion.div variants={fadeUp} className="flex flex-col h-full">
              <LandingSpinner />
            </motion.div>
            {/* RIGHT — New Players */}
            <motion.div
              variants={fadeUp}
              className="bg-white/90 rounded-2xl border border-border/80 p-4 sm:p-5 shadow-[0_18px_45px_rgba(31,38,84,0.10)] flex flex-col h-full"
            >
              <div className="flex items-center justify-center gap-3 mb-6">
                <UserPlus className="w-7 h-7 text-[hsl(var(--primary))]" />
                <h3 className="font-heading text-3xl font-black bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] bg-clip-text text-transparent">
                  New Players
                </h3>
              </div>
              <div className="flex-1 overflow-hidden">
                <UsersTicker />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          4. EVERYTHING YOU NEED TO WIN BIG (Features — kept as-is)
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeUp} className="font-heading text-3xl sm:text-4xl font-bold">
              Everything You Need to
              <span className="text-[hsl(var(--primary))]"> Win Big</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-4 text-muted-foreground max-w-xl mx-auto">
              From spinning wheels to PvP battles — earn, compete, and redeem.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  variants={fadeUp}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="bg-white/90 rounded-2xl border border-border/80 p-6 shadow-[0_18px_45px_rgba(31,38,84,0.10)] hover:border-[rgba(197,143,34,0.42)] hover:shadow-[0_0_0_1px_rgba(197,143,34,0.24),0_24px_48px_rgba(31,38,84,0.14)] transition-all cursor-default"
                >
                  <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center ${f.color === "primary" ? "bg-[hsl(var(--primary))]/10" : "bg-[hsl(var(--accent))]/10"
                    }`}>
                    <Icon className={`w-6 h-6 ${f.color === "primary" ? "text-[hsl(var(--primary))]" : "text-[hsl(var(--accent))]"
                      }`} />
                  </div>
                  <h3 className="font-heading font-bold text-lg mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          5. PRODUCTS LIST (replaces Image Showcase — real API, auto-scroll)
          ═══════════════════════════════════════════════════════════════════ */}
      <ProductsCarousel />

      {/* ═══════════════════════════════════════════════════════════════════
          6. MISSION & VISION (NEW)
          ═══════════════════════════════════════════════════════════════════ */}
      <MissionVision />

      {/* ═══════════════════════════════════════════════════════════════════
          7. STATS / ACTIVE USERS (moved from position 2)
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 bg-white/80 backdrop-blur-lg border-y border-border/50 shadow-[0_10px_36px_rgba(31,38,84,0.06)]">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={stagger}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <motion.div key={s.label} variants={scaleIn} className="text-center">
                  <Icon className="w-6 h-6 mx-auto mb-2 text-[hsl(var(--primary))]" />
                  <p className="font-mono-num text-2xl sm:text-3xl font-bold neon-text-cyan">
                    {s.value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          8. HOW IT WORKS + APP STORE BADGES
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeUp} className="font-heading text-3xl sm:text-4xl font-bold">
              How It <span className="text-[hsl(var(--accent))]">Works</span>
            </motion.h2>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              { step: "01", title: "Sign Up Free", desc: "Create an account and get 100 tokens instantly. No credit card needed.", icon: Users },
              { step: "02", title: "Play & Earn", desc: "Spin wheels, enter prize draws, or battle in PvP games to earn more tokens.", icon: Gamepad2 },
              { step: "03", title: "Redeem Rewards", desc: "Use tokens for gadgets, gift cards, and exclusive prizes in the bazaar.", icon: Gift },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <motion.div key={item.step} variants={fadeUp} className="text-center">
                  <div className="w-16 h-16 rounded-2xl mx-auto mb-4 bg-gradient-to-br from-[hsl(var(--primary))]/20 to-[hsl(var(--accent))]/10 border border-border/60 flex items-center justify-center">
                    <Icon className="w-7 h-7 text-[hsl(var(--primary))]" />
                  </div>
                  <span className="font-mono-num text-xs text-[hsl(var(--accent))] font-bold">STEP {item.step}</span>
                  <h3 className="font-heading font-bold text-lg mt-2 mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* App Store Badges */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="mt-16 text-center"
          >
            <motion.div variants={fadeUp} className="mb-4">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[hsl(var(--accent))]/10 text-[hsl(var(--accent))] text-xs font-bold">
                <Smartphone className="w-3.5 h-3.5" /> Coming Soon on Mobile
              </span>
            </motion.div>
            <motion.p variants={fadeUp} className="text-muted-foreground text-sm mb-6">
              LudooVictory will soon be available on your favourite app stores.
            </motion.p>
            <motion.div variants={fadeUp} className="flex items-center justify-center gap-4 flex-wrap">
              {/* Google Play Badge */}
              <div className="relative group cursor-pointer">
                <div className="flex items-center gap-3 px-6 py-3 rounded-xl bg-black text-white border border-white/10 shadow-lg hover:shadow-xl transition-shadow">
                  <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-1.04l2.459 1.427c.404.232.654.664.654 1.13s-.25.898-.654 1.13l-2.753 1.596-2.546-2.547 2.84-2.736zM5.864 3.47l10.937 6.334-2.302 2.302L5.864 3.47z" />
                  </svg>
                  <div className="text-left">
                    <p className="text-[10px] leading-none opacity-70">GET IT ON</p>
                    <p className="font-heading font-bold text-sm leading-tight">Google Play</p>
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-[hsl(var(--accent))] text-[10px] font-bold text-white shadow-md">
                  Soon
                </div>
              </div>

              {/* Apple Store Badge */}
              <div className="relative group cursor-pointer">
                <div className="flex items-center gap-3 px-6 py-3 rounded-xl bg-black text-white border border-white/10 shadow-lg hover:shadow-xl transition-shadow">
                  <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  <div className="text-left">
                    <p className="text-[10px] leading-none opacity-70">Download on the</p>
                    <p className="font-heading font-bold text-sm leading-tight">App Store</p>
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-[hsl(var(--accent))] text-[10px] font-bold text-white shadow-md">
                  Soon
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          9. TRUST + CTA + FOOTER (kept as-is)
          ═══════════════════════════════════════════════════════════════════ */}

      {/* Trust Section */}
      <section className="relative z-10 py-16 bg-white/60 backdrop-blur-sm border-y border-border/40">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-[hsl(var(--primary))]" />
              <h3 className="font-heading font-bold text-xl">Safe, Secure & Fun</h3>
            </motion.div>
            <motion.p variants={fadeUp} className="text-muted-foreground max-w-lg mx-auto mb-6">
              Tokens are virtual credits with no real monetary value. Play responsibly and have fun! All transactions are logged and transparent.
            </motion.p>
            <motion.div variants={fadeUp} className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
              <Link to="/privacy" className="hover:text-[hsl(var(--primary))] transition-colors">Privacy Policy</Link>
              <span className="text-border">|</span>
              <Link to="/terms" className="hover:text-[hsl(var(--primary))] transition-colors">Terms & Conditions</Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 py-20 sm:py-28">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.h2 variants={fadeUp} className="font-heading text-3xl sm:text-5xl font-bold">
              Ready to Start
              <span className="bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] bg-clip-text text-transparent"> Winning?</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-4 text-lg text-muted-foreground">
              Join thousands of players earning tokens every day.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="inline-block">
                <Link
                  to="/register"
                  data-testid="cta-signup-btn"
                  className="inline-flex items-center gap-2 px-10 py-5 rounded-2xl font-bold text-xl bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--primary))]/90 text-[hsl(var(--primary-foreground))] hover:opacity-95 transition-opacity shadow-xl shadow-[hsl(var(--primary))]/25 neon-glow-cyan"
                >
                  <Coins className="w-6 h-6" /> Claim 100 Free Tokens
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/40 py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent))] flex items-center justify-center">
              <span className="text-xs font-bold text-[hsl(var(--primary-foreground))]">D</span>
            </div>
            <span className="font-heading font-bold">LudooVictory</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link to="/about" className="hover:text-foreground transition-colors">About</Link>
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link>
          </div>
          <p className="text-xs text-muted-foreground">&copy; 2026 LudooVictory. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;