// import { useParams } from 'react-router-dom';
// import { useGetGameSessionQuery, useChooseSymbolMutation, useRollDiceMutation } from '@/store/apiSlice';
// import { useSelector } from 'react-redux';
// import { selectCurrentUser } from '@/store/authSlice';
// import { motion, AnimatePresence } from 'framer-motion';
// import { toast } from 'sonner';
// import { Coins, Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Trophy, Timer, X as XIcon, Circle } from 'lucide-react';
// import { useState, useEffect, useCallback, useMemo } from 'react';
// import confetti from 'canvas-confetti';

// const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
// const DICE_ICONS = [null, Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];

// const fadeIn = { opacity: 0 };
// const fadeVisible = { opacity: 1 };
// const springTransition = { type: 'spring' };
// const tapScale = { scale: 0.95 };

// // ==================== Coin Toss Component ====================
// const CoinToss = ({ session, userId, onTossComplete }) => {
//   const [myCall, setMyCall] = useState(null);
//   const [flipping, setFlipping] = useState(false);
//   const [tossResult, setTossResult] = useState(null);
//   const [showResult, setShowResult] = useState(false);

//   const isPlayerOne = session.player_one_id === userId;
//   const hasTossed = !!session.toss_result;
//   const callerIsPlayerOne = true; // Player one always calls the toss

//   const handleCallToss = async (call) => {
//     setMyCall(call);
//     setFlipping(true);

//     try {
//       const token = sessionStorage.getItem('dycek_token');
//       const res = await fetch(`${BACKEND_URL}/api/game/${session.id}/call-toss?call=${call}`, {
//         method: 'POST',
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.detail || 'Toss failed');

//       // Show flip animation for 2s then reveal
//       setTimeout(() => {
//         setTossResult(data.data.toss_result);
//         setShowResult(true);
//         setFlipping(false);
//         if (data.data.toss_winner_id === userId) {
//           toast.success('You won the toss!');
//         } else {
//           toast('Opponent won the toss');
//         }
//         setTimeout(() => onTossComplete(), 1500);
//       }, 2000);
//     } catch (err) {
//       toast.error(err.message || 'Toss failed');
//       setFlipping(false);
//     }
//   };

//   // If toss already happened
//   if (hasTossed) {
//     return null;
//   }

//   // Waiting for player one to call
//   if (!isPlayerOne && !hasTossed) {
//     return (
//       <div className="min-h-screen pt-16 pb-20 flex items-center justify-center">
//         <div className="text-center bg-[hsl(var(--card))] rounded-2xl border border-border/80 p-8 max-w-md">
//           <motion.div animate={{ rotateY: [0, 180, 360] }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
//             className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-[hsl(var(--accent))] to-[hsl(var(--accent))]/60 flex items-center justify-center shadow-xl shadow-[hsl(var(--accent))]/20">
//             <Coins className="w-12 h-12 text-black" />
//           </motion.div>
//           <h2 className="font-heading text-xl font-bold">Coin Toss</h2>
//           <p className="text-muted-foreground mt-2">Waiting for opponent to call the toss...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen pt-16 pb-20 flex items-center justify-center">
//       <div className="text-center bg-[hsl(var(--card))] rounded-2xl border border-border/80 p-8 max-w-md">
//         {/* 3D Coin */}
//         <div className="perspective-[600px] mb-6">
//           <motion.div
//             animate={flipping ? { rotateY: [0, 1800] } : {}}
//             transition={flipping ? { duration: 2, ease: 'easeOut' } : {}}
//             className="w-28 h-28 mx-auto rounded-full relative"
//             style={{ transformStyle: 'preserve-3d' }}
//           >
//             {/* Heads */}
//             <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[hsl(var(--accent))] to-[hsl(var(--primary))] flex items-center justify-center shadow-xl shadow-[hsl(var(--accent))]/30 border-4 border-[hsl(var(--primary))]/50"
//               style={{ backfaceVisibility: 'hidden' }}>
//               <span className="text-4xl font-bold text-black">H</span>
//             </div>
//             {/* Tails */}
//             <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center shadow-xl border-4 border-gray-400/50"
//               style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
//               <span className="text-4xl font-bold text-black">T</span>
//             </div>
//           </motion.div>
//         </div>

