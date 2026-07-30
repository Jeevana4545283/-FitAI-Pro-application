import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ArrowRight, ShieldCheck, Dumbbell } from 'lucide-react';
import toast from 'react-hot-toast';

interface LoginProps {
  onNavigate: (view: 'login' | 'register' | 'forgot-password') => void;
}

export const Login: React.FC<LoginProps> = ({ onNavigate }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || 'Invalid email or password.';
      toast.error(errorMsg);
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
            <p className="text-xs text-white/40 mt-0.5">Enter your email and password to log in</p>
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
                  placeholder="your.email@example.com"
                  className="w-full bg-[#141414] border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/60 transition"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">Password</label>
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
              className="mt-2 w-full bg-gold hover:bg-gold/90 text-[#0a0a0a] font-extrabold py-3.5 rounded-2xl text-sm transition-all shadow-lg shadow-gold/20 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-[#0a0a0a] border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Sign In <ArrowRight className="w-4 h-4" />
                </>
              )}
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
            className="text-gold font-bold hover:underline transition cursor-pointer"
          >
            Create Account
          </button>
        </p>
        <div className="flex items-center justify-center gap-1 mt-4 text-[10px] text-white/30">
          <ShieldCheck className="w-3.5 h-3.5 text-gold/60" />
          <span>PostgreSQL Database Authentication</span>
        </div>
      </div>
    </div>
  );
};
