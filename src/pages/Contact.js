// import { useSubmitContactMutation } from '@/store/apiSlice';
// import { motion } from 'framer-motion';
// import { toast } from 'sonner';
// import { MessageCircle, Send, Phone, Mail } from 'lucide-react';
// import { useState } from 'react';

// const Contact = () => {
//   const [submitContact, { isLoading }] = useSubmitContactMutation();
//   const [form, setForm] = useState({ name: '', mobile: '', email: '', message: '' });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!form.name || !form.message) {
//       toast.error('Name and message are required');
//       return;
//     }
//     try {
//       await submitContact(form).unwrap();
//       toast.success('Message sent successfully!');
//       setForm({ name: '', mobile: '', email: '', message: '' });
//     } catch (err) {
//       toast.error(err.data?.detail || 'Failed to send message');
//     }
//   };

//   return (
//     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen pt-16 pb-20 md:pb-6">
//       <div className="max-w-2xl mx-auto px-4 py-6">
//         <h1 className="font-heading text-2xl sm:text-3xl font-bold mb-2">Support & Contact</h1>
//         <p className="text-sm text-muted-foreground mb-6">Need help? Send us a message</p>

//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
//           <div className="bg-[hsl(var(--card))] rounded-2xl border border-border/80 p-4 flex items-center gap-3">
//             <div className="w-10 h-10 rounded-xl bg-[hsl(var(--primary))]/10 flex items-center justify-center">
//               <Phone className="w-5 h-5 text-[hsl(var(--primary))]" />
//             </div>
//             <div>
//               <p className="text-xs text-muted-foreground">Phone</p>
//               <p className="text-sm font-medium">+91 XXXXXXXXXX</p>
//             </div>
//           </div>
//           <div className="bg-[hsl(var(--card))] rounded-2xl border border-border/80 p-4 flex items-center gap-3">
//             <div className="w-10 h-10 rounded-xl bg-[hsl(var(--accent))]/10 flex items-center justify-center">
//               <Mail className="w-5 h-5 text-[hsl(var(--accent))]" />
//             </div>
//             <div>
//               <p className="text-xs text-muted-foreground">Email</p>
//               <p className="text-sm font-medium">support@LudooVictory.com</p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white/90 rounded-2xl border border-border/80 shadow-[0_18px_45px_rgba(31,38,84,0.10)] p-6">
//           <div className="flex items-center gap-2 mb-4">
//             <MessageCircle className="w-5 h-5 text-[hsl(var(--primary))]" />
//             <h3 className="font-heading font-bold">Send a Message</h3>
//           </div>
//           <form data-testid="support-form" onSubmit={handleSubmit} className="space-y-4">
//             <input
//               placeholder="Your Name *"
//               value={form.name}
//               onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))}
//               className="w-full px-4 py-2.5 bg-[hsl(var(--muted))] border border-border/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
//             />
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <input
//                 placeholder="Mobile Number"
//                 value={form.mobile}
//                 onChange={(e) => setForm(p => ({ ...p, mobile: e.target.value }))}
//                 className="w-full px-4 py-2.5 bg-[hsl(var(--muted))] border border-border/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
//               />
//               <input
//                 placeholder="Email"
//                 type="email"
//                 value={form.email}
//                 onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
//                 className="w-full px-4 py-2.5 bg-[hsl(var(--muted))] border border-border/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
//               />
//             </div>
//             <textarea
//               placeholder="Your message *"
//               rows={4}
//               value={form.message}
//               onChange={(e) => setForm(p => ({ ...p, message: e.target.value }))}
//               className="w-full px-4 py-2.5 bg-[hsl(var(--muted))] border border-border/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] resize-none"
//             />
//             <motion.button
//               data-testid="support-submit-button"
//               whileTap={{ scale: 0.97 }}
//               type="submit"
//               disabled={isLoading}
//               className="w-full py-3 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-xl font-bold text-sm hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
//             >
//               <Send className="w-4 h-4" /> {isLoading ? 'Sending...' : 'Send Message'}
//             </motion.button>
//           </form>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default Contact;