//         {showResult ? (
//           <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
//             <p className="text-lg font-bold">Result: <span className="text-[hsl(var(--accent))]">{tossResult === 'heads' ? 'Heads' : 'Tails'}</span></p>
//             <p className={`mt-2 font-bold ${session.toss_winner_id === userId ? 'text-[hsl(var(--dycek-neon-lime))]' : 'text-muted-foreground'}`}>
//               {session.toss_winner_id === userId ? 'You won the toss!' : 'Opponent won the toss'}
//             </p>
//           </motion.div>
//         ) : !flipping ? (
//           <>
//             <h2 className="font-heading text-xl font-bold mb-2">Call the Toss</h2>
//             <p className="text-sm text-muted-foreground mb-6">Choose Heads or Tails</p>
//             <div className="flex gap-4 justify-center">
//               <motion.button
//                 whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
//                 onClick={() => handleCallToss('heads')}
//                 data-testid="toss-heads-btn"
//                 className="w-28 h-28 rounded-full bg-gradient-to-br from-[hsl(var(--accent))] to-[hsl(var(--primary))] flex flex-col items-center justify-center hover:shadow-xl hover:shadow-[hsl(var(--accent))]/30 transition-shadow border-4 border-[hsl(var(--primary))]/50"
//               >
//                 <span className="text-2xl font-bold text-black">H</span>
//                 <span className="text-xs font-bold text-black/70 mt-1">Heads</span>
//               </motion.button>
//               <motion.button
//                 whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
//                 onClick={() => handleCallToss('tails')}
//                 data-testid="toss-tails-btn"
//                 className="w-28 h-28 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex flex-col items-center justify-center hover:shadow-xl hover:shadow-gray-400/30 transition-shadow border-4 border-gray-400/50"
//               >
//                 <span className="text-2xl font-bold text-black">T</span>
//                 <span className="text-xs font-bold text-black/70 mt-1">Tails</span>
//               </motion.button>
//             </div>
//           </>
//         ) : (
//           <p className="text-lg text-muted-foreground">Flipping...</p>
//         )}
//       </div>
//     </div>
//   );
// };

// // ==================== Sub-Components ====================
// const WaitingView = ({ tokensStaked }) => (
//   <div className="min-h-screen pt-16 pb-20 flex items-center justify-center">
//     <div className="text-center">
//       <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}>
//         <Timer className="w-12 h-12 mx-auto text-[hsl(var(--primary))]" />
//       </motion.div>
//       <h2 className="font-heading text-xl font-bold mt-4">Finding Opponent...</h2>
//       <p className="text-sm text-muted-foreground mt-2">Stake: {tokensStaked} tokens</p>
//       <p className="text-xs text-muted-foreground mt-4">You'll be matched automatically when an opponent joins</p>
//     </div>
//   </div>
// );

// const SymbolSelectView = ({ isTossWinner, onChoose }) => (
//   <div className="min-h-screen pt-16 pb-20 flex items-center justify-center">
//     <div className="text-center bg-[hsl(var(--card))] rounded-2xl border border-border/80 p-8 max-w-md">
//       <Trophy className="w-12 h-12 mx-auto text-[hsl(var(--accent))] mb-4" />
//       <h2 className="font-heading text-xl font-bold">Toss Winner!</h2>
//       {isTossWinner ? (
//         <>
//           <p className="text-[hsl(var(--dycek-neon-lime))] font-bold mt-2">You won the toss! Choose your symbol.</p>
//           <div className="flex gap-4 justify-center mt-6">
//             <motion.button whileHover={{ scale: 1.08 }} whileTap={tapScale} onClick={() => onChoose('X')}
//               data-testid="choose-x-btn"
//               className="w-20 h-20 bg-[hsl(var(--secondary))] rounded-2xl border border-border/80 flex items-center justify-center hover:border-[hsl(var(--primary))]/50 transition-colors">
//               <XIcon className="w-10 h-10 text-[hsl(var(--primary))]" />
//             </motion.button>
//             <motion.button whileHover={{ scale: 1.08 }} whileTap={tapScale} onClick={() => onChoose('O')}
//               data-testid="choose-o-btn"
//               className="w-20 h-20 bg-[hsl(var(--secondary))] rounded-2xl border border-border/80 flex items-center justify-center hover:border-[hsl(var(--accent))]/50 transition-colors">
//               <Circle className="w-10 h-10 text-[hsl(var(--accent))]" />
//             </motion.button>
//           </div>
//         </>
//       ) : (
//         <p className="text-muted-foreground mt-2">Opponent won the toss. Waiting for symbol selection...</p>
//       )}
//     </div>
//   </div>
// );

// const CompletedView = ({ session, userId }) => {
//   const isWinner = session.winner_id === userId;
//   const isDraw = !session.winner_id;

//   useEffect(() => {
//     if (isWinner) confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
//   }, [isWinner]);

