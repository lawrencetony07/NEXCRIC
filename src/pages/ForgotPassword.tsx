import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, KeyRound, CheckCircle2 } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
      setIsSubmitting(true);
      
      // Simulate API mail dispatch
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSent(true);
      }, 1500);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="flex-1 flex items-center justify-center py-10 px-4 relative min-h-[75vh]"
    >
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="bg-white/80 dark:bg-darkbg-800/80 backdrop-blur-xl border border-slate-200 dark:border-white/5 shadow-2xl rounded-3xl p-8 max-w-md w-full relative z-10 transition-colors">
        
        <AnimatePresence mode="wait">
          {!isSent ? (
            <motion.div
              key="request-form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Header */}
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-500 mb-2">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black tracking-tight dark:text-white">Reset Password</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 px-2 leading-relaxed">
                  Enter your email address and we'll send you a link to reset your account credentials.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 pointer-events-none" />
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full pl-10.5 pr-4 py-3 rounded-xl border bg-slate-50/50 dark:bg-white/5 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 ${
                        emailError ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-white/5'
                      }`}
                    />
                  </div>
                  {emailError && (
                    <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-[11px] font-semibold text-red-500 pl-1">
                      {emailError}
                    </motion.p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center space-x-2 py-3.5 rounded-xl font-bold bg-purple-500 text-white hover:bg-purple-600 hover:shadow-lg hover:shadow-purple-500/15 active:scale-[0.98] disabled:opacity-50 transition-all duration-200"
                >
                  <span>{isSubmitting ? 'Sending Link...' : 'Send Reset Link'}</span>
                </button>
              </form>

              {/* Back to login */}
              <div className="text-center pt-2">
                <Link to="/login" className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors">
                  <ArrowLeft className="w-4.5 h-4.5" />
                  <span>Back to login</span>
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success-message"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, type: 'spring', stiffness: 120 }}
              className="text-center space-y-6 py-4"
            >
              {/* Success Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cricket-neon/10 text-cricket-neon border border-cricket-neon/20">
                <CheckCircle2 className="w-10 h-10 stroke-[1.5]" />
              </div>

              {/* Text */}
              <div className="space-y-2">
                <h2 className="text-2xl font-black tracking-tight dark:text-white">Check Your Inbox</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed font-semibold">
                  We've sent a recovery link to <span className="text-slate-800 dark:text-white font-bold">{email}</span>. Click the link to choose a new password.
                </p>
              </div>

              {/* Back to login button */}
              <div className="pt-4">
                <Link
                  to="/login"
                  className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
                >
                  <ArrowLeft className="w-4.5 h-4.5" />
                  <span>Return to Login</span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
}
