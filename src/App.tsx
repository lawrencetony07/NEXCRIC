import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import TargetCursor from './components/TargetCursor';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Sessions from './pages/Sessions';
import Analyzer from './pages/Analyzer';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import { mockSessions, Session } from './api/coachingApi';
import GridScan from './components/GridScan';

export default function App() {
  const [sessions, setSessions] = useState<Session[]>(() => {
    const cached = localStorage.getItem('cricverse_sessions');
    return cached ? JSON.parse(cached) : mockSessions;
  });

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const cached = localStorage.getItem('cricverse_theme');
    if (cached === 'light' || cached === 'dark') return cached;
    // Default to dark theme for premium developer aesthetic
    return 'dark';
  });

  // Keep localStorage updated when sessions change
  useEffect(() => {
    localStorage.setItem('cricverse_sessions', JSON.stringify(sessions));
  }, [sessions]);

  // Handle theme transitions
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
    localStorage.setItem('cricverse_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleAddSession = (newSession: Session) => {
    setSessions(prev => [newSession, ...prev]);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 dark:bg-darkbg-900 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300 relative overflow-x-hidden">
        
        {/* Futuristic GridScan WebGL Background */}
        <div className="fixed inset-0 pointer-events-none z-0 opacity-40 dark:opacity-30">
          <GridScan
            sensitivity={0.55}
            lineThickness={1}
            linesColor={theme === 'dark' ? '#2c2738' : '#e2e8f0'}
            gridScale={0.1}
            scanColor="#10b981"
            scanOpacity={0.4}
            enablePost={true}
            bloomIntensity={0.6}
            chromaticAberration={0.002}
            noiseIntensity={0.01}
            lineJitter={0.1}
            scanGlow={0.5}
            scanSoftness={2}
            enableWebcam={false}
            showPreview={false}
          />
        </div>

        {/* Global Custom Cursor */}
        <TargetCursor 
          targetSelector="a, button, [role='button'], .cursor-target"
          spinDuration={2}
          hideDefaultCursor={true}
          parallaxOn={true}
          cursorColor="#10b981"
          cursorColorOnTarget="#00f0ff"
        />

        {/* Navigation Bar */}
        <Navbar theme={theme} toggleTheme={toggleTheme} />

        {/* Page Container */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/dashboard" element={<Dashboard sessions={sessions} />} />
            <Route path="/sessions" element={<Sessions sessions={sessions} onAddSession={handleAddSession} />} />
            <Route path="/analyzer/:sessionId" element={<Analyzer sessions={sessions} />} />
          </Routes>
        </main>

        {/* Futuristic Dashboard Footer */}
        <footer className="border-t border-slate-200/50 dark:border-white/5 py-8 bg-slate-100 dark:bg-[#03050a] text-slate-500 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
            
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-white/5 border border-slate-300 dark:border-white/10 flex items-center justify-center font-black text-slate-700 dark:text-slate-300 text-sm">
                CV
              </div>
              <span className="font-extrabold text-slate-800 dark:text-slate-400">
                Cric<span className="text-cricket-neon">Verse</span>
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-600">v2.0.0 (AI Edition)</span>
            </div>

            <p className="text-center md:text-left leading-relaxed">
              &copy; 2026 CricVerse Intelligence. Advanced Joint Posture Annotations and Biomechanical Speed Analyzers. All rights reserved.
            </p>

            <div className="flex space-x-4">
              <span className="hover:text-slate-800 dark:hover:text-slate-300 cursor-pointer">AI Methodology</span>
              <span className="hover:text-slate-800 dark:hover:text-slate-300 cursor-pointer">Biomechanical Models</span>
              <span className="hover:text-slate-800 dark:hover:text-slate-300 cursor-pointer">API Status</span>
            </div>

          </div>
        </footer>

      </div>
    </BrowserRouter>
  );
}