//   return (
//     <div className="min-h-screen pt-16 pb-20 flex items-center justify-center">
//       <div className="text-center bg-[hsl(var(--card))] rounded-2xl border border-border/80 p-8 max-w-md">
//         {isDraw ? (
//           <><h2 className="font-heading text-2xl font-bold">Draw!</h2><p className="text-muted-foreground mt-2">Stakes refunded</p></>
//         ) : isWinner ? (
//           <>
//             <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={springTransition}>
//               <Trophy className="w-16 h-16 mx-auto text-[hsl(var(--accent))]" />
//             </motion.div>
//             <h2 className="font-heading text-2xl font-bold mt-4 text-[hsl(var(--dycek-neon-lime))]">You Won!</h2>
//             <div className="flex items-center justify-center gap-2 mt-2">
//               <Coins className="w-5 h-5 text-[hsl(var(--accent))]" />
//               <span className="font-mono-num text-2xl font-bold text-[hsl(var(--accent))]">+{session.tokens_staked * 2}</span>
//             </div>
//           </>
//         ) : (
//           <><h2 className="font-heading text-2xl font-bold text-[hsl(var(--destructive))]">You Lost</h2><p className="text-muted-foreground mt-2">Better luck next time!</p></>
//         )}
//         <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
//           <div className="bg-[hsl(var(--muted))] rounded-xl p-3"><p className="text-muted-foreground">Player 1</p><p className="font-mono-num font-bold">{session.player_one_points || 0} pts</p></div>
//           <div className="bg-[hsl(var(--muted))] rounded-xl p-3"><p className="text-muted-foreground">Player 2</p><p className="font-mono-num font-bold">{session.player_two_points || 0} pts</p></div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const GameBoard = ({ board }) => (
//   <div className="bg-[hsl(var(--card))] rounded-2xl border border-border/80 p-6 mb-4">
//     <div className="grid grid-cols-3 gap-2 max-w-[300px] mx-auto">
//       {board.map((cell, i) => (
//         <motion.div
//           key={`cell-${i}`}
//           initial={false}
//           animate={cell ? { scale: [0.8, 1.1, 1] } : {}}
//           transition={{ duration: 0.3 }}
//           className={`aspect-square rounded-xl border border-border/80 flex items-center justify-center text-2xl font-bold ${
//             cell ? 'bg-[hsl(var(--muted))]' : 'bg-[hsl(var(--secondary))]'
//           }`}
//         >
//           {cell === 'X' && <XIcon className="w-8 h-8 text-[hsl(var(--primary))]" />}
//           {cell === 'O' && <Circle className="w-8 h-8 text-[hsl(var(--accent))]" />}
//           {!cell && <span className="text-xs text-muted-foreground/30">{i + 1}</span>}
//         </motion.div>
//       ))}
//     </div>
//   </div>
// );

// // ==================== Main Component ====================
// const GamePlay = () => {
//   const { sessionId } = useParams();
//   const user = useSelector(selectCurrentUser);
//   const { data: sessionData, refetch } = useGetGameSessionQuery(sessionId, { pollingInterval: 2000 });
//   const [chooseSymbol] = useChooseSymbolMutation();
//   const [rollDice, { isLoading: rolling }] = useRollDiceMutation();
//   const [lastDice, setLastDice] = useState(null);
//   const [diceAnimating, setDiceAnimating] = useState(false);

//   const session = sessionData?.data || {};
//   const sessionStatus = session.status;
//   const isPlayerOne = session.player_one_id === user?.id;
//   const isMyTurn = session.current_turn === user?.id;
//   const mySymbol = isPlayerOne ? session.player_one_symbol : session.player_two_symbol;
//   const board = useMemo(() => session.board || Array(9).fill(null), [session.board]);

//   useEffect(() => {
//     if (sessionStatus === 'in_progress' || sessionStatus === 'waiting') {
//       const id = setInterval(refetch, 2000);
//       return () => clearInterval(id);
//     }
//   }, [sessionStatus, refetch]);

//   const handleChooseSymbol = useCallback(async (symbol) => {
//     try {
//       await chooseSymbol({ sessionId, symbol }).unwrap();
//       toast.success(`You chose ${symbol}!`);
//       refetch();
//     } catch (err) {
//       toast.error(err?.data?.detail || 'Failed');
//     }
//   }, [chooseSymbol, sessionId, refetch]);

//   const handleRollDice = useCallback(async () => {
//     if (!isMyTurn || rolling) return;
//     setDiceAnimating(true);
//     try {
//       const res = await rollDice(sessionId).unwrap();
//       setLastDice(res.data.dice_value);
//       setTimeout(() => setDiceAnimating(false), 500);
//       refetch();
//       if (res.data.triple_six_penalty) {
//         toast.error('Triple 6! Turn invalidated and passed.');
//       } else if (res.data.extra_roll) {
//         toast.success(`Rolled a 6! You get an extra roll!`);
//       } else if (res.data.was_skipped) {
//         toast('Position taken - skipped');
//       } else {
//         toast.success(`Rolled ${res.data.dice_value} - placed!`);
//       }
//     } catch (err) {
//       setDiceAnimating(false);
//       toast.error(err?.data?.detail || 'Failed');
//     }
//   }, [isMyTurn, rolling, rollDice, sessionId, refetch]);

