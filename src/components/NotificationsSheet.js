// import { useGetNotificationsQuery, useMarkNotificationReadMutation, useMarkAllNotificationsReadMutation } from '@/store/apiSlice';
// import { Bell, Check, CheckCheck, Trophy, RotateCw, ShoppingBag, Gift, Gamepad2, Info } from 'lucide-react';
// import { formatDistanceToNow } from 'date-fns';
// import { motion, AnimatePresence } from 'framer-motion';

// const typeIcons = {
//   referral: Gift,
//   spinner: RotateCw,
//   prize: Trophy,
//   // product: ShoppingBag,
//   game: Gamepad2,
//   system: Info,
// };

// const NotificationsSheet = ({ open, onOpenChange }) => {
//   const { data } = useGetNotificationsQuery({}, { skip: !open });
//   const [markRead] = useMarkNotificationReadMutation();
//   const [markAllRead] = useMarkAllNotificationsReadMutation();

//   const notifications = data?.data?.notifications || [];

//   if (!open) return null;

//   return (
//     <AnimatePresence>
//       {open && (
//         <>
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 z-50 bg-black/50"
//             onClick={() => onOpenChange(false)}
//           />
//           <motion.div
//             data-testid="notifications-sheet"
//             initial={{ x: 400, opacity: 0 }}
//             animate={{ x: 0, opacity: 1 }}
//             exit={{ x: 400, opacity: 0 }}
//             transition={{ type: 'spring', damping: 25, stiffness: 200 }}
//             className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm bg-[hsl(var(--card))] border-l border-border shadow-2xl"
//           >
//             <div className="p-4 border-b border-border flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <Bell className="w-5 h-5 text-[hsl(var(--primary))]" />
//                 <h2 className="font-heading font-bold text-lg">Notifications</h2>
//               </div>
//               <button
//                 onClick={() => markAllRead()}
//                 className="text-xs text-[hsl(var(--primary))] hover:underline flex items-center gap-1"
//               >
//                 <CheckCheck className="w-3 h-3" /> Mark all read
//               </button>
//             </div>
//             <div className="overflow-y-auto h-[calc(100vh-60px)] p-2">
//               {notifications.length === 0 ? (
//                 <div className="text-center py-10 text-muted-foreground">
//                   <Bell className="w-10 h-10 mx-auto mb-2 opacity-30" />
//                   <p>No notifications yet</p>
//                 </div>
//               ) : (
//                 notifications.map((notif) => {
//                   const Icon = typeIcons[notif.type] || Info;
//                   return (
//                     <motion.div
//                       key={notif.id}
//                       data-testid="notification-item"
//                       initial={{ opacity: 0, y: 10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       className={`p-3 rounded-xl mb-1 transition-colors cursor-pointer ${
//                         notif.is_read ? 'bg-transparent' : 'bg-[hsl(var(--primary))]/5'
//                       } hover:bg-black/5`}
//                       onClick={() => !notif.is_read && markRead(notif.id)}
//                     >
//                       <div className="flex items-start gap-3">
//                         <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
//                           notif.is_read ? 'bg-[hsl(var(--muted))]' : 'bg-[hsl(var(--primary))]/10'
//                         }`}>
//                           <Icon className={`w-4 h-4 ${notif.is_read ? 'text-muted-foreground' : 'text-[hsl(var(--primary))]'}`} />
//                         </div>
//                         <div className="flex-1 min-w-0">
//                           <p className="text-sm font-medium truncate">{notif.title}</p>
//                           <p className="text-xs text-muted-foreground mt-0.5">{notif.message}</p>
//                           <p className="text-[10px] text-muted-foreground mt-1">
//                             {notif.created_at ? formatDistanceToNow(new Date(notif.created_at), { addSuffix: true }) : ''}
//                           </p>
//                         </div>
//                         {!notif.is_read && (
//                           <div className="w-2 h-2 rounded-full bg-[hsl(var(--primary))] shrink-0 mt-2" />
//                         )}
//                       </div>
//                     </motion.div>
//                   );
//                 })
//               )}
//             </div>
//           </motion.div>
//         </>
//       )}
//     </AnimatePresence>
//   );
// };

// export default NotificationsSheet;
