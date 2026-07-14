import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLoginMutation } from '@/store/apiSlice';
import { setCredentials } from '@/store/authSlice';
import { toast } from 'sonner';
import { Eye, EyeOff, LogIn, Mail, Lock } from 'lucide-react';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!identifier || !password) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      const res = await login({ identifier, password }).unwrap();

      // Backend returns { message, token, user }
      // user shape: { id, full_name, username, email, mobile, referral_code,
      //               role, status, is_mobile_verified,
      //               referral_token_balance, shopping_token_balance }
      dispatch(setCredentials({
        token: res.token,
        user: res.user,
      }));

      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (err) {
      // Our backend always returns { message } on errors
      toast.error(err.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_20%_10%,rgba(197,143,34,0.18),transparent_55%),radial-gradient(700px_circle_at_80%_20%,rgba(31,38,84,0.14),transparent_55%)]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative"
      >
        {/* ── Logo ──────────────────────────────────────────────────── */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent))] flex items-center justify-center">
              <span className="text-lg font-bold text-[hsl(var(--primary-foreground))]">D</span>
            </div>
            <span className="font-heading font-bold text-2xl">LudooVictory</span>
          </Link>
          <h1 className="font-heading text-2xl font-bold">Welcome Back</h1>
          <p className="text-muted-foreground text-sm mt-1">Login to continue earning</p>
        </div>

        {/* ── Form Card ─────────────────────────────────────────────── */}
        <div className="bg-white/90 rounded-2xl border border-border/80 shadow-[0_18px_45px_rgba(31,38,84,0.12)] p-6">
          <form
            onSubmit={handleLogin}
            data-testid="login-form"
            className="space-y-4"
          >
            {/* Identifier */}
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <input
                data-testid="login-identifier"
                placeholder="Email or Mobile Number"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[hsl(var(--muted))] border border-border/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] transition-all"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <input
                data-testid="login-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

            {/* Forgot password */}
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-xs text-[hsl(var(--primary))] hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <motion.button
              data-testid="login-submit-button"
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-xl font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading
                ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Logging in...</>
                : <><LogIn className="w-4 h-4" /> Login</>
              }
            </motion.button>
          </form>
        </div>

        {/* ── Footer ────────────────────────────────────────────────── */}
        <p className="text-center text-sm text-muted-foreground mt-4">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-[hsl(var(--primary))] hover:underline font-medium"
          >
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;