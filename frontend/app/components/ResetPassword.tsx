import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, ArrowLeft, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface ResetPasswordProps {
  onNavigate: (view: 'login' | 'register' | 'forgot-password' | 'reset-password') => void;
}

export const ResetPassword: React.FC<ResetPasswordProps> = ({ onNavigate }) => {
  const { resetPassword } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      toast.error('Please enter and confirm your new password');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPassword(password);
      toast.success('Password updated successfully! Please sign in.');
      onNavigate('login');
    } catch (err: any) {
      toast.error('Failed to reset password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-[#0a0a0a] text-white relative overflow-y-auto">
      {/* Header */}
      <div className="pt-4 flex items-center">
        <button
          onClick={() => onNavigate('login')}
          className="flex items-center gap-2 text-xs text-white/60 hover:text-gold transition font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Sign In
        </button>
      </div>

      {/* Card */}
      <div className="my-auto py-6">
        <div className="bg-app-card border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
          <div className="mb-6">
            <h2 className="text-lg font-extrabold text-white">Create New Password</h2>
            <p className="text-xs text-white/40 mt-0.5">
              Enter your new secure password below to complete reset.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">New Password</label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 w-4 h-4 text-white/40" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full bg-[#141414] border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-gold/60 transition"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">Confirm New Password</label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 w-4 h-4 text-white/40" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full bg-[#141414] border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-gold/60 transition"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full bg-gold hover:bg-gold/90 text-[#0a0a0a] font-extrabold py-3.5 rounded-2xl text-sm transition-all shadow-lg shadow-gold/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-[#0a0a0a] border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Update Password <CheckCircle2 className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <div className="pb-4 text-center text-xs text-white/30">
        FitAIX Identity Security
      </div>
    </div>
  );
};
