import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, selectIsAuthenticated, logout } from '@/store/authSlice';
import { useGetMeQuery, useGetNotificationsQuery } from '@/store/apiSlice';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Coins, ShoppingBag, Bell, User, Menu, X,
  Home, RotateCw, Trophy, ShoppingBag as BazaarIcon,
  Gamepad2, LogOut, BarChart3, MessageCircle,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { path: '/dashboard', label: 'Home', icon: Home },
  // { path: '/spinner', label: 'Spin', icon: RotateCw },
  { path: '/bazaar', label: 'Shopping Bazaar', icon: BazaarIcon },
  { path: '/buy-tokens', label: 'Buy Tokens', icon: Coins },
];

const Navbar = () => {
  const sessionUser = useSelector(selectCurrentUser);
  const isAuth = useSelector(selectIsAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Fresh wallet balances — poll every 30s
  const { data: meData } = useGetMeQuery(undefined, {
    skip: !isAuth,
    pollingInterval: 30000,
  });

  // Notifications stub — safe until module is built
  const { data: notifData } = useGetNotificationsQuery(undefined, {
    skip: !isAuth,
  });

  const wallet = meData?.data?.wallet || null;
  const referralBalance = wallet?.referral_token_balance
    ?? sessionUser?.referral_token_balance ?? 0;
  const shoppingBalance = wallet?.shopping_token_balance
    ?? sessionUser?.shopping_token_balance ?? 0;
  const unreadCount = notifData?.data?.unread_count ?? 0;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  if (!isAuth) return null;

  return (
    <>
      {/* ── Top Header ──────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-border/60 shadow-[0_8px_28px_rgba(31,38,84,0.08)]">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">

          {/* ── LEFT: Logo + Referral Token ── */}
          <div className="flex items-center gap-4 shrink-0">
            {/* Logo */}
            <Link
              to="/dashboard"
              className="flex h-10 items-center gap-2.5 shrink-0"
            >
              <div className="w-10 h-10 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent))] shadow-lg shadow-[hsl(var(--accent))]/20">
                <img
                  src="/logo.png"
                  alt="LudoVictory"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <span className="hidden sm:block font-heading font-bold text-lg leading-none">
                LudoVictory
              </span>
            </Link>

            {/* Referral tokens — now near logo, uses ACCENT (gold/amber) color */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="hidden sm:flex items-center gap-2 bg-[hsl(var(--secondary))] border border-[hsl(var(--accent))]/30 rounded-full px-3.5 py-1.5 cursor-pointer"
              onClick={() => navigate('/profile')}
            >
              <Coins className="w-4 h-4 text-[hsl(var(--accent))]" />
              <div className="flex flex-col items-start leading-none">
                <span className="font-mono-num font-bold text-sm text-[hsl(var(--accent))]">
                  {referralBalance.toLocaleString()}
                </span>
                <span className="text-[9px] text-muted-foreground font-medium">Referral</span>
              </div>
            </motion.div>
          </div>

          {/* ── RIGHT: Nav + Shopping Token + Actions ── */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${location.pathname === item.path
                      ? 'bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))]'
                      : 'text-muted-foreground hover:text-foreground hover:bg-black/5'
                    }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/leaderboard"
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${location.pathname === '/leaderboard'
                    ? 'bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))]'
                    : 'text-muted-foreground hover:text-foreground hover:bg-black/5'
                  }`}
              >
                Ranks
              </Link>
            </nav>

            <div className="flex items-center gap-2">
              {/* Shopping tokens — near profile, uses PRIMARY (navy) color */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="hidden sm:flex items-center gap-2 bg-[hsl(var(--secondary))] border border-[hsl(var(--primary))]/30 rounded-full px-3.5 py-1.5 cursor-pointer"
                onClick={() => navigate('/profile')}
              >
                <ShoppingBag className="w-4 h-4 text-[hsl(var(--primary))]" />
                <div className="flex flex-col items-start leading-none">
                  <span className="font-mono-num font-bold text-sm text-[hsl(var(--primary))]">
                    {shoppingBalance.toLocaleString()}
                  </span>
                  <span className="text-[9px] text-muted-foreground font-medium">Shopping</span>
                </div>
              </motion.div>

              {/* Notifications — hidden until module built */}
              <button
                data-testid="notifications-button"
                className="relative p-2 rounded-xl hover:bg-black/5 transition-colors"
                onClick={() => { }} // wire to sheet when notifications are built
              >
                {/* <Bell className="w-5 h-5 text-muted-foreground" /> */}
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[hsl(var(--destructive))] rounded-full text-[10px] flex items-center justify-center font-bold text-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Profile */}
              <Link
                to="/profile"
                className="p-2 rounded-xl hover:bg-black/5 transition-colors"
              >
                {sessionUser?.profile_image ? (
                  <img
                    src={sessionUser.profile_image}
                    alt="Profile"
                    className="w-5 h-5 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5" />
                )}
              </Link>

              {/* Mobile menu toggle */}
              <button
                className="md:hidden p-2 rounded-xl hover:bg-black/5"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile Bottom Nav ────────────────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-border/60 shadow-[0_-8px_28px_rgba(31,38,84,0.08)]">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors relative ${isActive ? 'text-[hsl(var(--primary))]' : 'text-muted-foreground'
                  }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="absolute bottom-0 w-8 h-0.5 bg-[hsl(var(--primary))] rounded-full"
                  />
                )}
              </Link>
            );
          })}

          {/* Compact wallet on mobile bottom bar — colors swapped */}
          <div
            onClick={() => navigate('/profile')}
            className="flex flex-col items-center gap-0.5 px-3 py-1 cursor-pointer text-muted-foreground"
          >
            <div className="flex gap-1.5">
              <span className="font-mono-num text-[11px] font-bold text-[hsl(var(--accent))]">
                {referralBalance}
              </span>
              <span className="text-[10px] text-muted-foreground">/</span>
              <span className="font-mono-num text-[11px] font-bold text-[hsl(var(--primary))]">
                {shoppingBalance}
              </span>
            </div>
            <span className="text-[10px]">Tokens</span>
          </div>
        </div>
      </nav>

      {/* ── Mobile Slide Menu (with solid background) ────────────────── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="md:hidden fixed inset-0 z-40 bg-white pt-16"
          >
            <div className="p-4 space-y-2">
              {[
                ...navItems,
                { path: '/leaderboard', label: 'Leaderboard', icon: BarChart3 },
                { path: '/contact', label: 'Support', icon: MessageCircle },
                { path: '/profile', label: 'Profile', icon: User },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${location.pathname === item.path
                        ? 'bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))]'
                        : 'text-foreground hover:bg-black/5'
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium text-base">{item.label}</span>
                  </Link>
                );
              })}

              {/* Wallet summary in slide menu — colors swapped, separated, bigger */}
              <div className="px-4 py-4 rounded-xl bg-[hsl(var(--muted))] mt-3">
                <p className="text-xs text-muted-foreground mb-3 font-medium">Your Tokens</p>
                <div className="flex justify-between gap-4">
                  {/* Referral — accent color */}
                  <div className="flex items-center gap-2 flex-1 bg-white rounded-xl px-3 py-2.5 border border-[hsl(var(--accent))]/20">
                    <Coins className="w-5 h-5 text-[hsl(var(--accent))]" />
                    <div>
                      <p className="font-mono-num font-bold text-base text-[hsl(var(--accent))]">{referralBalance.toLocaleString()}</p>
                      <p className="text-[10px] text-muted-foreground font-medium">Referral</p>
                    </div>
                  </div>
                  {/* Shopping — primary color */}
                  <div className="flex items-center gap-2 flex-1 bg-white rounded-xl px-3 py-2.5 border border-[hsl(var(--primary))]/20">
                    <ShoppingBag className="w-5 h-5 text-[hsl(var(--primary))]" />
                    <div>
                      <p className="font-mono-num font-bold text-base text-[hsl(var(--primary))]">{shoppingBalance.toLocaleString()}</p>
                      <p className="text-[10px] text-muted-foreground font-medium">Shopping</p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-black/5 transition-colors text-[hsl(var(--destructive))] w-full mt-2"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium text-base">Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
