import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSendOtpMutation, useVerifyOtpMutation, useRegisterMutation } from '@/store/apiSlice';
import { setCredentials } from '@/store/authSlice';
import { toast } from 'sonner';
import { Eye, EyeOff, ArrowRight, ArrowLeft, Check, Coins, UserPlus, Phone, Mail, Lock, User, FileText, Shield } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import confetti from 'canvas-confetti';

// ─── Static content components ────────────────────────────────────────────────

const PrivacyContent = () => (
  <div className="space-y-4 text-sm text-muted-foreground">
    <h3 className="font-heading font-bold text-foreground text-base">1. Information We Collect</h3>
    <p>We collect personal information including name, email, mobile number, and username during registration. We also collect usage data such as game history, spin results, and transaction logs.</p>
    <h3 className="font-heading font-bold text-foreground text-base">2. How We Use Your Information</h3>
    <p>Your information is used to provide and improve our services, process token transactions, maintain your account, and communicate important updates about the platform.</p>
    <h3 className="font-heading font-bold text-foreground text-base">3. Data Security</h3>
    <p>We implement industry-standard security measures including password hashing (bcrypt), JWT authentication, and encrypted data transmission to protect your personal information.</p>
    <h3 className="font-heading font-bold text-foreground text-base">4. Token Economy</h3>
    <p>Tokens on LudooVictory have no real monetary value. They are virtual credits used solely within the platform for gameplay, prizes, and product redemptions.</p>
    <h3 className="font-heading font-bold text-foreground text-base">5. Contact</h3>
    <p>For privacy-related inquiries, contact us at support@LudooVictory.com</p>
  </div>
);

const TermsContent = () => (
  <div className="space-y-4 text-sm text-muted-foreground">
    <h3 className="font-heading font-bold text-foreground text-base">1. Acceptance of Terms</h3>
    <p>By using LudooVictory, you agree to these terms and conditions. If you do not agree, please do not use the platform.</p>
    <h3 className="font-heading font-bold text-foreground text-base">2. Account Registration</h3>
    <p>Users must provide accurate information during registration. Each user may only create one account. Mobile verification via OTP is required.</p>
    <h3 className="font-heading font-bold text-foreground text-base">3. Token System</h3>
    <p>Tokens are virtual credits with no real-world monetary value. Tokens cannot be exchanged for real currency. All token transactions are final and non-refundable.</p>
    <h3 className="font-heading font-bold text-foreground text-base">4. Fair Play</h3>
    <p>Users must play fairly. Any form of cheating, exploitation of bugs, or manipulation of the token system will result in account suspension or permanent ban.</p>
    <h3 className="font-heading font-bold text-foreground text-base">5. Referral Program</h3>
    <p>Referral bonuses are credited once per referred user. Self-referral or creating multiple accounts for bonus farming is prohibited.</p>
    <h3 className="font-heading font-bold text-foreground text-base">6. Modifications</h3>
    <p>LudooVictory reserves the right to modify these terms at any time. Continued use constitutes acceptance of modified terms.</p>
  </div>
);

