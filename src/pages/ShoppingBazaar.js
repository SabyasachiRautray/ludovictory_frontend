import { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  useGetProductsQuery,
  useRedeemProductMutation,
  useGetMeQuery,
  useGetMyOrdersQuery,
} from '@/store/apiSlice';
import { selectCurrentUser } from '@/store/authSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  ShoppingBag, Coins, PackageCheck, Sparkles,
  Search, ChevronDown, ChevronUp, Clock,
  CheckCircle2, XCircle, Loader2, Package,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

// ─── Order status config ──────────────────────────────────────────────────────
const STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    icon: Clock,
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
  },
  processing: {
    label: 'Processing',
    icon: Loader2,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
  },
  delivered: {
    label: 'Delivered',
    icon: CheckCircle2,
    color: 'text-green-600',
    bg: 'bg-green-50',
    border: 'border-green-200',
  },
  cancelled: {
    label: 'Cancelled',
    icon: XCircle,
    color: 'text-red-500',
    bg: 'bg-red-50',
    border: 'border-red-200',
  },
};

// ─── Single order row with accordion ─────────────────────────────────────────
const OrderRow = ({ order }) => {
  const [expanded, setExpanded] = useState(false);
  const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
  const StatusIcon = status.icon;

  return (
    <div className={`border rounded-xl overflow-hidden transition-all ${status.border}`}>
      {/* ── Summary row (always visible) ──────────────────────────── */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-3 p-4 hover:bg-black/5 transition-colors text-left"
      >
        {/* Product image thumbnail */}
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-[hsl(var(--muted))] shrink-0">
          {order.product?.image_url ? (
            <img
              src={order.product.image_url}
              alt={order.product_name_snapshot}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-5 h-5 opacity-30" />
            </div>
          )}
        </div>

        {/* Name + date */}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">
            {order.product_name_snapshot}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Order #{order.id} •{' '}
            {order.created_at
              ? formatDistanceToNow(new Date(order.created_at), { addSuffix: true })
              : ''}
          </p>
        </div>

        {/* Status badge */}
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ${status.bg} ${status.color}`}>
          <StatusIcon className={`w-3 h-3 ${order.status === 'processing' ? 'animate-spin' : ''}`} />
          {status.label}
        </div>

        {/* Tokens spent */}
        <div className="flex items-center gap-1 shrink-0 ml-2">
          <ShoppingBag className="w-3.5 h-3.5 text-[hsl(var(--accent))]" />
          <span className="font-mono-num text-sm font-bold text-[hsl(var(--accent))]">
            -{order.tokens_spent}
          </span>
        </div>

        {/* Chevron */}
        <div className="shrink-0 ml-1 text-muted-foreground">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* ── Expanded details ────────────────────────────────────────── */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-border/40 p-4 bg-[hsl(var(--muted))]/40 space-y-3">

              {/* Product details */}
              <div className="flex gap-3">
                {/* Larger image */}
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-[hsl(var(--muted))] shrink-0">
                  {order.product?.image_url ? (
                    <img
                      src={order.product.image_url}
                      alt={order.product_name_snapshot}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-8 h-8 opacity-20" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <p className="font-heading font-bold text-sm">
                    {order.product_name_snapshot}
                  </p>
                  {order.product?.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {order.product.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Order info grid */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white/70 rounded-lg p-2.5">
                  <p className="text-[10px] text-muted-foreground">Order ID</p>
                  <p className="font-mono-num text-sm font-bold">#{order.id}</p>
                </div>
                <div className="bg-white/70 rounded-lg p-2.5">
                  <p className="text-[10px] text-muted-foreground">Tokens Spent</p>
                  <div className="flex items-center gap-1">
                    <ShoppingBag className="w-3 h-3 text-[hsl(var(--accent))]" />
                    <p className="font-mono-num text-sm font-bold">{order.tokens_spent}</p>
                  </div>
                </div>
                <div className="bg-white/70 rounded-lg p-2.5">
                  <p className="text-[10px] text-muted-foreground">Status</p>
                  <div className={`flex items-center gap-1 text-sm font-medium ${status.color}`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    {status.label}
                  </div>
                </div>
                <div className="bg-white/70 rounded-lg p-2.5">
                  <p className="text-[10px] text-muted-foreground">Placed</p>
                  <p className="text-sm">
                    {order.created_at
                      ? new Date(order.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })
                      : '—'}
                  </p>
                </div>
              </div>

              {/* Admin note (if any) */}
              {order.admin_note && (
                <div className="bg-white/70 rounded-lg p-2.5">
                  <p className="text-[10px] text-muted-foreground mb-1">Note from admin</p>
                  <p className="text-sm">{order.admin_note}</p>
                </div>
              )}

              {/* Status timeline */}
              <div className="flex items-center gap-0">
                {['pending', 'processing', 'delivered'].map((s, i) => {
                  const reached =
                    order.status === 'cancelled'
                      ? false
                      : ['pending', 'processing', 'delivered'].indexOf(order.status) >= i;
                  return (
                    <div key={s} className="flex items-center flex-1">
                      <div className={`w-2.5 h-2.5 rounded-full shrink-0 border-2 ${
                        reached
                          ? 'bg-[hsl(var(--primary))] border-[hsl(var(--primary))]'
                          : 'bg-white border-border'
                      }`} />
                      {i < 2 && (
                        <div className={`flex-1 h-0.5 ${
                          reached && ['pending', 'processing', 'delivered'].indexOf(order.status) > i
                            ? 'bg-[hsl(var(--primary))]'
                            : 'bg-border'
                        }`} />
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between">
                {['Ordered', 'Processing', 'Delivered'].map((label) => (
                  <p key={label} className="text-[10px] text-muted-foreground">{label}</p>
                ))}
              </div>

              {/* Cancelled note */}
              {order.status === 'cancelled' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-2.5 text-xs text-red-600">
                  This order was cancelled. Your shopping tokens have been refunded.
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
const ShoppingBazaar = () => {
  const sessionUser = useSelector(selectCurrentUser);

  const [activeTab, setActiveTab] = useState('products');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [redeemingId, setRedeemingId] = useState(null);
  const [lastResult, setLastResult] = useState(null);

  // Order history state
  const [orderPage, setOrderPage] = useState(1);
  const [orderStatusFilter, setOrderStatusFilter] = useState('');

  const { data: productsData, isLoading: productsLoading } = useGetProductsQuery(
    { page, limit: 9, search, sort: 'created_at', order: 'DESC' },
    { skip: activeTab !== 'products' }
  );

  const { data: meData } = useGetMeQuery(undefined, { skip: !sessionUser });

  const { data: ordersData, isLoading: ordersLoading } = useGetMyOrdersQuery(
    {
      page: orderPage,
      limit: 10,
      ...(orderStatusFilter && { status: orderStatusFilter }),
    },
    { skip: activeTab !== 'orders' }
  );

  const [redeemProduct] = useRedeemProductMutation();

  const products = productsData?.data || [];
  const pagination = productsData?.pagination || {};
  const orders = ordersData?.data || [];
  const orderPagination = ordersData?.pagination || {};

  const wallet = meData?.data?.wallet || null;
  const shoppingBalance = wallet?.shopping_token_balance ?? sessionUser?.shopping_token_balance ?? 0;

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput.trim());
    setPage(1);
  };

  const handleRedeem = async (product) => {
    if (shoppingBalance < product.token_cost) {
      toast.error('Not enough shopping tokens');
      return;
    }
    setRedeemingId(product.id);
    try {
      const res = await redeemProduct({ product_id: product.id }).unwrap();
      setLastResult({
        productName: res.data.product,
        tokensSpent: res.data.tokens_spent,
        orderId: res.data.order_id,
      });
      toast.success(`Order placed for ${res.data.product}!`);
    } catch (err) {
      toast.error(err.data?.message || 'Redemption failed');
    } finally {
      setRedeemingId(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-16 pb-20 md:pb-6"
    >
      <div className="max-w-6xl mx-auto px-4 py-6">

        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold">Shopping Bazaar</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Redeem your shopping tokens for amazing products
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[hsl(var(--secondary))] rounded-full px-4 py-2 border border-border/80 neon-glow-amber self-start sm:self-auto">
            <ShoppingBag className="w-4 h-4 text-[hsl(var(--accent))]" />
            <div>
              <p className="text-[10px] text-muted-foreground leading-none">Shopping Tokens</p>
              <p className="font-mono-num font-bold text-sm">
                {shoppingBalance.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* ── Tabs ────────────────────────────────────────────────────── */}
        <div className="flex gap-1 bg-[hsl(var(--muted))] p-1 rounded-xl mb-6 w-fit">
          {[
            { key: 'products', label: 'Products' },
            { key: 'orders', label: 'My Orders' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-white shadow-sm text-[hsl(var(--primary))]'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
              {tab.key === 'orders' && orderPagination.total > 0 && (
                <span className="ml-1.5 text-[10px] bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] px-1.5 py-0.5 rounded-full font-bold">
                  {orderPagination.total}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ══ PRODUCTS TAB ════════════════════════════════════════════════ */}
        {activeTab === 'products' && (
          <>
            {/* Last redemption banner */}
            <AnimatePresence>
              {lastResult && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 p-4 rounded-2xl bg-[hsl(var(--primary))]/10 border border-[hsl(var(--primary))]/20 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-[hsl(var(--accent))]" />
                    <div>
                      <p className="font-bold text-sm">{lastResult.productName}</p>
                      <p className="text-xs text-muted-foreground">
                        Order #{lastResult.orderId} placed —{' '}
                        <button
                          onClick={() => setActiveTab('orders')}
                          className="text-[hsl(var(--primary))] hover:underline"
                        >
                          View in My Orders →
                        </button>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Coins className="w-4 h-4 text-[hsl(var(--accent))]" />
                    <span className="font-mono-num font-bold text-[hsl(var(--accent))]">
                      -{lastResult.tokensSpent}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-2 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                <input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-9 pr-4 py-2.5 bg-white/90 border border-border/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] transition-all"
                />
              </div>
              <motion.button
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="px-4 py-2.5 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-xl text-sm font-bold hover:opacity-90 transition-opacity"
              >
                Search
              </motion.button>
              {search && (
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={() => { setSearch(''); setSearchInput(''); setPage(1); }}
                  className="px-4 py-2.5 bg-[hsl(var(--muted))] rounded-xl text-sm font-medium hover:opacity-90"
                >
                  Clear
                </motion.button>
              )}
            </form>

            {/* Product grid */}
            {productsLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-[hsl(var(--accent))] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p className="font-medium">No products found</p>
                {search && <p className="text-sm mt-1">Try a different search term</p>}
              </div>
            ) : (
              <div
                data-testid="bazaar-grid"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {products.map((product, i) => {
                  const canAfford = shoppingBalance >= product.token_cost;
                  const isRedeeming = redeemingId === product.id;
                  const outOfStock = product.stock === 0;

                  return (
                    <motion.div
                      key={product.id}
                      data-testid="product-redeem-card"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ y: -3 }}
                      className={`bg-white/90 rounded-2xl border shadow-[0_18px_45px_rgba(31,38,84,0.10)] overflow-hidden transition-all ${
                        canAfford && !outOfStock
                          ? 'border-border/80 hover:border-[rgba(197,143,34,0.42)]'
                          : 'border-border/40 opacity-70'
                      }`}
                    >
                      <div className="h-40 overflow-hidden relative bg-[hsl(var(--muted))]">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="w-12 h-12 opacity-20" />
                          </div>
                        )}
                        {outOfStock && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <span className="text-white text-xs font-bold bg-black/60 px-3 py-1 rounded-full">
                              Out of Stock
                            </span>
                          </div>
                        )}
                        {!outOfStock && product.stock <= 5 && (
                          <div className="absolute top-2 right-2">
                            <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-600">
                              Only {product.stock} left
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="p-4">
                        <h3 className="font-heading font-bold truncate">{product.name}</h3>
                        {product.description && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {product.description}
                          </p>
                        )}
                        <div className="flex items-center justify-between mt-3">
                          <div>
                            <div className="flex items-center gap-1">
                              <ShoppingBag className="w-3.5 h-3.5 text-[hsl(var(--accent))]" />
                              <span className="font-mono-num font-bold text-sm">
                                {product.token_cost.toLocaleString()}
                              </span>
                              <span className="text-[10px] text-muted-foreground">tokens</span>
                            </div>
                            {!canAfford && !outOfStock && (
                              <p className="text-[10px] text-red-400 mt-0.5">
                                Need {(product.token_cost - shoppingBalance).toLocaleString()} more
                              </p>
                            )}
                          </div>
                          <motion.button
                            data-testid="bazaar-redeem-button"
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleRedeem(product)}
                            disabled={isRedeeming || !canAfford || outOfStock}
                            className="flex items-center gap-1.5 px-4 py-2 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-xl text-sm font-bold hover:opacity-90 disabled:opacity-50 transition-opacity"
                          >
                            {isRedeeming ? (
                              <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                            ) : (
                              <PackageCheck className="w-3.5 h-3.5" />
                            )}
                            {isRedeeming ? 'Redeeming...' : 'Redeem'}
                          </motion.button>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-2">
                          {product.stock} in stock
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Products pagination */}
            {pagination.total_pages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-8">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-white/90 border border-border/80 rounded-xl text-sm font-medium disabled:opacity-40 hover:bg-[hsl(var(--muted))] transition-colors"
                >
                  Previous
                </motion.button>
                <span className="text-sm text-muted-foreground">
                  Page {pagination.page} of {pagination.total_pages}
                </span>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setPage((p) => Math.min(pagination.total_pages, p + 1))}
                  disabled={page === pagination.total_pages}
                  className="px-4 py-2 bg-white/90 border border-border/80 rounded-xl text-sm font-medium disabled:opacity-40 hover:bg-[hsl(var(--muted))] transition-colors"
                >
                  Next
                </motion.button>
              </div>
            )}
          </>
        )}

        {/* ══ ORDERS TAB ══════════════════════════════════════════════════ */}
        {activeTab === 'orders' && (
          <>
            {/* Status filter pills */}
            <div className="flex gap-2 mb-5 flex-wrap">
              {[
                { label: 'All', value: '' },
                { label: 'Pending', value: 'pending' },
                { label: 'Processing', value: 'processing' },
                { label: 'Delivered', value: 'delivered' },
                { label: 'Cancelled', value: 'cancelled' },
              ].map((f) => (
                <button
                  key={f.value}
                  onClick={() => { setOrderStatusFilter(f.value); setOrderPage(1); }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    orderStatusFilter === f.value
                      ? 'bg-[hsl(var(--primary))] text-white'
                      : 'bg-[hsl(var(--muted))] text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {ordersLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-[hsl(var(--accent))] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <Package className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p className="font-medium">No orders yet</p>
                <p className="text-sm mt-1">
                  Redeem a product to see your orders here
                </p>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setActiveTab('products')}
                  className="mt-4 px-4 py-2 bg-[hsl(var(--primary))] text-white rounded-xl text-sm font-bold hover:opacity-90"
                >
                  Browse Products
                </motion.button>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <OrderRow key={order.id} order={order} />
                ))}
              </div>
            )}

            {/* Orders pagination */}
            {orderPagination.total_pages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-6">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setOrderPage((p) => Math.max(1, p - 1))}
                  disabled={orderPage === 1}
                  className="px-4 py-2 bg-white/90 border border-border/80 rounded-xl text-sm font-medium disabled:opacity-40 hover:bg-[hsl(var(--muted))] transition-colors"
                >
                  Previous
                </motion.button>
                <span className="text-sm text-muted-foreground">
                  Page {orderPage} of {orderPagination.total_pages}
                </span>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setOrderPage((p) => Math.min(orderPagination.total_pages, p + 1))}
                  disabled={orderPage === orderPagination.total_pages}
                  className="px-4 py-2 bg-white/90 border border-border/80 rounded-xl text-sm font-medium disabled:opacity-40 hover:bg-[hsl(var(--muted))] transition-colors"
                >
                  Next
                </motion.button>
              </div>
            )}
          </>
        )}

      </div>
    </motion.div>
  );
};

export default ShoppingBazaar;