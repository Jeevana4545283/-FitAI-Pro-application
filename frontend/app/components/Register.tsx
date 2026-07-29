import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User as UserIcon, Mail, Lock, ArrowRight, Dumbbell, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

interface RegisterProps {
  onNavigate: (view: 'login' | 'register' | 'forgot-password') => void;
}

export const Register: React.FC<RegisterProps> = ({ onNavigate }) => {
  const { register, quickGuestLogin } = useAuth();
  const [name, setName] = useState('Athlete');
  const [email, setEmail] = useState('athlete@fitaix.com');
  const [password, setPassword] = useState('password123');
  const [confirmPassword, setConfirmPassword] = useState('password123');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await register(name, email, password);
      toast.success('Account created successfully! Welcome to FitAIX.');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Welcome to FitAIX!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-[#0a0a0a] text-white relative overflow-y-auto">
      {/* Background Ambient Blur */}
      <div className="absolute top-[-50px] left-1/2 -translate-x-1/2 w-64 h-64 bg-gold/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="pt-6 flex flex-col items-center text-center gap-2">
        <div className="w-12 h-12 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold shadow-lg shadow-gold/10">
          <Dumbbell className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-black tracking-wider uppercase bg-gradient-to-r from-gold via-white to-gold bg-clip-text text-transparent">
          FitAIX
        </h1>
      </div>

      {/* Form Card */}
      <div className="my-auto py-4">
        <div className="bg-app-card border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
          <div className="mb-4">
            <h2 className="text-lg font-extrabold text-white">Create Account</h2>
            <p className="text-xs text-white/40 mt-0.5">Simple instant access — no strict credentials required</p>
          </div>

          {/* ⚡ 1-Tap Quick Guest Access Button */}
          <button
            type="button"
            onClick={handleQuickGuest}
            disabled={isSubmitting}
            className="w-full mb-3 bg-gradient-to-r from-[#FFB300] to-[#F5C400] text-black font-extrabold py-3.5 rounded-2xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-gold/25 flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-black" />
            <span>⚡ 1-Tap Instant Guest Access</span>
          </button>

          <div className="relative flex items-center justify-center my-2">
            <div className="border-t border-white/10 w-full"></div>
            <span className="bg-app-card px-2 text-[10px] text-white/40 uppercase font-bold">Or Standard Sign Up</span>
            <div className="border-t border-white/10 w-full"></div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            {/* Full Name */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">Full Name</label>
              <div className="relative flex items-center">
                <UserIcon className="absolute left-3.5 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Mercer"
                  className="w-full bg-[#141414] border border-white/10 rounded-2xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-gold/60 transition"
                  required
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">Email Address</label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 w-4 h-4 text-white/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="athlete@fitaix.com"
                  className="w-full bg-[#141414] border border-white/10 rounded-2xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-gold/60 transition"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">Password</label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 w-4 h-4 text-white/40" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full bg-[#141414] border border-white/10 rounded-2xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-gold/60 transition"
                  required
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">Confirm Password</label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 w-4 h-4 text-white/40" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  className="w-full bg-[#141414] border border-white/10 rounded-2xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-gold/60 transition"
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
                  Register Now <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Footer Link */}
      <div className="pb-4 text-center">
        <p className="text-xs text-white/50">
          Already registered?{' '}
          <button
            onClick={() => onNavigate('login')}
            className="text-gold font-bold hover:underline transition"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};