// ─── Register page ────────────────────────────────────────────────────────────

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [otp, setOtp] = useState('');

  // Stores wallet balances from register response for success screen
  const [registeredUser, setRegisteredUser] = useState(null);

  const [form, setForm] = useState({
    full_name: '',
    username: '',
    email: '',
    mobile: '',
    password: '',
    referred_by_code: '',
  });

  const [sendOtp, { isLoading: sendingOtp }] = useSendOtpMutation();
  const [verifyOtp, { isLoading: verifyingOtp }] = useVerifyOtpMutation();
  const [register, { isLoading: registering }] = useRegisterMutation();

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  // ── Step 1 → Step 2: validate fields then send OTP ───────────────────────
  const handleSendOtp = async () => {
    if (!form.full_name || !form.username || !form.email || !form.mobile || !form.password) {
      toast.error('Please fill all required fields');
      return;
    }
    if (!agreedTerms) {
      toast.error('Please accept the Terms & Conditions and Privacy Policy');
      return;
    }

    try {
      // Backend returns { message } only — OTP is console.logged server-side
      await sendOtp({ email: form.email }).unwrap();
      toast.success('OTP sent to your email id');
      setStep(2);
    } catch (err) {
      toast.error(err.data?.message || 'Failed to send OTP');
    }
  };

  // ── Step 2: verify OTP then register ─────────────────────────────────────
  const handleVerifyAndRegister = async () => {
    if (otp.length !== 6) {
      toast.error('Please enter the 6-digit OTP');
      return;
    }

    try {
      // Step 1 — verify OTP
      // Backend: POST /auth/verify-otp { mobile, otp_code }
      // Returns: { message }
      await verifyOtp({ email: form.email, otp_code: otp }).unwrap();

      // Step 2 — register
      // Backend: POST /auth/register { full_name, username, email, mobile, password, referred_by_code? }
      // Returns: { message, token, user }
      // user has: referral_token_balance, shopping_token_balance
      const regData = { ...form };
      if (!regData.referred_by_code) delete regData.referred_by_code;

      const res = await register(regData).unwrap();

      // Store credentials in Redux + sessionStorage
      dispatch(setCredentials({
        token: res.token,
        user: res.user,
      }));

      // Keep user data for success screen
      setRegisteredUser(res.user);

      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      setStep(3);
    } catch (err) {
      toast.error(err.data?.message || 'Registration failed');
    }
  };

  // ── Bonus tokens to show on success screen ────────────────────────────────
  // Signup bonus (100) + referral bonus if code was used (100)
  const referralTokensEarned = registeredUser?.referral_token_balance ?? 100;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_20%_10%,rgba(197,143,34,0.18),transparent_55%),radial-gradient(700px_circle_at_80%_20%,rgba(31,38,84,0.14),transparent_55%)]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative"
      >
        {/* ── Logo ────────────────────────────────────────────────────── */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent))] flex items-center justify-center">
              <span className="text-lg font-bold text-[hsl(var(--primary-foreground))]">D</span>
            </div>
            <span className="font-heading font-bold text-2xl">LudooVictory</span>
          </Link>
          <h1 className="font-heading text-2xl font-bold">Create Account</h1>
          <p className="text-muted-foreground text-sm mt-1">Join and earn tokens!</p>
        </div>

        {/* ── Progress stepper ────────────────────────────────────────── */}
        <div
          data-testid="register-stepper"
          className="flex items-center justify-center gap-2 mb-6"
        >
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <motion.div
                animate={{ scale: step === s ? 1.1 : 1 }}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  step >= s
                    ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
                    : 'bg-[hsl(var(--muted))] text-muted-foreground'
                }`}
              >
                {step > s ? <Check className="w-4 h-4" /> : s}
              </motion.div>
              {s < 3 && (
                <div className={`w-10 h-0.5 transition-colors ${
                  step > s ? 'bg-[hsl(var(--primary))]' : 'bg-[hsl(var(--muted))]'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* ── Form card ───────────────────────────────────────────────── */}
        <div className="bg-white/90 rounded-2xl border border-border/80 shadow-[0_18px_45px_rgba(31,38,84,0.12)] p-6">
          <AnimatePresence mode="wait">

            {/* Step 1 — Details form */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                data-testid="register-form"
                className="space-y-4"
              >
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <input
                    name="full_name" placeholder="Full Name"
                    value={form.full_name} onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-[hsl(var(--muted))] border border-border/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] transition-all"
                  />
                </div>
                <div className="relative">
                  <UserPlus className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <input
                    name="username" placeholder="Username"
                    value={form.username} onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-[hsl(var(--muted))] border border-border/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] transition-all"
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <input
                    name="email" type="email" placeholder="Email"
                    value={form.email} onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-[hsl(var(--muted))] border border-border/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] transition-all"
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <input
                    name="mobile" placeholder="Mobile Number"
                    value={form.mobile} onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-[hsl(var(--muted))] border border-border/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] transition-all"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password (min 6 characters)"
                    value={form.password} onChange={handleChange}
                    className="w-full pl-10 pr-10 py-2.5 bg-[hsl(var(--muted))] border border-border/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="relative">
                  <Coins className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <input
                    name="referred_by_code"
                    placeholder="Referral Code (optional)"
                    value={form.referred_by_code} onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-[hsl(var(--muted))] border border-border/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] transition-all"
                  />
                </div>

                {/* Terms checkbox */}
                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="agree-terms"
                    data-testid="register-terms-checkbox"
                    checked={agreedTerms}
                    onChange={(e) => setAgreedTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-border/80 bg-[hsl(var(--muted))] accent-[hsl(var(--primary))] cursor-pointer"
                  />
                  <label htmlFor="agree-terms" className="text-xs text-muted-foreground leading-relaxed">
                    I agree to the{' '}
                    <button
                      type="button"
                      onClick={() => setShowTerms(true)}
                      data-testid="register-terms-link"
                      className="text-[hsl(var(--primary))] hover:underline font-medium"
                    >
                      Terms & Conditions
                    </button>{' '}
                    and{' '}
                    <button
                      type="button"
                      onClick={() => setShowPrivacy(true)}
                      data-testid="register-privacy-link"
                      className="text-[hsl(var(--primary))] hover:underline font-medium"
                    >
                      Privacy Policy
                    </button>
                  </label>
                </div>

                <motion.button
                  data-testid="register-form-submit-button"
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSendOtp}
                  disabled={sendingOtp || !agreedTerms}
                  className="w-full py-3 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-xl font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {sendingOtp ? (
                    <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Sending OTP...</>
                  ) : (
                    <>Send OTP <ArrowRight className="w-4 h-4" /></>
                  )}
                </motion.button>
              </motion.div>
            )}

            {/* Step 2 — OTP verification */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="text-center">
                  <Phone className="w-12 h-12 mx-auto text-[hsl(var(--primary))] mb-2" />
                  <h3 className="font-heading font-bold text-lg">Verify OTP</h3>
                  <p className="text-sm text-muted-foreground">
                    Enter the 6-digit code sent to {form.email}
                  </p>
                  {/* Dev hint — OTP is console.logged on server, not returned in response */}
                  {/* <p className="text-xs text-[hsl(var(--accent))] mt-1">
                    Check the server console for your OTP
                  </p> */}
                </div>

                <input
                  data-testid="register-otp-input"
                  type="text"
                  maxLength={6}
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full text-center text-2xl font-mono-num tracking-[0.5em] py-3 bg-[hsl(var(--muted))] border border-border/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] transition-all"
                />

                <div className="flex gap-2">
                  <button
                    onClick={() => { setStep(1); setOtp(''); }}
                    className="flex-1 py-3 bg-[hsl(var(--secondary))] text-foreground rounded-xl font-bold text-sm hover:opacity-80 flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleVerifyAndRegister}
                    disabled={verifyingOtp || registering || otp.length !== 6}
                    className="flex-1 py-3 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-xl font-bold text-sm hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {verifyingOtp || registering ? (
                      <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> {verifyingOtp ? 'Verifying...' : 'Registering...'}</>
                    ) : (
                      'Verify & Register'
                    )}
                  </motion.button>
                </div>

                {/* Resend OTP */}
                <p className="text-center text-xs text-muted-foreground">
                  Didn't receive it?{' '}
                  <button
                    type="button"
                    onClick={() => { setOtp(''); handleSendOtp(); }}
                    disabled={sendingOtp}
                    className="text-[hsl(var(--primary))] hover:underline font-medium disabled:opacity-50"
                  >
                    Resend OTP
                  </button>
                </p>
              </motion.div>
            )}

            {/* Step 3 — Success */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 10, stiffness: 200, delay: 0.2 }}
                  className="w-20 h-20 mx-auto rounded-full bg-[hsl(var(--primary))]/10 flex items-center justify-center"
                >
                  <Check className="w-10 h-10 text-[hsl(var(--primary))]" />
                </motion.div>

                <h3 className="font-heading font-bold text-xl">
                  Welcome to LudooVictory, {registeredUser?.full_name?.split(' ')[0]}!
                </h3>

                {/* Referral token balance earned */}
                <div className="bg-[hsl(var(--muted))] rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-center gap-2 text-[hsl(var(--primary))]">
                    <Coins className="w-5 h-5" />
                    <span className="font-mono-num text-2xl font-bold">
                      {referralTokensEarned}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    referral tokens credited
                    {form.referred_by_code && ' (signup + referral bonus)'}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Use them to spin the wheel and earn shopping tokens
                  </p>
                </div>

                <motion.button
                  data-testid="register-success-continue-button"
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/dashboard')}
                  className="w-full py-3 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-xl font-bold text-sm hover:opacity-90"
                >
                  Go to Dashboard
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-[hsl(var(--primary))] hover:underline font-medium">
            Login
          </Link>
        </p>
      </motion.div>

      {/* Privacy Policy Dialog */}
      <Dialog open={showPrivacy} onOpenChange={setShowPrivacy}>
        <DialogContent className="bg-[hsl(var(--card))] border-border/80 max-w-lg max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="font-heading flex items-center gap-2">
              <Shield className="w-5 h-5 text-[hsl(var(--primary))]" /> Privacy Policy
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[60vh] pr-4">
            <PrivacyContent />
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Terms Dialog */}
      <Dialog open={showTerms} onOpenChange={setShowTerms}>
        <DialogContent className="bg-[hsl(var(--card))] border-border/80 max-w-lg max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="font-heading flex items-center gap-2">
              <FileText className="w-5 h-5 text-[hsl(var(--accent))]" /> Terms & Conditions
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[60vh] pr-4">
            <TermsContent />
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Register;