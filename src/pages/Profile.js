import { useSelector, useDispatch } from "react-redux";
import { selectCurrentUser, logout, updateUser } from "@/store/authSlice";
import {
  useGetMeQuery,
  useGetMyRankQuery,
  useGetReferralLinkQuery,
  useGetReferralHistoryQuery,
  useUpdateMeMutation,
  useGetMyTransactionsQuery,
  useGetAppConfigQuery,
} from "@/store/apiSlice";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Coins,
  Copy,
  ShoppingBag,
  Mail,
  Phone,
  Gift,
  LogOut,
  Edit3,
  Check,
  X,
  ArrowUpRight,
  Share2,
  ArrowDownLeft,
  Camera,
  Users,
  Trophy,
  Zap,
  Link as LinkIcon,
} from "lucide-react";
import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

import StreakWidget from "@/components/StreakWidget";
// ─── Helpers ──────────────────────────────────────────────────────────────────

const sourceLabels = {
  signup_bonus: "Signup Bonus",
  referral_bonus_referrer: "Referral (sent)",
  referral_bonus_referred: "Referral (received)",
  spinner_spin: "Spin Cost",
  spinner_reward: "Spin Reward",
  product_redemption: "Product Redeemed",
  product_refund: "Product Refund",
};

const WalletBadge = ({ type }) => (
  <span
    className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap ${
      type === "referral"
        ? "bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))]"
        : "bg-[hsl(var(--accent))]/10 text-[hsl(var(--accent))]"
    }`}
  >
    {type === "referral" ? "Referral" : "Shopping"}
  </span>
);

// Clipboard with HTTP fallback
const copyToClipboard = async (text, label = "Copied!") => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      // Fallback for HTTP
      const el = document.createElement("textarea");
      el.value = text;
      el.style.cssText = "position:fixed;left:-9999px;top:-9999px";
      document.body.appendChild(el);
      el.focus();
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    toast.success(label);
  } catch {
    toast.error("Copy failed — please copy manually");
  }
};
const cropAndResizeImage = (file, maxSize = 400) => {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const size = Math.min(img.width, img.height);
      const offsetX = (img.width - size) / 2;
      const offsetY = (img.height - size) / 2;
      canvas.width = maxSize;
      canvas.height = maxSize;
      canvas
        .getContext("2d")
        .drawImage(img, offsetX, offsetY, size, size, 0, 0, maxSize, maxSize);
      URL.revokeObjectURL(url);
      canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.82);
    };
    img.src = url;
  });
};

// ─── Profile page ─────────────────────────────────────────────────────────────
const Profile = () => {
  const sessionUser = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: "",
    username: "",
    email: "",
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [pendingImageBlob, setPendingImageBlob] = useState(null);
  const [activeTab, setActiveTab] = useState("transactions");
  const [txnWalletFilter, setTxnWalletFilter] = useState("");
  const [txnTypeFilter, setTxnTypeFilter] = useState("");
  const [txnPage, setTxnPage] = useState(1);
  const [referralPage, setReferralPage] = useState(1);
  const { data: configData } = useGetAppConfigQuery();

  const { data: meData, refetch: refetchMe } = useGetMeQuery(undefined, {
    skip: !sessionUser,
  });
  const { data: rankData } = useGetMyRankQuery(undefined, {
    skip: !sessionUser,
  });
  const { data: referralLinkData } = useGetReferralLinkQuery(undefined, {
    skip: !sessionUser,
  });
  const { data: referralHistoryData } = useGetReferralHistoryQuery(
    { page: referralPage, limit: 10 },
    { skip: !sessionUser || activeTab !== "referrals" },
  );
  const { data: txnData, isLoading: txnLoading } = useGetMyTransactionsQuery(
    {
      page: txnPage,
      limit: 20,
      ...(txnWalletFilter && { wallet_type: txnWalletFilter }),
      ...(txnTypeFilter && { type: txnTypeFilter }),
    },
    { skip: !sessionUser || activeTab !== "transactions" },
  );
  const [updateMe, { isLoading: updating }] = useUpdateMeMutation();

  const profile = meData?.data || sessionUser || {};
  const wallet = meData?.data?.wallet || null;
  const myRank = rankData?.data || null;
  const referralInfo = referralLinkData?.data || null;

  const referralBalance =
    wallet?.referral_token_balance ?? sessionUser?.referral_token_balance ?? 0;
  const shoppingBalance =
    wallet?.shopping_token_balance ?? sessionUser?.shopping_token_balance ?? 0;
  const config = configData?.data || {};

  const REFERRER_BONUS = config.referrer_bonus ?? 200;
  const REFERRED_BONUS = config.referred_bonus ?? 100;
  const transactions = txnData?.data || [];
  const txnPagination = txnData?.pagination || {};
  const avatarUrl = previewImage || profile.profile_image || null;
  const initials = (profile.full_name || "U")[0].toUpperCase();
  const referralLink = referralInfo?.referral_link
    ? referralInfo.referral_link.replace(
        /^https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?/i,
        window.location.origin,
      )
    : "";

  const handleShareReferral = async () => {
    if (!referralLink) {
      toast.error("Referral link not available");
      return;
    }

    const shareText = `Join LudooVictory using my referral link! You'll receive ${REFERRED_BONUS} referral tokens when you sign up, and I'll receive ${REFERRER_BONUS} referral tokens.`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Join LudooVictory",
          text: shareText,
          url: referralLink,
        });
      } else {
        await copyToClipboard(
          `${shareText}\n\nSign up here: ${referralLink}`,
          "Referral message copied!",
        );
      }
    } catch (err) {
      if (err.name !== "AbortError") toast.error("Unable to share");
    }
  };

  const handleImagePick = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be under 10MB");
      return;
    }
    const cropped = await cropAndResizeImage(file, 400);
    setPendingImageBlob(cropped);
    setPreviewImage(URL.createObjectURL(cropped));
  }, []);

  const handleEdit = () => {
    setEditForm({
      full_name: profile.full_name || "",
      username: profile.username || "",
      email: profile.email || "",
    });
    setPreviewImage(null);
    setPendingImageBlob(null);
    setEditing(true);
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setPreviewImage(null);
    setPendingImageBlob(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSaveEdit = async () => {
    const formData = new FormData();
    if (editForm.full_name && editForm.full_name !== profile.full_name)
      formData.append("full_name", editForm.full_name);
    if (editForm.username && editForm.username !== profile.username)
      formData.append("username", editForm.username);
    if (editForm.email && editForm.email !== profile.email)
      formData.append("email", editForm.email);
    if (pendingImageBlob)
      formData.append("profile_image", pendingImageBlob, "profile.jpg");

    if ([...formData.entries()].length === 0) {
      toast.info("No changes to save");
      setEditing(false);
      return;
    }
    try {
      const res = await updateMe(formData).unwrap();
      dispatch(updateUser(res.user));
      toast.success("Profile updated!");
      setEditing(false);
      setPreviewImage(null);
      setPendingImageBlob(null);
      refetchMe();
    } catch (err) {
      toast.error(err.data?.message || "Update failed");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-16 pb-20 md:pb-6"
    >
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {/* ── Profile Card ──────────────────────────────────────────── */}
        <div className="bg-white/90 rounded-2xl border border-border/80 shadow-[0_18px_45px_rgba(31,38,84,0.10)] p-4 sm:p-6">
          {/* Top row: avatar + name + edit button */}
          <div className="flex items-start gap-4 mb-5">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent))] flex items-center justify-center">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold text-[hsl(var(--primary-foreground))]">
                    {initials}
                  </span>
                )}
              </div>
              {editing && (
                <>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[hsl(var(--primary))] text-white flex items-center justify-center shadow-md hover:opacity-90"
                  >
                    <Camera className="w-3 h-3" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImagePick}
                  />
                </>
              )}
            </div>

            {/* Name / edit fields */}
            <div className="flex-1 min-w-0">
              {editing ? (
                <div className="space-y-2">
                  <input
                    value={editForm.full_name}
                    onChange={(e) =>
                      setEditForm((p) => ({ ...p, full_name: e.target.value }))
                    }
                    placeholder="Full Name"
                    className="w-full bg-[hsl(var(--muted))] border border-border/80 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                  />
                  <input
                    value={editForm.username}
                    onChange={(e) =>
                      setEditForm((p) => ({ ...p, username: e.target.value }))
                    }
                    placeholder="Username"
                    className="w-full bg-[hsl(var(--muted))] border border-border/80 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                  />
                  <input
                    value={editForm.email}
                    onChange={(e) =>
                      setEditForm((p) => ({ ...p, email: e.target.value }))
                    }
                    placeholder="Email"
                    className="w-full bg-[hsl(var(--muted))] border border-border/80 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                  />
                  {previewImage && (
                    <p className="text-[10px] text-[hsl(var(--primary))]">
                      ✓ Photo ready to upload
                    </p>
                  )}
                </div>
              ) : (
                <>
                  <h2 className="font-heading text-xl font-bold truncate">
                    {profile.full_name}
                  </h2>
                  <p className="text-sm text-muted-foreground truncate">
                    @{profile.username}
                  </p>
                  {/* Email + mobile stacked to avoid overflow */}
                  <div className="mt-1.5 space-y-1">
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5 truncate">
                      <Mail className="w-3 h-3 shrink-0" />
                      <span className="truncate">{profile.email}</span>
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Phone className="w-3 h-3 shrink-0" />
                      {profile.mobile}
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Edit / Save / Cancel — always top-right */}
            <div className="shrink-0">
              {editing ? (
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveEdit}
                    disabled={updating}
                    className="p-2 rounded-lg bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/20 disabled:opacity-50"
                  >
                    {updating ? (
                      <span className="w-4 h-4 border-2 border-[hsl(var(--primary))]/40 border-t-[hsl(var(--primary))] rounded-full animate-spin block" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="p-2 rounded-lg bg-[hsl(var(--destructive))]/10 text-[hsl(var(--destructive))] hover:bg-[hsl(var(--destructive))]/20"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleEdit}
                  className="p-2 rounded-lg hover:bg-black/5 text-muted-foreground"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Wallet balances — equal height cards, no collapse */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            {[
              {
                icon: Coins,
                iconColor: "text-[hsl(var(--primary))]",
                glow: "neon-glow-cyan",
                label: "Referral Tokens",
                value: referralBalance,
                note: "Earned from referrals • use to spin",
              },
              {
                icon: ShoppingBag,
                iconColor: "text-[hsl(var(--accent))]",
                glow: "neon-glow-amber",
                label: "Shopping Tokens",
                value: shoppingBalance,
                note: "Earned from spins • use in bazaar",
              },
            ].map((w) => {
              const Icon = w.icon;
              return (
                <div
                  key={w.label}
                  className={`bg-[hsl(var(--secondary))] rounded-xl p-3  flex flex-col gap-1`}
                >
                  <div className="flex items-center gap-1.5">
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${w.iconColor}`} />
                    <p className="text-[10px] text-muted-foreground leading-none truncate">
                      {w.label}
                    </p>
                  </div>
                  <p className="font-mono-num text-2xl font-bold leading-none">
                    {w.value.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-muted-foreground leading-tight">
                    {w.note}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Leaderboard stats — 3 equal columns */}
          {myRank && (
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  icon: Users,
                  iconColor: "text-[hsl(var(--primary))]",
                  value: myRank.total_referrals ?? 0,
                  label: "Referrals",
                },
                {
                  icon: Zap,
                  iconColor: "text-[hsl(var(--accent))]",
                  value: myRank.total_spins ?? 0,
                  label: "Spins",
                },
                {
                  icon: Trophy,
                  iconColor: "text-[hsl(var(--accent))]",
                  value: myRank.rank ? `#${myRank.rank}` : "—",
                  label: "Rank",
                },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <div
                    key={s.label}
                    className="bg-[hsl(var(--muted))] rounded-xl p-3 text-center"
                  >
                    <Icon className={`w-4 h-4 mx-auto mb-1 ${s.iconColor}`} />
                    <p className="font-mono-num font-bold text-sm">{s.value}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {s.label}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <StreakWidget />
        {/* ── Referral Section ──────────────────────────────────────── */}
        <div className="bg-white/90 rounded-2xl border border-border/80 shadow-[0_18px_45px_rgba(31,38,84,0.10)] p-4 sm:p-6">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-heading font-bold">Invite Friends & Earn</h3>
            {referralInfo && (
              <span className="text-xs text-muted-foreground text-right shrink-0">
                {referralInfo.total_referrals} done •{" "}
                {referralInfo.pending_referrals} pending
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            You get{" "}
            <span className="font-bold text-[hsl(var(--primary))]">
              {REFERRER_BONUS}
            </span>{" "}
            referral tokens, they get{" "}
            <span className="font-bold text-[hsl(var(--accent))]">
              {REFERRED_BONUS}
            </span>
            !
          </p>

          {/* Referral code row — always horizontal, button never wraps */}
          <div className="flex items-center gap-2 mb-3">
            <div
              data-testid="profile-referral-code"
              className="flex-1 min-w-0 bg-[hsl(var(--secondary))] rounded-xl px-4 py-3 font-mono-num text-lg font-bold tracking-widest text-center  overflow-hidden text-ellipsis"
            >
              {profile.referral_code || "--------"}
            </div>
            <motion.button
              data-testid="profile-copy-referral-button"
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                copyToClipboard(
                  profile.referral_code || "",
                  "Referral code copied!",
                )
              }
              className="shrink-0 p-3 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-xl hover:opacity-90"
            >
              <Copy className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Referral link row */}
          {referralLink && (
            <>
              <div className="flex items-center gap-2">
                <a
                  href={referralLink}
                  className="flex-1 min-w-0 bg-[hsl(var(--muted))] rounded-xl px-3 py-2 flex items-center gap-1.5 overflow-hidden hover:bg-black/5 transition-colors"
                >
                  <LinkIcon className="w-3 h-3 shrink-0 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground truncate">
                    {referralLink}
                  </span>
                </a>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    copyToClipboard(referralLink, "Referral link copied!")
                  }
                  className="shrink-0 p-2 bg-[hsl(var(--muted))] rounded-xl hover:bg-black/10"
                >
                  <Copy className="w-4 h-4 text-muted-foreground" />
                </motion.button>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleShareReferral}
                className="mt-3 w-full flex items-center justify-center gap-2 bg-[hsl(var(--primary))] text-white py-3 rounded-xl font-medium hover:opacity-90"
              >
                <Share2 className="w-4 h-4" />
                Share Referral Link
              </motion.button>
            </>
          )}
        </div>

        {/* ── Token History + Referral History ─────────────────────── */}
        <div className="bg-white/90 rounded-2xl border border-border/80 shadow-[0_18px_45px_rgba(31,38,84,0.10)] overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-border/80">
            {[
              { key: "transactions", label: "Token History" },
              { key: "referrals", label: "Referral History" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? "text-[hsl(var(--primary))] border-b-2 border-[hsl(var(--primary))]"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── Token History tab ──────────────────────────────────── */}
          {activeTab === "transactions" && (
            <div data-testid="profile-transaction-table">
              {/* Filters */}
              <div className="flex flex-wrap gap-2 p-3 border-b border-border/40">
                <div className="flex gap-1 flex-wrap">
                  {[
                    { label: "All", value: "" },
                    { label: "Referral", value: "referral" },
                    { label: "Shopping", value: "shopping" },
                  ].map((f) => (
                    <button
                      key={f.value}
                      onClick={() => {
                        setTxnWalletFilter(f.value);
                        setTxnPage(1);
                      }}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                        txnWalletFilter === f.value
                          ? "bg-[hsl(var(--primary))] text-white"
                          : "bg-[hsl(var(--muted))] text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
                <div className="flex gap-1 flex-wrap">
                  {[
                    { label: "All", value: "" },
                    { label: "Credit", value: "credit" },
                    { label: "Debit", value: "debit" },
                  ].map((f) => (
                    <button
                      key={f.value}
                      onClick={() => {
                        setTxnTypeFilter(f.value);
                        setTxnPage(1);
                      }}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                        txnTypeFilter === f.value
                          ? "bg-[hsl(var(--accent))] text-white"
                          : "bg-[hsl(var(--muted))] text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {txnLoading ? (
                <div className="flex items-center justify-center py-10">
                  <div className="w-6 h-6 border-2 border-[hsl(var(--accent))] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : transactions.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground text-sm">
                  <Coins className="w-8 h-8 mx-auto mb-2 opacity-20" />
                  <p>No transactions yet</p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto max-h-96">
                    <table className="w-full min-w-[480px]">
                      <thead className="sticky top-0 bg-white/95 z-10">
                        <tr className="border-b border-border/40">
                          <th className="text-left p-3 text-xs text-muted-foreground font-medium w-8"></th>
                          <th className="text-left p-3 text-xs text-muted-foreground font-medium">
                            Source
                          </th>
                          <th className="text-left p-3 text-xs text-muted-foreground font-medium">
                            Wallet
                          </th>
                          <th className="text-right p-3 text-xs text-muted-foreground font-medium">
                            Tokens
                          </th>
                          <th className="text-right p-3 text-xs text-muted-foreground font-medium">
                            Balance
                          </th>
                          <th className="text-right p-3 text-xs text-muted-foreground font-medium hidden sm:table-cell">
                            Last Updated
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((txn) => (
                          <tr
                            key={txn.id}
                            className="border-b border-border/20 hover:bg-black/5 transition-colors"
                          >
                            <td className="p-3 w-8">
                              {txn.type === "credit" ? (
                                <ArrowDownLeft className="w-4 h-4 text-green-500" />
                              ) : (
                                <ArrowUpRight className="w-4 h-4 text-red-400" />
                              )}
                            </td>
                            <td className="p-3 text-sm max-w-[140px]">
                              <p className="truncate">
                                {sourceLabels[txn.source] || txn.source}
                              </p>
                              {txn.remarks && (
                                <p className="text-[10px] text-muted-foreground truncate">
                                  {txn.remarks}
                                </p>
                              )}
                            </td>
                            <td className="p-3">
                              <WalletBadge type={txn.wallet_type} />
                            </td>
                            <td
                              className={`p-3 text-right font-mono-num text-sm font-bold whitespace-nowrap ${
                                txn.type === "credit"
                                  ? "text-green-600"
                                  : "text-red-500"
                              }`}
                            >
                              {txn.type === "credit" ? "+" : "-"}
                              {txn.tokens}
                            </td>
                            <td className="p-3 text-right font-mono-num text-sm text-muted-foreground whitespace-nowrap">
                              {txn.balance_after}
                            </td>
                            <td className="p-3 text-right text-xs text-muted-foreground whitespace-nowrap hidden sm:table-cell">
                              {txn.created_at
                                ? formatDistanceToNow(
                                    new Date(txn.created_at),
                                    { addSuffix: true },
                                  )
                                : ""}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {txnPagination.total_pages > 1 && (
                    <div className="flex items-center justify-center gap-3 p-4 border-t border-border/40">
                      <button
                        onClick={() => setTxnPage((p) => Math.max(1, p - 1))}
                        disabled={txnPage === 1}
                        className="px-3 py-1.5 text-xs bg-[hsl(var(--muted))] rounded-lg disabled:opacity-40"
                      >
                        Previous
                      </button>
                      <span className="text-xs text-muted-foreground">
                        {txnPage} / {txnPagination.total_pages}
                      </span>
                      <button
                        onClick={() => setTxnPage((p) => p + 1)}
                        disabled={txnPage === txnPagination.total_pages}
                        className="px-3 py-1.5 text-xs bg-[hsl(var(--muted))] rounded-lg disabled:opacity-40"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* ── Referral History tab ───────────────────────────────── */}
          {activeTab === "referrals" && (
            <div>
              {!referralHistoryData?.data?.length ? (
                <div className="text-center py-10 text-muted-foreground text-sm">
                  <Gift className="w-8 h-8 mx-auto mb-2 opacity-20" />
                  <p>No referrals yet</p>
                  <p className="text-xs mt-1">
                    Share your code to start earning
                  </p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[400px]">
                      <thead>
                        <tr className="border-b border-border/40">
                          <th className="text-left p-3 text-xs text-muted-foreground font-medium">
                            User
                          </th>
                          <th className="text-right p-3 text-xs text-muted-foreground font-medium">
                            Bonus
                          </th>
                          <th className="text-right p-3 text-xs text-muted-foreground font-medium">
                            Status
                          </th>
                          <th className="text-right p-3 text-xs text-muted-foreground font-medium hidden sm:table-cell">
                            When
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {referralHistoryData.data.map((ref) => (
                          <tr
                            key={ref.id}
                            className="border-b border-border/20 hover:bg-black/5"
                          >
                            <td className="p-3">
                              <p className="text-sm font-medium truncate max-w-[160px]">
                                {ref.referredUser?.full_name}
                              </p>
                              <p className="text-xs text-muted-foreground truncate max-w-[160px]">
                                @{ref.referredUser?.username}
                              </p>
                            </td>
                            <td className="p-3 text-right font-mono-num text-sm font-bold text-[hsl(var(--primary))] whitespace-nowrap">
                              +{ref.referrer_bonus}
                            </td>
                            <td className="p-3 text-right">
                              <span
                                className={`text-[10px] px-2 py-1 rounded-full font-medium whitespace-nowrap ${
                                  ref.status === "completed"
                                    ? "bg-green-100 text-green-700"
                                    : ref.status === "pending"
                                      ? "bg-yellow-100 text-yellow-700"
                                      : "bg-red-100 text-red-700"
                                }`}
                              >
                                {ref.status}
                              </span>
                            </td>
                            <td className="p-3 text-right text-xs text-muted-foreground whitespace-nowrap hidden sm:table-cell">
                              {ref.created_at
                                ? formatDistanceToNow(
                                    new Date(ref.created_at),
                                    { addSuffix: true },
                                  )
                                : ""}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {referralHistoryData.pagination?.total_pages > 1 && (
                    <div className="flex items-center justify-center gap-3 p-4">
                      <button
                        onClick={() =>
                          setReferralPage((p) => Math.max(1, p - 1))
                        }
                        disabled={referralPage === 1}
                        className="px-3 py-1.5 text-xs bg-[hsl(var(--muted))] rounded-lg disabled:opacity-40"
                      >
                        Previous
                      </button>
                      <span className="text-xs text-muted-foreground">
                        {referralPage} /{" "}
                        {referralHistoryData.pagination.total_pages}
                      </span>
                      <button
                        onClick={() => setReferralPage((p) => p + 1)}
                        disabled={
                          referralPage ===
                          referralHistoryData.pagination.total_pages
                        }
                        className="px-3 py-1.5 text-xs bg-[hsl(var(--muted))] rounded-lg disabled:opacity-40"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* ── Actions ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Support", onClick: () => navigate("/contact") },
            { label: "About", onClick: () => navigate("/about") },
            { label: "Privacy", onClick: () => navigate("/privacy") },
          ].map((a) => (
            <button
              key={a.label}
              onClick={a.onClick}
              className="bg-[hsl(var(--card))] rounded-2xl border border-border/80 p-4 text-center hover:bg-black/5 transition-colors"
            >
              <p className="text-sm font-medium">{a.label}</p>
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="bg-[hsl(var(--destructive))]/10 rounded-2xl border border-[hsl(var(--destructive))]/20 p-4 text-center hover:bg-[hsl(var(--destructive))]/20 transition-colors"
          >
            <LogOut className="w-5 h-5 mx-auto text-[hsl(var(--destructive))] mb-1" />
            <p className="text-sm font-medium text-[hsl(var(--destructive))]">
              Logout
            </p>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
