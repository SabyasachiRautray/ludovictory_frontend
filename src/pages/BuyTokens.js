import { useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/store/authSlice";
import {
  useGetTokenPackagesQuery,
  useGetAppConfigQuery,
  useSubmitTokenPurchaseMutation,
  useGetMyTokenPurchasesQuery,
} from "@/store/apiSlice";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  ShoppingBag,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronDown,
  ChevronUp,
  Coins,
  ArrowLeft,
  Calculator,
  Package,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const UPI_ID = import.meta.env.VITE_UPI_ID || "yourname@upi";
const UPI_NAME = import.meta.env.VITE_UPI_NAME || "Dycek";
const QR_IMAGE = "/qr.png";

const STATUS_CONFIG = {
  pending: {
    label: "Pending Verification",
    icon: Clock,
    color: "text-yellow-600",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
  },
  approved: {
    label: "Approved",
    icon: CheckCircle2,
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-200",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    color: "text-red-500",
    bg: "bg-red-50",
    border: "border-red-200",
  },
};

// ─── Purchase history row ─────────────────────────────────────────────────────
const PurchaseRow = ({ purchase }) => {
  const [expanded, setExpanded] = useState(false);
  const status = STATUS_CONFIG[purchase.status] || STATUS_CONFIG.pending;
  const StatusIcon = status.icon;

  return (
    <div className={`border rounded-xl overflow-hidden ${status.border}`}>
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-3 p-4 hover:bg-black/5 transition-colors text-left"
      >
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${status.bg}`}
        >
          <StatusIcon className={`w-4 h-4 ${status.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">
            {purchase.package?.label || `${purchase.tokens_purchased} Tokens`}
          </p>
          <p className="text-xs text-muted-foreground">
            {purchase.created_at
              ? formatDistanceToNow(new Date(purchase.created_at), {
                  addSuffix: true,
                })
              : ""}
          </p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <ShoppingBag className="w-3.5 h-3.5 text-[hsl(var(--accent))]" />
          <span className="font-mono-num text-sm font-bold text-[hsl(var(--accent))]">
            +{purchase.tokens_purchased}
          </span>
        </div>
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 ${status.bg} ${status.color}`}
        >
          {status.label}
        </span>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
        )}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-border/40 p-4 bg-[hsl(var(--muted))]/40 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white/70 rounded-lg p-2.5">
                  <p className="text-[10px] text-muted-foreground">
                    Amount Paid
                  </p>
                  <p className="font-mono-num font-bold text-sm">
                    ₹{Number(purchase.amount_paid).toFixed(2)}
                  </p>
                </div>
                <div className="bg-white/70 rounded-lg p-2.5">
                  <p className="text-[10px] text-muted-foreground">Tokens</p>
                  <p className="font-mono-num font-bold text-sm">
                    {purchase.tokens_purchased}
                  </p>
                </div>
                <div className="bg-white/70 rounded-lg p-2.5 col-span-2">
                  <p className="text-[10px] text-muted-foreground">
                    UTR Number
                  </p>
                  <p className="font-mono-num text-sm break-all">
                    {purchase.utr_number}
                  </p>
                </div>
              </div>
              {purchase.status === "rejected" && purchase.rejection_reason && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-2.5 text-xs text-red-600">
                  <p className="font-medium mb-0.5">Rejection reason:</p>
                  <p>{purchase.rejection_reason}</p>
                </div>
              )}
              {purchase.status === "approved" && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-2.5 text-xs text-green-700">
                  ✓ {purchase.tokens_purchased} shopping tokens credited to your
                  wallet
                </div>
              )}
              {purchase.status === "pending" && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2.5 text-xs text-yellow-700">
                  ⏳ Under review. Tokens credited once verified.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Main page ────────────────────────────────────────────────────────────────
const BuyTokens = () => {
  const sessionUser = useSelector(selectCurrentUser);

  const [activeTab, setActiveTab] = useState("buy");
  const [buyMode, setBuyMode] = useState("calculator"); // 'calculator' | 'packages'
  const [step, setStep] = useState(1);

  // Calculator state
  const [calcInput, setCalcInput] = useState("");
  const [calcMode, setCalcMode] = useState("rupees"); // 'rupees' | 'tokens'
  const [customAmount, setCustomAmount] = useState(null); // { tokens, price }

  // Package selection state
  const [selectedPackage, setSelectedPackage] = useState(null);

  // Shared payment state
  const [utrNumber, setUtrNumber] = useState("");
  const [purchasePage, setPurchasePage] = useState(1);

  const { data: packagesData } = useGetTokenPackagesQuery();
  const { data: configData } = useGetAppConfigQuery();
  const { data: purchasesData, isLoading: purchasesLoading } =
    useGetMyTokenPurchasesQuery(
      { page: purchasePage, limit: 10 },
      { skip: activeTab !== "history" },
    );

  const [submitPurchase, { isLoading: submitting }] =
    useSubmitTokenPurchaseMutation();

  const packages = packagesData?.data || [];
  const config = configData?.data || {};
  const purchases = purchasesData?.data || [];
  const purchasePagination = purchasesData?.pagination || {};

  // Token rate from config — default 1000
  const TOKEN_RATE = config.token_rate || 1000;
  const MINIMUM_PURCHASE = 10;

  // ── Calculator logic ───────────────────────────────────────────────────────
  const calcResult = (() => {
    const val = parseFloat(calcInput);
    if (!calcInput || isNaN(val) || val <= 0) return null;
    if (calcMode === "rupees") {
      return { tokens: Math.floor(val * TOKEN_RATE), price: val };
    } else {
      return { tokens: Math.floor(val), price: val / TOKEN_RATE };
    }
  })();

  const handleCalcInputChange = (e) => {
    // Only allow numbers and decimal
    const v = e.target.value.replace(/[^0-9.]/g, "");
    setCalcInput(v);
  };

  const handleProceedWithCalc = () => {
    if (!calcResult) return;

    if (calcResult.price < MINIMUM_PURCHASE) {
      toast.error(`Minimum purchase amount is ₹${MINIMUM_PURCHASE}`);
      return;
    }

    setCustomAmount(calcResult);
    setStep(2);
  };

  const handleSelectPackage = (pkg) => {
    setSelectedPackage(pkg);
    setCustomAmount(null);
    setStep(2);
  };

  // What we're actually purchasing
  const purchase = customAmount
    ? {
        tokens: customAmount.tokens,
        price: customAmount.price,
        label: "Custom Amount",
      }
    : selectedPackage
      ? {
          tokens: selectedPackage.tokens,
          price: Number(selectedPackage.price),
          label: selectedPackage.label,
        }
      : null;

  const handleSubmit = async () => {
    const utr = utrNumber.trim();
    if (utr.length < 6) {
      toast.error("Please enter a valid UTR / transaction number");
      return;
    }
    if (!purchase) return;

    // For custom amounts, we submit with package_id = null and custom tokens
    // Backend needs to handle this — see note below
    try {
      const body = selectedPackage
        ? { package_id: selectedPackage.id, utr_number: utr }
        : { tokens: purchase.tokens, amount: purchase.price, utr_number: utr };

      await submitPurchase(body).unwrap();
      toast.success("Purchase request submitted! Admin will verify shortly.");
      setStep(1);
      setSelectedPackage(null);
      setCustomAmount(null);
      setCalcInput("");
      setUtrNumber("");
      setActiveTab("history");
    } catch (err) {
      toast.error(err.data?.message || "Submission failed");
    }
  };

  const handleBack = () => {
    setStep(1);
    setSelectedPackage(null);
    setCustomAmount(null);
    setUtrNumber("");
  };

  const upiDeepLink = purchase
    ? `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${purchase.price.toFixed(2)}&cu=INR&tn=${encodeURIComponent(`Dycek ${purchase.label}`)}`
    : "#";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-16 pb-20 md:pb-6"
    >
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="mb-6">
          <h1 className="font-heading text-2xl sm:text-3xl font-bold">
            Buy Shopping Tokens
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Purchase shopping tokens to redeem products in the bazaar
          </p>
          {config.token_rate && (
            <div className="inline-flex items-center gap-1.5 mt-2 bg-[hsl(var(--accent))]/10 text-[hsl(var(--accent))] px-3 py-1 rounded-full text-xs font-medium">
              <Coins className="w-3 h-3" />
              ₹1 = {TOKEN_RATE.toLocaleString()} shopping tokens
            </div>
          )}
        </div>

        {/* ── Tabs ────────────────────────────────────────────────────── */}
        <div className="flex gap-1 bg-[hsl(var(--muted))] p-1 rounded-xl mb-6 w-fit">
          {[
            { key: "buy", label: "Buy Tokens" },
            { key: "history", label: "My Purchases" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setStep(1);
              }}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? "bg-white shadow-sm text-[hsl(var(--primary))]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ══ BUY TAB ════════════════════════════════════════════════════ */}
        {activeTab === "buy" && (
          <>
            {/* ── Step 1: Choose method ─────────────────────────────── */}
            {step === 1 && (
              <div className="space-y-5">
                {/* Buy mode toggle */}
                <div className="flex gap-1 bg-[hsl(var(--muted))] p-1 rounded-xl w-fit">
                  {[
                    {
                      key: "calculator",
                      label: "Calculator",
                      icon: Calculator,
                    },
                    { key: "packages", label: "Packages", icon: Package },
                  ].map((m) => {
                    const Icon = m.icon;
                    return (
                      <button
                        key={m.key}
                        onClick={() => setBuyMode(m.key)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          buyMode === m.key
                            ? "bg-white shadow-sm text-[hsl(var(--primary))]"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {m.label}
                      </button>
                    );
                  })}
                </div>

                {/* ── Calculator mode ──────────────────────────────────── */}
                {buyMode === "calculator" && (
                  <div className="bg-white/90 rounded-2xl border border-border/80 shadow-[0_14px_34px_rgba(31,38,84,0.08)] p-5 space-y-4">
                    <h3 className="font-heading font-bold">Token Calculator</h3>
                    <p className="text-xs text-muted-foreground">
                      Current rate:{" "}
                      <span className="font-bold text-foreground">
                        ₹1 = {TOKEN_RATE.toLocaleString()} tokens
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Minimum purchase amount:
                      <span className="font-bold text-foreground">
                        ₹{MINIMUM_PURCHASE}
                      </span>
                    </p>

                    {/* Input mode toggle */}
                    <div className="flex gap-1 bg-[hsl(var(--muted))] p-1 rounded-xl">
                      {[
                        { key: "rupees", label: "Enter ₹ Amount" },
                        { key: "tokens", label: "Enter Token Count" },
                      ].map((m) => (
                        <button
                          key={m.key}
                          onClick={() => {
                            setCalcMode(m.key);
                            setCalcInput("");
                          }}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            calcMode === m.key
                              ? "bg-white shadow-sm text-[hsl(var(--primary))]"
                              : "text-muted-foreground"
                          }`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>

                    {/* Input */}
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-sm">
                        {calcMode === "rupees" ? (
                          "₹"
                        ) : (
                          <ShoppingBag className="w-4 h-4" />
                        )}
                      </div>
                      <input
                        value={calcInput}
                        onChange={handleCalcInputChange}
                        placeholder={calcMode === "rupees" ? "0.00" : "0"}
                        className="w-full pl-8 pr-4 py-3 bg-[hsl(var(--muted))] border border-border/80 rounded-xl text-lg font-mono-num font-bold focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] transition-all"
                      />
                    </div>

                    {/* Result display */}
                    <AnimatePresence mode="wait">
                      {calcResult ? (
                        <motion.div
                          key="result"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          className="bg-[hsl(var(--accent))]/5 border border-[hsl(var(--accent))]/20 rounded-xl p-4"
                        >
                          {calcMode === "rupees" ? (
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  You pay
                                </p>
                                <p className="font-mono-num text-2xl font-bold">
                                  ₹{calcResult.price.toFixed(2)}
                                </p>
                              </div>
                              <div className="text-2xl text-muted-foreground">
                                →
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-muted-foreground">
                                  You get
                                </p>
                                <div className="flex items-center gap-1.5 justify-end">
                                  <ShoppingBag className="w-5 h-5 text-[hsl(var(--accent))]" />
                                  <p className="font-mono-num text-2xl font-bold text-[hsl(var(--accent))]">
                                    {calcResult.tokens.toLocaleString()}
                                  </p>
                                </div>
                                <p className="text-[10px] text-muted-foreground">
                                  shopping tokens
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  You want
                                </p>
                                <div className="flex items-center gap-1.5">
                                  <ShoppingBag className="w-5 h-5 text-[hsl(var(--accent))]" />
                                  <p className="font-mono-num text-2xl font-bold text-[hsl(var(--accent))]">
                                    {calcResult.tokens.toLocaleString()}
                                  </p>
                                </div>
                                <p className="text-[10px] text-muted-foreground">
                                  shopping tokens
                                </p>
                              </div>
                              <div className="text-2xl text-muted-foreground">
                                →
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-muted-foreground">
                                  You pay
                                </p>
                                <p className="font-mono-num text-2xl font-bold">
                                  ₹{calcResult.price.toFixed(2)}
                                </p>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      ) : (
                        <motion.div
                          key="placeholder"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-center py-4 text-muted-foreground text-sm"
                        >
                          Enter an amount above to see how many tokens you get
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {calcResult && calcResult.price < MINIMUM_PURCHASE && (
                      <p className="text-sm text-red-500 mt-2">
                        Minimum purchase amount is ₹{MINIMUM_PURCHASE}
                      </p>
                    )}

                    {/* Quick amount buttons */}
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">
                        Quick amounts
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {calcMode === "rupees"
                          ? [10, 20, 50, 100, 200, 500].map((amt) => (
                              <button
                                key={amt}
                                onClick={() => setCalcInput(String(amt))}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                                  calcInput === String(amt)
                                    ? "bg-[hsl(var(--primary))] text-white border-[hsl(var(--primary))]"
                                    : "bg-[hsl(var(--muted))] border-border/60 hover:border-[hsl(var(--primary))]/40"
                                }`}
                              >
                                ₹{amt}
                              </button>
                            ))
                          : [1000, 5000, 10000, 50000, 100000].map((t) => (
                              <button
                                key={t}
                                onClick={() => setCalcInput(String(t))}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                                  calcInput === String(t)
                                    ? "bg-[hsl(var(--primary))] text-white border-[hsl(var(--primary))]"
                                    : "bg-[hsl(var(--muted))] border-border/60 hover:border-[hsl(var(--primary))]/40"
                                }`}
                              >
                                {t.toLocaleString()}
                              </button>
                            ))}
                      </div>
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={handleProceedWithCalc}
                      disabled={
                        !calcResult || calcResult.price < MINIMUM_PURCHASE
                      }
                      className="w-full py-3 bg-[hsl(var(--primary))] text-white rounded-xl font-bold text-sm hover:opacity-90 disabled:opacity-40 transition-opacity"
                    >
                      Proceed to Pay ₹
                      {calcResult ? calcResult.price.toFixed(2) : "—"}
                    </motion.button>
                  </div>
                )}

                {/* ── Packages mode ─────────────────────────────────────── */}
                {buyMode === "packages" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {packages.length === 0 ? (
                      <div className="col-span-2 text-center py-16 text-muted-foreground">
                        <Package className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>No packages available</p>
                      </div>
                    ) : (
                      packages.map((pkg, i) => (
                        <motion.button
                          key={pkg.id}
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.06 }}
                          whileHover={{ y: -3 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => handleSelectPackage(pkg)}
                          className="bg-white/90 rounded-2xl border border-border/80 p-5 text-left shadow-[0_14px_34px_rgba(31,38,84,0.08)] hover:border-[rgba(197,143,34,0.42)] hover:shadow-[0_0_0_1px_rgba(197,143,34,0.22),0_22px_44px_rgba(31,38,84,0.13)] transition-all"
                        >
                          <p className="font-heading font-bold text-base mb-3">
                            {pkg.label}
                          </p>
                          <div className="flex items-center gap-2 mb-4">
                            <ShoppingBag className="w-5 h-5 text-[hsl(var(--accent))]" />
                            <span className="font-mono-num text-3xl font-bold text-[hsl(var(--accent))]">
                              {pkg.tokens.toLocaleString()}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              tokens
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Pay
                              </p>
                              <p className="font-mono-num text-2xl font-bold">
                                ₹{Number(pkg.price).toFixed(0)}
                              </p>
                            </div>
                            <div className="px-4 py-2 bg-[hsl(var(--primary))] text-white rounded-xl text-sm font-bold">
                              Buy Now
                            </div>
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-3">
                            ≈ {(pkg.tokens / Number(pkg.price)).toFixed(0)}{" "}
                            tokens per ₹1
                          </p>
                        </motion.button>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ── Step 2: QR + UTR ──────────────────────────────────── */}
            {step === 2 && purchase && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <button
                  onClick={handleBack}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>

                {/* Summary */}
                <div className="bg-[hsl(var(--primary))]/5 border border-[hsl(var(--primary))]/20 rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <p className="font-heading font-bold">{purchase.label}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <ShoppingBag className="w-4 h-4 text-[hsl(var(--accent))]" />
                      <span className="font-mono-num font-bold text-[hsl(var(--accent))]">
                        {purchase.tokens.toLocaleString()} tokens
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      Amount to pay
                    </p>
                    <p className="font-mono-num text-3xl font-bold">
                      ₹{purchase.price.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="bg-white/90 rounded-2xl border border-border/80 shadow-[0_14px_34px_rgba(31,38,84,0.08)] p-5 space-y-5">
                  {/* Step 1: QR */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-full bg-[hsl(var(--primary))] text-white flex items-center justify-center text-xs font-bold shrink-0">
                        1
                      </div>
                      <p className="font-medium text-sm">
                        Scan QR & pay ₹{purchase.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                      <img
                        src={QR_IMAGE}
                        alt="Payment QR"
                        className="w-52 h-52 rounded-xl border-2 border-border/60 object-contain bg-white p-2"
                      />
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">UPI ID</p>
                        <p className="font-mono-num font-bold text-sm">
                          {UPI_ID}
                        </p>
                      </div>
                      {/* <a
                        href={upiDeepLink}
                        className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--muted))] rounded-xl text-sm font-medium hover:bg-black/10 transition-colors"
                      >
                        Open in UPI App
                      </a> */}
                    </div>
                  </div>

                  <div className="border-t border-border/40" />

                  {/* Step 2: UTR */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-full bg-[hsl(var(--primary))] text-white flex items-center justify-center text-xs font-bold shrink-0">
                        2
                      </div>
                      <p className="font-medium text-sm">
                        Enter UTR / Transaction number
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">
                      Find the 12-digit UTR in your UPI app after payment and
                      enter it below.
                    </p>
                    <input
                      value={utrNumber}
                      onChange={(e) =>
                        setUtrNumber(e.target.value.replace(/\s/g, ""))
                      }
                      placeholder="e.g. 424318765432"
                      maxLength={50}
                      className="w-full bg-[hsl(var(--muted))] border border-border/80 rounded-xl px-4 py-3 text-sm font-mono-num tracking-wider focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] transition-all"
                    />
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {utrNumber.length} / 50
                    </p>
                  </div>

                  <div className="border-t border-border/40" />

                  {/* Step 3: Submit */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-full bg-[hsl(var(--primary))] text-white flex items-center justify-center text-xs font-bold shrink-0">
                        3
                      </div>
                      <p className="font-medium text-sm">
                        Submit for verification
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">
                      Admin will verify and credit{" "}
                      {purchase.tokens.toLocaleString()} shopping tokens to your
                      wallet.
                    </p>
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={handleSubmit}
                      disabled={submitting || utrNumber.trim().length < 6}
                      className="w-full py-3 bg-[hsl(var(--primary))] text-white rounded-xl font-bold text-sm hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />{" "}
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Coins className="w-4 h-4" /> Submit Purchase Request
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-xs text-yellow-800">
                  ⚠️ Make sure the UTR number is correct. Wrong UTRs will be
                  rejected.
                </div>
              </motion.div>
            )}
          </>
        )}

        {/* ══ HISTORY TAB ════════════════════════════════════════════════ */}
        {activeTab === "history" && (
          <>
            {purchasesLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-[hsl(var(--accent))] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : purchases.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <Coins className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p className="font-medium">No purchases yet</p>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setActiveTab("buy")}
                  className="mt-4 px-4 py-2 bg-[hsl(var(--primary))] text-white rounded-xl text-sm font-bold hover:opacity-90"
                >
                  Buy Tokens
                </motion.button>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {purchases.map((p) => (
                    <PurchaseRow key={p.id} purchase={p} />
                  ))}
                </div>
                {purchasePagination.total_pages > 1 && (
                  <div className="flex items-center justify-center gap-3 mt-6">
                    <button
                      onClick={() => setPurchasePage((p) => Math.max(1, p - 1))}
                      disabled={purchasePage === 1}
                      className="px-4 py-2 bg-white/90 border border-border/80 rounded-xl text-sm font-medium disabled:opacity-40"
                    >
                      Previous
                    </button>
                    <span className="text-sm text-muted-foreground">
                      {purchasePage} / {purchasePagination.total_pages}
                    </span>
                    <button
                      onClick={() => setPurchasePage((p) => p + 1)}
                      disabled={purchasePage === purchasePagination.total_pages}
                      className="px-4 py-2 bg-white/90 border border-border/80 rounded-xl text-sm font-medium disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

export default BuyTokens;
