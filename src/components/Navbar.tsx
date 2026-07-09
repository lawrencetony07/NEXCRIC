import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { BrainCircuit, Video, Sun, Moon, Menu, X, Home, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

export default function Navbar({ theme, toggleTheme }: NavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLandingPage = location.pathname === '/';

  // Navigation items shift contextually
  const landingNavItems = [
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Stats', href: '#stats' },
    { name: 'FAQ', href: '#faq' },
  ];

  const appNavItems = [
    { name: 'Dashboard', path: '/dashboard', icon: BrainCircuit },
    { name: 'Sessions Vault', path: '/sessions', icon: Video },
  ];

  const handleScrollToSection = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200/10 dark:border-white/5 bg-white/70 dark:bg-darkbg-900/70 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cricket-neon to-cricket-cyan flex items-center justify-center shadow-lg shadow-cricket-neon/10">
                <BrainCircuit className="w-5 h-5 text-darkbg-900" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                Cric<span className="text-cricket-neon font-black">Verse</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-cricket-neon/10 text-cricket-neon border border-cricket-neon/20">
                AI Coach
              </span>
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {isLandingPage ? (
              // Marketing Anchor Links
              landingNavItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleScrollToSection(item.href)}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors"
                >
                  {item.name}
                </button>
              ))
            ) : (
              // Application Panel Links
              <>
                <NavLink
                  to="/"
                  className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white"
                >
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </NavLink>
                <div className="h-4 w-px bg-slate-200 dark:bg-white/10 mx-2"></div>
                {appNavItems.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    className={({ isActive }) =>
                      `relative flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-205 ${
                        isActive
                          ? 'text-cricket-neon bg-slate-100 dark:bg-white/[0.04]'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/[0.02]'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon className="w-4 h-4" />
                        <span>{item.name}</span>
                        {isActive && (
                          <motion.div
                            layoutId="activeNavIndicator"
                            className="absolute bottom-0 left-4 right-4 h-0.5 bg-cricket-neon"
                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
              </>
            )}
          </div>

          {/* Actions: Enter App Button + Theme Toggle + Menu */}
          <div className="flex items-center space-x-3">
            {isLandingPage && (
              <button
                onClick={() => navigate('/login')}
                className="hidden md:flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-cricket-neon text-darkbg-900 hover:bg-cricket-neon/90 transition-all duration-200 shadow-md shadow-cricket-neon/10"
              >
                <span>Enter Cockpit</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Theme Toggle Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </motion.button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02] text-slate-600 dark:text-slate-400"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-200/10 dark:border-white/5 bg-white dark:bg-darkbg-800 transition-colors"
          >
            <div className="px-2 pt-2 pb-4 space-y-1">
              {isLandingPage ? (
                landingNavItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => handleScrollToSection(item.href)}
                    className="w-full text-left flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-150 dark:hover:bg-white/[0.02]"
                  >
                    <span>{item.name}</span>
                  </button>
                ))
              ) : (
                <>
                  <NavLink
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium text-slate-500 hover:bg-slate-100 dark:hover:bg-white/[0.02]"
                  >
                    <Home className="w-5 h-5" />
                    <span>Home</span>
                  </NavLink>
                  {appNavItems.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                          isActive
                            ? 'text-cricket-neon bg-slate-100 dark:bg-white/[0.04]'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/[0.02]'
                        }`
                      }
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </NavLink>
                  ))}
                </>
              )}

              {isLandingPage && (
                <div className="p-4 border-t border-slate-200/50 dark:border-white/5 mt-2">
                  <button
                    onClick={() => { setMobileMenuOpen(false); navigate('/login'); }}
                    className="w-full py-2.5 rounded-xl text-sm font-semibold bg-cricket-neon text-darkbg-900 hover:bg-cricket-neon/90 transition-colors flex items-center justify-center space-x-1.5"
                  >
                    <span>Enter Cockpit</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
