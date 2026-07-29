import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface ForgotPasswordProps {
  onNavigate: (view: 'login' | 'register' | 'forgot-password' | 'reset-password') => void;
}

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onNavigate }) => {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsSubmitting(true);
    try {
      await forgotPassword(email);
      setIsSubmitted(true);
      toast.success('Password reset instructions sent to your email.');
    } catch (err: any) {
      toast.error('Failed to send reset link. Please check your email address.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-[#0a0a0a] text-white relative overflow-y-auto">
      {/* Back button header */}
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
          {isSubmitted ? (
            <div className="flex flex-col items-center text-center gap-4 py-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-white">Reset Link Sent</h2>
                <p className="text-xs text-white/50 mt-1">
                  We've sent recovery instructions to <span className="text-gold font-semibold">{email}</span>.
                </p>
              </div>
              <button
                onClick={() => onNavigate('reset-password')}
                className="w-full mt-2 bg-gold hover:bg-gold/90 text-[#0a0a0a] font-extrabold py-3 rounded-2xl text-xs transition"
              >
                Proceed to Reset Password
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-lg font-extrabold text-white">Reset Password</h2>
                <p className="text-xs text-white/40 mt-0.5">
                  Enter your registered email address to receive password recovery instructions.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">Email Address</label>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-3.5 w-4 h-4 text-white/40" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="athlete@fitaix.com"
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
                      Send Reset Instructions <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      <div className="pb-4 text-center text-xs text-white/30">
        FitAIX Identity Recovery
      </div>
    </div>
  );
};
