// import { useGetPrizesQuery, useBuyPrizeMutation, useGetWalletQuery } from '@/store/apiSlice';
// import { useDispatch } from 'react-redux';
// import { updateWalletBalance } from '@/store/authSlice';
// import { motion, AnimatePresence } from 'framer-motion';
// import { toast } from 'sonner';
// import { Coins, Trophy, Sparkles } from 'lucide-react';
// import { useState } from 'react';

// const rarityColors = {
//   5: { label: 'Common', border: 'border-[hsl(var(--border))]', badge: 'bg-[hsl(var(--muted))]' },
//   10: { label: 'Common', border: 'border-[hsl(var(--border))]', badge: 'bg-[hsl(var(--muted))]' },
//   25: { label: 'Uncommon', border: 'border-[hsl(var(--primary))]/30', badge: 'bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))]' },
//   50: { label: 'Rare', border: 'border-[hsl(var(--primary))]/50', badge: 'bg-[hsl(var(--primary))]/20 text-[hsl(var(--primary))]' },
//   100: { label: 'Epic', border: 'border-[hsl(var(--accent))]/50', badge: 'bg-[hsl(var(--accent))]/10 text-[hsl(var(--accent))]' },
//   200: { label: 'Legendary', border: 'border-[hsl(var(--accent))]/70', badge: 'bg-[hsl(var(--accent))]/20 text-[hsl(var(--accent))]' },
// };

// const getRarity = (cost) => {
//   if (cost >= 200) return rarityColors[200];
//   if (cost >= 100) return rarityColors[100];
//   if (cost >= 50) return rarityColors[50];
//   if (cost >= 25) return rarityColors[25];
//   return rarityColors[5];
// };

// const PrizeHouse = () => {
//   const { data: prizesData, isLoading } = useGetPrizesQuery();
//   const { data: walletData } = useGetWalletQuery(undefined, { pollingInterval: 15000 });
//   const [buyPrize] = useBuyPrizeMutation();
//   const dispatch = useDispatch();
//   const [buyingId, setBuyingId] = useState(null);
//   const [lastResult, setLastResult] = useState(null);

//   const prizes = prizesData?.data || [];
//   const balance = walletData?.data?.balance ?? 0;

//   const handleBuy = async (prize) => {
//     if (balance < prize.token_cost) {
//       toast.error('Insufficient tokens');
//       return;
//     }
//     setBuyingId(prize.id);
//     try {
//       const res = await buyPrize(prize.id).unwrap();
//       dispatch(updateWalletBalance(res.data.wallet_balance));
//       setLastResult({ prize: prize.name, tokensWon: res.data.tokens_won, tokensSpent: res.data.tokens_spent });
//       toast.success(`You won ${res.data.tokens_won} tokens from ${prize.name}!`);
//     } catch (err) {
//       toast.error(err.data?.detail || 'Failed to buy prize');
//     } finally {
//       setBuyingId(null);
//     }
//   };

//   return (
//     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen pt-16 pb-20 md:pb-6">
//       <div className="max-w-6xl mx-auto px-4 py-6">
//         <div className="flex items-center justify-between mb-6">
//           <div>
//             <h1 className="font-heading text-2xl sm:text-3xl font-bold">Prize House</h1>
//             <p className="text-sm text-muted-foreground mt-1">Buy prizes with tokens, win big rewards!</p>
//           </div>
//           <div className="flex items-center gap-2 bg-[hsl(var(--secondary))] rounded-full px-4 py-2 border border-border/80">
//             <Coins className="w-4 h-4 text-[hsl(var(--accent))]" />
//             <span className="font-mono-num font-bold">{balance.toLocaleString()}</span>
//           </div>
//         </div>

//         {/* Result Banner */}
//         <AnimatePresence>
//           {lastResult && (
//             <motion.div
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -10 }}
//               className="mb-6 p-4 rounded-2xl bg-[hsl(var(--primary))]/10 border border-[hsl(var(--primary))]/20 flex items-center justify-between"
//             >
//               <div className="flex items-center gap-3">
//                 <Sparkles className="w-6 h-6 text-[hsl(var(--accent))]" />
//                 <div>
//                   <p className="font-bold">{lastResult.prize}</p>
//                   <p className="text-sm text-muted-foreground">Spent {lastResult.tokensSpent} tokens</p>
//                 </div>
//               </div>
//               <div className="text-right">
//                 <p className="font-mono-num text-2xl font-bold text-[hsl(var(--accent))] neon-text-amber">+{lastResult.tokensWon}</p>
//                 <p className="text-xs text-muted-foreground">tokens won</p>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {isLoading ? (
//           <div className="text-center py-20 text-muted-foreground">Loading prizes...</div>
//         ) : (
//           <div data-testid="prize-house-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//             {prizes.map((prize, i) => {
//               const rarity = getRarity(prize.token_cost);
//               return (
//                 <motion.div
//                   key={prize.id}
//                   data-testid="prize-card"
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: i * 0.05 }}
//                   whileHover={{ y: -3 }}
//                   className={`bg-white/90 rounded-2xl border ${rarity.border} shadow-[0_18px_45px_rgba(31,38,84,0.10)] overflow-hidden`}
//                 >
//                   <div className="h-40 overflow-hidden relative">
//                     <img src={prize.image_url} alt={prize.name} className="w-full h-full object-cover" />
//                     <div className="absolute top-2 right-2">
//                       <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${rarity.badge}`}>{rarity.label}</span>
//                     </div>
//                   </div>
//                   <div className="p-4">
//                     <h3 className="font-heading font-bold">{prize.name}</h3>
//                     <p className="text-xs text-muted-foreground mt-1">{prize.description}</p>
//                     <div className="flex items-center justify-between mt-3">
//                       <div>
//                         <div className="flex items-center gap-1">
//                           <Coins className="w-3.5 h-3.5 text-[hsl(var(--accent))]" />
//                           <span className="font-mono-num font-bold">{prize.token_cost}</span>
//                         </div>
//                         <p className="text-[10px] text-[hsl(var(--dycek-neon-lime))]">Win: {prize.winning_tokens} tokens</p>
//                       </div>
//                       <motion.button
//                         data-testid="prize-buy-button"
//                         whileTap={{ scale: 0.95 }}
//                         onClick={() => handleBuy(prize)}
//                         disabled={buyingId === prize.id || balance < prize.token_cost}
//                         className="px-4 py-2 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-xl text-sm font-bold hover:opacity-90 disabled:opacity-50 transition-opacity"
//                       >
//                         {buyingId === prize.id ? '...' : 'Buy'}
//                       </motion.button>
//                     </div>
//                     <p className="text-[10px] text-muted-foreground mt-2">Stock: {prize.stock}</p>
//                   </div>
//                 </motion.div>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </motion.div>
//   );
// };

// export default PrizeHouse;
