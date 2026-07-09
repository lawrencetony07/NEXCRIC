import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Validation states
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (val: string) => {
    setEmail(val);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!val) {
      setEmailError('Email is required');
    } else if (!emailRegex.test(val)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  const validatePassword = (val: string) => {
    setPassword(val);
    if (!val) {
      setPasswordError('Password is required');
    } else if (val.length < 6) {
      setPasswordError('Password must be at least 6 characters');
    } else {
      setPasswordError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    validateEmail(email);
    validatePassword(password);

    if (email && password && !emailError && !passwordError) {
      setIsSubmitting(true);
      // Simulate API verification call
      setTimeout(() => {
        setIsSubmitting(false);
        navigate('/dashboard');
      }, 1500);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="flex-1 flex items-center justify-center py-10 px-4 relative min-h-[80vh]"
    >
      {/* Decorative glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-cricket-neon/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="bg-white/80 dark:bg-darkbg-800/80 backdrop-blur-xl border border-slate-200 dark:border-white/5 shadow-2xl rounded-3xl p-8 max-w-md w-full relative z-10 transition-colors">
        
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cricket-neon/10 border border-cricket-neon/20 text-cricket-neon mb-2">
            <ShieldCheck className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-2xl font-black tracking-tight dark:text-white">Welcome Back</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Log in to access your biomechanical annotations
          </p>
        </div>

        {/* OAuth Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button type="button" className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 text-xs font-bold dark:text-slate-300 transition-all duration-200">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Google</span>
          </button>

          <button type="button" className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 text-xs font-bold dark:text-slate-300 transition-all duration-200">
            <svg className="w-4 h-4 fill-current text-slate-800 dark:text-white" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.197 22 16.44 22 12.017 22 6.484 17.522 2 12 2z"/>
            </svg>
            <span>GitHub</span>
          </button>
        </div>

        <div className="relative flex items-center justify-center my-6">
          <div className="absolute w-full border-t border-slate-200 dark:border-white/5"></div>
          <span className="relative px-3 bg-white dark:bg-[#0b0f19] text-[10px] uppercase font-bold text-slate-400 tracking-wider transition-colors">
            Or continue with
          </span>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 pointer-events-none" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => validateEmail(e.target.value)}
                className={`w-full pl-10.5 pr-4 py-3 rounded-xl border bg-slate-50/50 dark:bg-white/5 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-1 focus:ring-cricket-neon focus:border-cricket-neon transition-all duration-200 ${
                  emailError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-200 dark:border-white/5'
                }`}
              />
            </div>
            {emailError && (
              <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-[11px] font-semibold text-red-500 pl-1">
                {emailError}
              </motion.p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Password</label>
              <Link to="/forgot-password" className="text-xs font-semibold text-cricket-neon hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => validatePassword(e.target.value)}
                className={`w-full pl-10.5 pr-10 py-3 rounded-xl border bg-slate-50/50 dark:bg-white/5 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-1 focus:ring-cricket-neon focus:border-cricket-neon transition-all duration-200 ${
                  passwordError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-200 dark:border-white/5'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {passwordError && (
              <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-[11px] font-semibold text-red-500 pl-1">
                {passwordError}
              </motion.p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center space-x-2 py-3.5 rounded-xl font-bold bg-cricket-neon text-darkbg-900 hover:bg-cricket-neon/90 hover:shadow-lg hover:shadow-cricket-neon/15 active:scale-[0.98] disabled:opacity-50 transition-all duration-200"
          >
            <span>{isSubmitting ? 'Verifying Account...' : 'Continue to Cockpit'}</span>
            {!isSubmitting && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        {/* Bottom Redirect */}
        <p className="text-center text-xs font-semibold text-slate-500 dark:text-slate-400 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-cricket-neon hover:underline">
            Sign up free
          </Link>
        </p>

      </div>
    </motion.div>
  );
}