//   // Render by state
//   if (sessionStatus === 'waiting') {
//     return <WaitingView tokensStaked={session.tokens_staked} />;
//   }

//   // Coin toss phase (after join, before toss_result)
//   if (sessionStatus === 'in_progress' && !session.toss_result) {
//     return <CoinToss session={session} userId={user?.id} onTossComplete={refetch} />;
//   }

//   // Symbol selection phase
//   if (sessionStatus === 'in_progress' && session.toss_result && !session.player_one_symbol) {
//     const isTossWinner = session.toss_winner_id === user?.id;
//     return <SymbolSelectView isTossWinner={isTossWinner} onChoose={handleChooseSymbol} />;
//   }

//   if (sessionStatus === 'completed') {
//     return <CompletedView session={session} userId={user?.id} />;
//   }

//   // Active game
//   const DiceIcon = lastDice ? DICE_ICONS[lastDice] : Dice1;
//   const myPoints = isPlayerOne ? (session.player_one_points || 0) : (session.player_two_points || 0);
//   const opponentPoints = isPlayerOne ? (session.player_two_points || 0) : (session.player_one_points || 0);
//   const consecutiveSixes = session.consecutive_sixes || 0;
//   const opponentName = isPlayerOne ? session.player_two_username : session.player_one_username;
//   const turnLabel = isMyTurn ? 'Your Turn' : "Opponent's Turn";
//   const buttonLabel = (rolling || diceAnimating) ? 'Rolling...' : (isMyTurn ? 'Roll Dice' : 'Wait...');

//   return (
//     <motion.div initial={fadeIn} animate={fadeVisible} className="min-h-screen pt-16 pb-20 md:pb-6">
//       <div className="max-w-2xl mx-auto px-4 py-6">
//         <div className="bg-[hsl(var(--card))] rounded-2xl border border-border/80 p-4 mb-4 flex items-center justify-between">
//           <div>
//             <p className="text-xs text-muted-foreground">vs {opponentName}</p>
//             <div className="flex items-center gap-1 mt-1">
//               <Coins className="w-3.5 h-3.5 text-[hsl(var(--accent))]" />
//               <span className="font-mono-num text-sm font-bold">Stake: {session.tokens_staked}</span>
//             </div>
//           </div>
//           <div className={`px-3 py-1 rounded-full text-xs font-bold ${
//             isMyTurn ? 'bg-[hsl(var(--dycek-neon-lime))]/20 text-[hsl(var(--dycek-neon-lime))]' : 'bg-[hsl(var(--muted))] text-muted-foreground'
//           }`}>
//             {turnLabel}
//           </div>
//         </div>

//         <div className="grid grid-cols-2 gap-3 mb-4">
//           <div className={`bg-[hsl(var(--card))] rounded-xl border border-border/80 p-3 text-center ${isPlayerOne ? 'ring-1 ring-[hsl(var(--primary))]/30' : ''}`}>
//             <p className="text-xs text-muted-foreground">You ({mySymbol})</p>
//             <p className="font-mono-num text-xl font-bold">{myPoints}</p>
//           </div>
//           <div className={`bg-[hsl(var(--card))] rounded-xl border border-border/80 p-3 text-center ${!isPlayerOne ? 'ring-1 ring-[hsl(var(--primary))]/30' : ''}`}>
//             <p className="text-xs text-muted-foreground">Opponent</p>
//             <p className="font-mono-num text-xl font-bold">{opponentPoints}</p>
//           </div>
//         </div>

//         <GameBoard board={board} />

//         <div className="text-center">
//           <AnimatePresence>
//             {lastDice && (
//               <motion.div key={`dice-${lastDice}-${Date.now()}`}
//                 initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
//                 className="mb-4">
//                 {DiceIcon && <DiceIcon className="w-16 h-16 mx-auto text-[hsl(var(--accent))]" />}
//               </motion.div>
//             )}
//           </AnimatePresence>
          
//           <motion.button
//             whileTap={tapScale}
//             onClick={handleRollDice}
//             disabled={!isMyTurn || rolling || diceAnimating}
//             className="px-8 py-3 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-xl font-bold text-lg hover:opacity-90 disabled:opacity-50 neon-glow-cyan transition-opacity"
//           >
//             {buttonLabel}
//           </motion.button>

//           {consecutiveSixes > 0 && isMyTurn && (
//             <p className="text-xs text-[hsl(var(--accent))] mt-2 font-bold">
//               Consecutive 6s: {consecutiveSixes}/3 {consecutiveSixes === 2 && '(next 6 = turn lost!)'}
//             </p>
//           )}
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default GamePlay;
