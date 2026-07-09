import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, UserPlus, Check } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Validation UI flags
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [termsError, setTermsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dynamic strength bars
  const calculateStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const strengthScore = calculateStrength(password);

  const getStrengthLabel = () => {
    if (!password) return { text: 'Empty', color: 'bg-slate-200 dark:bg-white/5' };
    if (strengthScore <= 1) return { text: 'Weak', color: 'bg-red-500' };
    if (strengthScore <= 3) return { text: 'Fair', color: 'bg-amber-500' };
    return { text: 'Strong', color: 'bg-cricket-neon' };
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      valid = false;
    } else {
      setEmailError('');
    }

    // Password validation
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      valid = false;
    } else {
      setPasswordError('');
    }

    // Confirm password
    if (password !== confirmPassword) {
      setConfirmError('Passwords do not match');
      valid = false;
    } else {
      setConfirmError('');
    }

    // Terms
    if (!agreeTerms) {
      setTermsError(true);
      valid = false;
    } else {
      setTermsError(false);
    }

    if (valid && name) {
      setIsSubmitting(true);
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
      className="flex-1 flex items-center justify-center py-10 px-4 relative min-h-[85vh]"
    >
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-cricket-cyan/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="bg-white/80 dark:bg-darkbg-800/80 backdrop-blur-xl border border-slate-200 dark:border-white/5 shadow-2xl rounded-3xl p-8 max-w-md w-full relative z-10 transition-colors">
        
        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cricket-cyan/10 border border-cricket-cyan/20 text-cricket-cyan mb-2">
            <UserPlus className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black tracking-tight dark:text-white">Create Account</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Sign up to get instant posture evaluations
          </p>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                required
                placeholder="Virat Kohli"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-1 focus:ring-cricket-cyan focus:border-cricket-cyan transition-all duration-200"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 pointer-events-none" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-slate-50/50 dark:bg-white/5 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-1 focus:ring-cricket-cyan focus:border-cricket-cyan transition-all duration-200 ${
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
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-10 pr-10 py-3 rounded-xl border bg-slate-50/50 dark:bg-white/5 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-1 focus:ring-cricket-cyan focus:border-cricket-cyan transition-all duration-200 ${
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
            {/* Password Strength Indicator */}
            {password && (
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between items-center text-[10px] font-bold">
                  <span className="text-slate-400">Strength:</span>
                  <span className={strengthScore >= 3 ? 'text-cricket-neon' : strengthScore >= 2 ? 'text-amber-500' : 'text-red-500'}>
                    {getStrengthLabel().text}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1 h-1">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-full rounded-full transition-all duration-300 ${
                        i < strengthScore ? getStrengthLabel().color : 'bg-slate-200 dark:bg-white/5'
                      }`}
                    ></div>
                  ))}
                </div>
              </div>
            )}
            {passwordError && (
              <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-[11px] font-semibold text-red-500 pl-1">
                {passwordError}
              </motion.p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 pointer-events-none" />
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-slate-50/50 dark:bg-white/5 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-1 focus:ring-cricket-cyan focus:border-cricket-cyan transition-all duration-200 ${
                  confirmError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-200 dark:border-white/5'
                }`}
              />
            </div>
            {confirmError && (
              <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-[11px] font-semibold text-red-500 pl-1">
                {confirmError}
              </motion.p>
            )}
          </div>

          {/* Terms & Conditions Checkbox */}
          <div className="flex items-start space-x-2 pt-1.5">
            <button
              type="button"
              onClick={() => setAgreeTerms(!agreeTerms)}
              className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                agreeTerms ? 'bg-cricket-cyan border-cricket-cyan text-slate-900' : 'border-slate-300 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/20'
              }`}
            >
              {agreeTerms && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </button>
            <span className="text-[11px] leading-tight text-slate-500 dark:text-slate-400 font-semibold select-none">
              I agree to the{' '}
              <span className="text-cricket-cyan hover:underline cursor-pointer">Terms of Service</span>{' '}
              and{' '}
              <span className="text-cricket-cyan hover:underline cursor-pointer">Privacy Policy</span>.
            </span>
          </div>
          {termsError && (
            <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-[11px] font-semibold text-red-500 pl-1">
              You must agree to the Terms of Service to continue
            </motion.p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center space-x-2 py-3.5 rounded-xl font-bold bg-cricket-cyan text-slate-900 hover:bg-cricket-cyan/90 hover:shadow-lg hover:shadow-cricket-cyan/15 active:scale-[0.98] disabled:opacity-50 transition-all duration-200"
          >
            <span>{isSubmitting ? 'Registering Account...' : 'Create Account'}</span>
            {!isSubmitting && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        {/* Bottom Redirect */}
        <p className="text-center text-xs font-semibold text-slate-500 dark:text-slate-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-cricket-cyan hover:underline">
            Log in
          </Link>
        </p>

      </div>
    </motion.div>
  );
}
