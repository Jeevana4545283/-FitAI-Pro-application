import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ArrowRight, ShieldCheck, Dumbbell, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

interface LoginProps {
  onNavigate: (view: 'login' | 'register' | 'forgot-password') => void;
}

export const Login: React.FC<LoginProps> = ({ onNavigate }) => {
  const { login, googleLogin, quickGuestLogin } = useAuth();
  const [email, setEmail] = useState('athlete@fitaix.com');
  const [password, setPassword] = useState('password123');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleQuickGuest = async () => {
    setIsSubmitting(true);
    try {
      await quickGuestLogin();
      toast.success('Instant Guest Access Granted! Welcome to FitAIX.');
    } catch (err) {
      toast.error('Quick access failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    try {
      await googleLogin();
      toast.success('Signed in with Google');
    } catch (err: any) {
      toast.error('Google Sign-In failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login(email, password);
      toast.success('Welcome back to FitAIX!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login successful!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-[#0a0a0a] text-white relative overflow-y-auto">
      {/* Glow ambient background decoration */}
      <div className="absolute top-[-50px] left-1/2 -translate-x-1/2 w-64 h-64 bg-gold/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Header & Logo */}
      <div className="pt-8 flex flex-col items-center text-center gap-3">
        <div className="w-14 h-14 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold shadow-lg shadow-gold/10">
          <Dumbbell className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-wider uppercase bg-gradient-to-r from-gold via-white to-gold bg-clip-text text-transparent">
            FitAIX
          </h1>
          <p className="text-xs text-white/50 font-medium mt-1">Elite AI Fitness Application Platform</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="my-auto py-6">
        <div className="bg-app-card border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
          <div className="mb-5">
            <h2 className="text-lg font-extrabold text-white">Sign In to Your Account</h2>
            <p className="text-xs text-white/40 mt-0.5">Simple instant access — no strict credentials required</p>
          </div>

          {/* ⚡ 1-Tap Quick Guest Access Button */}
          <button
            type="button"
            onClick={handleQuickGuest}
            disabled={isSubmitting}
            className="w-full mb-4 bg-gradient-to-r from-[#FFB300] to-[#F5C400] text-black font-extrabold py-3.5 rounded-2xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-gold/25 flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-black" />
            <span>⚡ 1-Tap Instant Guest Login</span>
          </button>

          <div className="relative flex items-center justify-center my-3">
            <div className="border-t border-white/10 w-full"></div>
            <span className="bg-app-card px-2.5 text-[10px] text-white/40 uppercase font-bold">Or Email Login</span>
            <div className="border-t border-white/10 w-full"></div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">Email Address</label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 w-4 h-4 text-white/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="athlete@fitaix.com"
                  className="w-full bg-[#141414] border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/60 transition"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">Password</label>
                <button
                  type="button"
                  onClick={() => onNavigate('forgot-password')}
                  className="text-xs text-gold/80 hover:text-gold transition font-medium"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 w-4 h-4 text-white/40" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#141414] border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/60 transition"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full bg-gold hover:bg-gold/90 text-[#0a0a0a] font-extrabold py-3.5 rounded-2xl text-sm transition-all shadow-lg shadow-gold/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-[#0a0a0a] border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Sign In <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-1">
              <div className="border-t border-white/10 w-full"></div>
              <span className="bg-app-card px-3 text-[11px] text-white/40 uppercase font-semibold">Or</span>
              <div className="border-t border-white/10 w-full"></div>
            </div>

            {/* Google Sign-In Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isSubmitting}
              className="w-full bg-[#141414] hover:bg-white/5 border border-white/15 text-white font-bold py-3 rounded-2xl text-xs transition flex items-center justify-center gap-2.5 active:scale-98"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.15C3.26 21.3 7.31 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.29C.47 8.21 0 10.05 0 12s.47 3.79 1.29 5.42l3.99-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.58l3.99 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </form>
        </div>
      </div>

      {/* Footer Navigation Link */}
      <div className="pb-4 text-center">
        <p className="text-xs text-white/50">
          Don't have an account yet?{' '}
          <button
            onClick={() => onNavigate('register')}
            className="text-gold font-bold hover:underline transition"
          >
            Create Account
          </button>
        </p>
        <div className="flex items-center justify-center gap-1 mt-4 text-[10px] text-white/30">
          <ShieldCheck className="w-3.5 h-3.5 text-gold/60" />
          <span>256-Bit Encrypted Secure JWT Auth</span>
        </div>
      </div>
    </div>
  );
};
