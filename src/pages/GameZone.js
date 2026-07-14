// import { useCreateGameMutation, useGetAvailableGamesQuery, useJoinGameMutation, useGetWalletQuery } from '@/store/apiSlice';
// import { useDispatch } from 'react-redux';
// import { updateWalletBalance } from '@/store/authSlice';
// import { motion } from 'framer-motion';
// import { toast } from 'sonner';
// import { Coins, Gamepad2, Zap, Info } from 'lucide-react';
// import { useState, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';

// const STAKE_OPTIONS = [5, 10, 25, 50, 100];

// const GameZone = () => {
//   const { data: walletData } = useGetWalletQuery(undefined, { pollingInterval: 15000 });
//   const { data: gamesData } = useGetAvailableGamesQuery(undefined, { pollingInterval: 3000 });
//   const [createGame, { isLoading: creating }] = useCreateGameMutation();
//   const [joinGame, { isLoading: joining }] = useJoinGameMutation();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [stake, setStake] = useState(10);
//   const [matchmaking, setMatchmaking] = useState(false);

//   const balance = walletData?.data?.balance ?? 0;
//   const games = gamesData?.data || [];

//   const handlePlayGame = useCallback(async () => {
//     if (balance < stake) {
//       toast.error('Insufficient tokens');
//       return;
//     }
//     setMatchmaking(true);
//     try {
//       // Auto-matchmaking: try to join an available game with the same stake first
//       const matchingGame = games.find(g => g.tokens_staked === stake);
//       if (matchingGame) {
//         const res = await joinGame(matchingGame.id).unwrap();
//         toast.success('Opponent found! Game starting...');
//         navigate(`/game/${res.data.id}`);
//       } else {
//         // No match found, create a new game and wait
//         const res = await createGame({ tokens_staked: stake }).unwrap();
//         dispatch(updateWalletBalance(balance - stake));
//         toast.success('Searching for an opponent...');
//         navigate(`/game/${res.data.id}`);
//       }
//     } catch (err) {
//       toast.error(err.data?.detail || 'Failed to start game');
//     } finally {
//       setMatchmaking(false);
//     }
//   }, [balance, stake, games, joinGame, createGame, dispatch, navigate]);

//   return (
//     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen pt-16 pb-20 md:pb-6">
//       <div className="max-w-4xl mx-auto px-4 py-6">
//         <div className="flex items-center justify-between mb-6">
//           <div>
//             <h1 className="font-heading text-2xl sm:text-3xl font-bold">Game Zone</h1>
//             <p className="text-sm text-muted-foreground mt-1">Dice Tic Tac Toe - PvP</p>
//           </div>
//           <div className="flex items-center gap-2 bg-[hsl(var(--secondary))] rounded-full px-4 py-2 border border-border/80">
//             <Coins className="w-4 h-4 text-[hsl(var(--accent))]" />
//             <span className="font-mono-num font-bold">{balance.toLocaleString()}</span>
//           </div>
//         </div>

//         {/* Play Card */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-white/90 rounded-2xl border border-border/80 shadow-[0_18px_45px_rgba(31,38,84,0.10)] p-6 mb-6 relative overflow-hidden"
//         >
//           <div className="absolute inset-0 bg-[radial-gradient(400px_circle_at_80%_20%,rgba(197,143,34,0.16),transparent_60%)]" />
//           <div className="relative">
//             <div className="flex items-center gap-3 mb-6">
//               <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[hsl(var(--primary))]/20 to-[hsl(var(--accent))]/10 flex items-center justify-center">
//                 <Gamepad2 className="w-7 h-7 text-[hsl(var(--primary))]" />
//               </div>
//               <div>
//                 <h2 className="font-heading text-xl font-bold">Quick Match</h2>
//                 <p className="text-sm text-muted-foreground">Auto-match with an opponent instantly</p>
//               </div>
//             </div>

//             <div className="mb-6">
//               <label className="text-sm text-muted-foreground mb-3 block">Choose Your Stake</label>
//               <div className="flex gap-2 flex-wrap">
//                 {STAKE_OPTIONS.map(v => (
//                   <motion.button
//                     key={v}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={() => setStake(v)}
//                     className={`px-5 py-2.5 rounded-xl text-sm font-mono-num font-bold transition-all ${
//                       stake === v
//                         ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-lg shadow-[hsl(var(--primary))]/20'
//                         : 'bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--secondary))]/80'
//                     }`}
//                   >
//                     {v}
//                   </motion.button>
//                 ))}
//               </div>
//               <p className="text-xs text-muted-foreground mt-3">Winner takes all: <span className="font-mono-num font-bold text-[hsl(var(--accent))]">{stake * 2} tokens</span></p>
//             </div>

//             <motion.button
//               data-testid="game-play-button"
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.97 }}
//               onClick={handlePlayGame}
//               disabled={creating || joining || matchmaking || balance < stake}
//               className="w-full py-4 bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(174,84%,35%)] text-[hsl(var(--primary-foreground))] rounded-2xl font-bold text-lg hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl shadow-[hsl(var(--primary))]/20 neon-glow-cyan transition-opacity"
//             >
//               {matchmaking ? (
//                 <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}><Zap className="w-6 h-6" /></motion.div> Finding Opponent...</>
//               ) : (
//                 <><Gamepad2 className="w-6 h-6" /> Play Game ({stake} Tokens)</>
//               )}
//             </motion.button>
//           </div>
//         </motion.div>

//         {/* Game Rules */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.1 }}
//           className="bg-white/90 rounded-2xl border border-border/80 shadow-[0_18px_45px_rgba(31,38,84,0.10)] p-6"
//         >
//           <div className="flex items-center gap-2 mb-4">
//             <Info className="w-5 h-5 text-[hsl(var(--primary))]" />
//             <h3 className="font-heading font-bold">Dice Tic Tac Toe Rules</h3>
//           </div>
//           <ul className="space-y-2.5 text-sm text-muted-foreground">
//             <li className="flex items-start gap-2">
//               <span className="font-mono-num text-[hsl(var(--primary))] font-bold mt-0.5">1</span>
//               <span>Choose Heads or Tails for the <span className="text-foreground font-medium">coin toss</span>. Winner picks their symbol (X or O).</span>
//             </li>
//             <li className="flex items-start gap-2">
//               <span className="font-mono-num text-[hsl(var(--primary))] font-bold mt-0.5">2</span>
//               <span>Roll the dice — your number (1-6) places your symbol on that board position.</span>
//             </li>
//             <li className="flex items-start gap-2">
//               <span className="font-mono-num text-[hsl(var(--primary))] font-bold mt-0.5">3</span>
//               <span>You get <span className="text-[hsl(var(--accent))] font-bold">1 roll per turn</span>. Rolling a <span className="text-[hsl(var(--accent))] font-bold">6</span> gives you an extra roll!</span>
//             </li>
//             <li className="flex items-start gap-2">
//               <span className="font-mono-num text-[hsl(var(--primary))] font-bold mt-0.5">4</span>
//               <span>But beware: <span className="text-[hsl(var(--destructive))] font-bold">three 6s in a row</span> = invalid turn. Turn passes to opponent.</span>
//             </li>
//             <li className="flex items-start gap-2">
//               <span className="font-mono-num text-[hsl(var(--primary))] font-bold mt-0.5">5</span>
//               <span>Points from dice values are tracked. <span className="text-foreground font-medium">Highest score when board fills wins the pot!</span></span>
//             </li>
//           </ul>
//         </motion.div>
//       </div>
//     </motion.div>
//   );
// };

// export default GameZone;
