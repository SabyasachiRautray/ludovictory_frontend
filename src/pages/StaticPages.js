import { motion } from 'framer-motion';
import { Target, Eye, Shield, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen pt-16 pb-20 md:pb-6">
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="font-heading text-3xl font-bold mb-8">About LudooVictory</h1>

      <div className="space-y-6">
        <div className="bg-white/90 rounded-2xl border border-border/80 p-6 shadow-[0_18px_45px_rgba(31,38,84,0.10)]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[hsl(var(--primary))]/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-[hsl(var(--primary))]" />
            </div>
            <h2 className="font-heading text-xl font-bold">Our Mission</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            To create an engaging, fun, and rewarding gaming platform where everyone can participate and earn through skill,
            strategy, and a bit of luck. We believe gaming should be accessible, exciting, and rewarding for all players.
          </p>
        </div>

        <div className="bg-white/90 rounded-2xl border border-border/80 p-6 shadow-[0_18px_45px_rgba(31,38,84,0.10)]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[hsl(var(--accent))]/10 flex items-center justify-center">
              <Eye className="w-5 h-5 text-[hsl(var(--accent))]" />
            </div>
            <h2 className="font-heading text-xl font-bold">Our Vision</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            To become India's top choice for token-based digital gaming, offering a platform that combines classic games
            with modern rewards. We envision a community of millions of players competing, earning, and having fun together.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link to="/privacy" className="bg-[hsl(var(--card))] rounded-2xl border border-border/80 p-6 hover:bg-black/5 transition-colors">
            <Shield className="w-8 h-8 text-[hsl(var(--primary))] mb-3" />
            <h3 className="font-heading font-bold">Privacy Policy</h3>
            <p className="text-sm text-muted-foreground mt-1">How we protect your data</p>
          </Link>
          <Link to="/terms" className="bg-[hsl(var(--card))] rounded-2xl border border-border/80 p-6 hover:bg-black/5 transition-colors">
            <FileText className="w-8 h-8 text-[hsl(var(--accent))] mb-3" />
            <h3 className="font-heading font-bold">Terms & Conditions</h3>
            <p className="text-sm text-muted-foreground mt-1">Platform rules and guidelines</p>
          </Link>
        </div>
      </div>
    </div>
  </motion.div>
);

const Privacy = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen pt-16 pb-20 md:pb-6">
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="font-heading text-3xl font-bold mb-6">Privacy Policy</h1>
      <div className="bg-white/90 rounded-2xl border border-border/80 p-6 shadow-[0_18px_45px_rgba(31,38,84,0.10)] space-y-4 text-muted-foreground">
        <h3 className="font-heading font-bold text-foreground">1. Information We Collect</h3>
        <p>We collect personal information including name, email, mobile number, and username during registration. We also collect usage data such as game history, spin results, and transaction logs.</p>

        <h3 className="font-heading font-bold text-foreground">2. How We Use Your Information</h3>
        <p>Your information is used to provide and improve our services, process token transactions, maintain your account, and communicate important updates about the platform.</p>

        <h3 className="font-heading font-bold text-foreground">3. Data Security</h3>
        <p>We implement industry-standard security measures including password hashing (bcrypt), JWT authentication, and encrypted data transmission to protect your personal information.</p>

        <h3 className="font-heading font-bold text-foreground">4. Token Economy</h3>
        <p>Tokens on LudooVictory have no real monetary value. They are virtual credits used solely within the platform for gameplay, prizes, and product redemptions.</p>

        <h3 className="font-heading font-bold text-foreground">5. Contact</h3>
        <p>For privacy-related inquiries, contact us at support@LudooVictory.com</p>
      </div>
    </div>
  </motion.div>
);

const Terms = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen pt-16 pb-20 md:pb-6">
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="font-heading text-3xl font-bold mb-6">Terms & Conditions</h1>
      <div className="bg-white/90 rounded-2xl border border-border/80 p-6 shadow-[0_18px_45px_rgba(31,38,84,0.10)] space-y-4 text-muted-foreground">
        <h3 className="font-heading font-bold text-foreground">1. Acceptance of Terms</h3>
        <p>By using LudooVictory, you agree to these terms and conditions. If you do not agree, please do not use the platform.</p>

        <h3 className="font-heading font-bold text-foreground">2. Account Registration</h3>
        <p>Users must provide accurate information during registration. Each user may only create one account. Mobile verification via OTP is required.</p>

        <h3 className="font-heading font-bold text-foreground">3. Token System</h3>
        <p>Tokens are virtual credits with no real-world monetary value. Tokens cannot be exchanged for real currency. All token transactions are final and non-refundable.</p>

        <h3 className="font-heading font-bold text-foreground">4. Fair Play</h3>
        <p>Users must play fairly. Any form of cheating, exploitation of bugs, or manipulation of the token system will result in account suspension or permanent ban.</p>

        <h3 className="font-heading font-bold text-foreground">5. Referral Program</h3>
        <p>Referral bonuses are credited once per referred user. Self-referral or creating multiple accounts for bonus farming is prohibited.</p>

        <h3 className="font-heading font-bold text-foreground">6. Modifications</h3>
        <p>LudooVictory reserves the right to modify these terms at any time. Continued use constitutes acceptance of modified terms.</p>
      </div>
    </div>
  </motion.div>
);

export { About, Privacy, Terms };
