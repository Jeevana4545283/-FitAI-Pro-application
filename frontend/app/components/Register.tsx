import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User as UserIcon, Mail, Lock, ArrowRight, Dumbbell } from 'lucide-react';
import toast from 'react-hot-toast';

interface RegisterProps {
  onNavigate: (view: 'login' | 'register' | 'forgot-password') => void;
}

export const Register: React.FC<RegisterProps> = ({ onNavigate }) => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    try {
      await register(name, email, password);
      toast.success('Account created successfully! Please complete your profile.');
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || 'Registration failed. Try again.';
      toast.error(errorMsg);
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
            <p className="text-xs text-white/40 mt-0.5">Register with your name, email and password</p>
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
                  placeholder="Your Full Name"
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
                  placeholder="your.email@example.com"
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
                  placeholder="Create password"
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
              className="mt-2 w-full bg-gold hover:bg-gold/90 text-[#0a0a0a] font-extrabold py-3.5 rounded-2xl text-sm transition-all shadow-lg shadow-gold/20 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
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
            className="text-gold font-bold hover:underline transition cursor-pointer"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};
