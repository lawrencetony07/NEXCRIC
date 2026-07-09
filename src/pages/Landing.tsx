import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BrainCircuit, 
  ArrowRight, 
  Cpu, 
  Activity, 
  Users, 
  TrendingUp, 
  Play, 
  CheckCircle2, 
  Plus, 
  Minus,
  Sparkles,
  ChevronDown,
  Quote,
  Target,
  ShieldCheck,
  Video
} from 'lucide-react';
import { getSkeletalFrame, Skeleton } from '../api/coachingApi';


export default function Landing() {
  const navigate = useNavigate();
  
  // Skeletal simulation states for Hero illustration
  const [heroFrame, setHeroFrame] = useState(0);
  const heroCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // FAQ state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Play animation loop in hero
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const updateFrame = (time: number) => {
      const delta = time - lastTime;
      const increment = (delta / 1000) * 15 * 3; // speed factor
      setHeroFrame(prev => (prev + increment) % 100);
      lastTime = time;
      animationFrameId = requestAnimationFrame(updateFrame);
    };

    animationFrameId = requestAnimationFrame(updateFrame);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Draw Biomechanical Crease & Ball Tracking in hero illustration
  useEffect(() => {
    const canvas = heroCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // 1. Draw grid background lines
    ctx.strokeStyle = 'rgba(163, 230, 53, 0.015)';
    ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 20) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(width, i); ctx.stroke();
    }

    // 2. Draw 3D Perspective Pitch Grid
    // Vanishing point is at (10, 80)
    const vpX = 10;
    const vpY = 80;
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 1;
    
    // Pitch edges converging to vp
    ctx.beginPath();
    ctx.moveTo(vpX, vpY); ctx.lineTo(260, height - 10);
    ctx.moveTo(vpX, vpY); ctx.lineTo(130, height - 10);
    ctx.stroke();

    // Crease lines (horizontal lines in perspective)
    const creaseYCoords = [110, 140, 180, 230, 270];
    creaseYCoords.forEach(cy => {
      const dy = height - 10 - vpY;
      const lx = vpX + (cy - vpY) * (130 - vpX) / dy;
      const rx = vpX + (cy - vpY) * (260 - vpX) / dy;
      
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.beginPath();
      ctx.moveTo(lx, cy);
      ctx.lineTo(rx, cy);
      ctx.stroke();
    });

    // 3. Draw Stumps (Wickets) at the far end
    const stumpY = 120;
    const dy = height - 10 - vpY;
    const sLx = vpX + (stumpY - vpY) * (130 - vpX) / dy;
    const sRx = vpX + (stumpY - vpY) * (260 - vpX) / dy;
    const sCx = (sLx + sRx) / 2; // center of stumps
    
    // Draw three vertical wickets
    ctx.strokeStyle = '#00f0ff'; // Neon Cyan stumps
    ctx.lineWidth = 2;
    const stumpSpacing = 4;
    const stumpHeight = 22;
    for (let offset = -1; offset <= 1; offset++) {
      const sx = sCx + offset * stumpSpacing;
      ctx.beginPath();
      ctx.moveTo(sx, stumpY);
      ctx.lineTo(sx, stumpY - stumpHeight);
      ctx.stroke();
    }
    // Draw bails
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(sCx - stumpSpacing - 1, stumpY - stumpHeight);
    ctx.lineTo(sCx + stumpSpacing + 1, stumpY - stumpHeight);
    ctx.stroke();

    // 4. Calculate Ball Trajectory
    const t = heroFrame;
    
    const rX = 250, rY = 60;
    const bX = 130, bY = 200;
    const fX = sCx, fY = stumpY - 6;

    let ballX = 0;
    let ballY = 0;

    // Draw the full trajectory path as a faint glowing line
    ctx.strokeStyle = 'rgba(163, 230, 53, 0.15)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(rX, rY);
    for (let step = 0; step <= 100; step++) {
      let px = 0;
      let py = 0;
      if (step <= 60) {
        const u = step / 60;
        px = rX - u * (rX - bX);
        py = rY + u * (bY - rY) - 35 * Math.sin(Math.PI * u);
      } else {
        const u = (step - 60) / 40;
        px = bX - u * (bX - fX);
        py = bY - u * (bY - fY) - 15 * Math.sin(Math.PI * u);
      }
      ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Calculate current ball coordinates
    if (t <= 60) {
      const u = t / 60;
      ballX = rX - u * (rX - bX);
      ballY = rY + u * (bY - rY) - 35 * Math.sin(Math.PI * u);
    } else {
      const u = (t - 60) / 40;
      ballX = bX - u * (bX - fX);
      ballY = bY - u * (bY - fY) - 15 * Math.sin(Math.PI * u);
    }

    // 5. Draw bounce impact ring (shockwave)
    if (t > 60) {
      const age = t - 60;
      const maxAge = 25;
      if (age < maxAge) {
        const alpha = (1 - age / maxAge) * 0.6;
        ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(bX, bY, age * 1.2, age * 0.4, -Math.PI / 12, 0, 2 * Math.PI);
        ctx.stroke();
      }
    }

    // 6. Draw Ball and glowing tails
    const trailLen = 8;
    for (let i = 1; i <= trailLen; i++) {
      const trailT = Math.max(0, t - i * 1.5);
      let tx = 0, ty = 0;
      if (trailT <= 60) {
        const u = trailT / 60;
        tx = rX - u * (rX - bX);
        ty = rY + u * (bY - rY) - 35 * Math.sin(Math.PI * u);
      } else {
        const u = (trailT - 60) / 40;
        tx = bX - u * (bX - fX);
        ty = bY - u * (bY - fY) - 15 * Math.sin(Math.PI * u);
      }
      const alpha = (1 - i / trailLen) * 0.35;
      ctx.fillStyle = `rgba(163, 230, 53, ${alpha})`;
      ctx.beginPath();
      ctx.arc(tx, ty, 4 - i * 0.25, 0, 2 * Math.PI);
      ctx.fill();
    }

    // Draw active ball
    ctx.fillStyle = '#a3e635'; // Neon Green
    ctx.beginPath();
    ctx.arc(ballX, ballY, 4.5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(ballX, ballY, 2, 0, 2 * Math.PI);
    ctx.fill();

    // 7. Telemetry Vector Callout Box
    const boxX = ballX + 25;
    const boxY = ballY - 35;
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(ballX, ballY);
    ctx.lineTo(boxX - 5, boxY + 12);
    ctx.stroke();

    ctx.fillStyle = 'rgba(6, 8, 15, 0.85)';
    ctx.strokeStyle = 'rgba(163, 230, 53, 0.2)';
    ctx.lineWidth = 1;
    ctx.strokeRect(boxX - 5, boxY - 5, 80, 32);
    ctx.fillRect(boxX - 5, boxY - 5, 80, 32);

    ctx.font = '7.5px monospace';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`VELOCITY: 142.8km/h`, boxX, boxY + 5);
    ctx.fillStyle = '#a3e635';
    ctx.fillText(`BOUNCE D: 5.82m`, boxX, boxY + 14);
    ctx.fillStyle = '#00f0ff';
    ctx.fillText(`DEVIATN: -1.4°`, boxX, boxY + 23);

    // 8. HUD Info overlays
    ctx.font = '8px monospace';
    
    // Top Left: Camera Status
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fillText("HAWK_EYE: CALIBRATED", 14, 18);
    ctx.fillStyle = '#00f0ff';
    ctx.beginPath();
    ctx.arc(8, 15, 2, 0, 2 * Math.PI);
    ctx.fill();

    // Top Right: Model Match
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.textAlign = 'right';
    ctx.fillText("SEAM_ANGLE: +3.2°", width - 10, 18);

    // Bottom Left: FPS
    ctx.textAlign = 'left';
    ctx.fillText("RELEASE HT: 2.15m", 10, height - 12);

    // Bottom Right: Lock Status
    ctx.fillStyle = '#a3e635';
    ctx.textAlign = 'right';
    ctx.fillText("LINE: GOOD LENGTH", width - 10, height - 12);
    ctx.textAlign = 'left'; // Reset

  }, [heroFrame]);

  // FAQ data
  const faqs = [
    {
      q: "How does the AI analyze my technique?",
      a: "Our system uses advanced computer vision pose estimation models (similar to OpenPose and MediaPipe) to track 14 key body joints in your batting or bowling video. It computes your relative joint angles (e.g. elbow extension, knee brace) frame-by-frame and compares them against optimized biomechanical limits."
    },
    {
      q: "Do I need special sensors or cameras?",
      a: "No! All you need is a standard smartphone camera. Simply record your batting or bowling action at a side-on or front-on angle (ideally at 60 FPS or higher slow-motion) and upload the video file directly to the platform."
    },
    {
      q: "Can I use this for both batting and bowling?",
      a: "Yes. CricVerse features dedicated neural mapping models for both batting techniques (such as cover drives, pull shots, and defensive stances) and bowling actions (seam release, outswing, run-up deceleration, and bracing mechanics)."
    },
    {
      q: "Who designed the optimal biomechanical models?",
      a: "Our posture benchmarks were developed in collaboration with elite biomechanists, national sports academies, and professional cricketers (including coaches like Brett Lee and Kumar Sangakkara) to map safe, high-velocity, and consistent posture structures."
    }
  ];

  return (
    <div className="space-y-24 pb-16">
      
      {/* 2. Hero Section */}
      <section className="relative pt-12 md:pt-20 overflow-hidden">
        {/* Decorative background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cricket-neon/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-cricket-cyan/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative">
          {/* Hero text (7/12 width) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Startup Funding badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-cricket-neon/20 bg-cricket-neon/10 text-cricket-neon text-[11px] font-black uppercase tracking-widest"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Announcing $4.2M Seed Round to Build Cricket's Brain</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-slate-900 dark:text-white"
            >
              The AI Co-Pilot for <span className="bg-gradient-to-r from-cricket-neon to-cricket-cyan bg-clip-text text-transparent">Cricket Technique</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium"
            >
              Upload your batting or bowling clips. CricVerse extracts skeletal joint data, audits your form in slow-mo, and delivers instant technique scores. Built like Vercel, tuned like a pro.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4"
            >
              <button
                onClick={() => navigate('/login')}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-3.5 rounded-xl font-bold bg-cricket-neon text-darkbg-900 hover:bg-cricket-neon/90 shadow-lg shadow-cricket-neon/15 hover:shadow-cricket-neon/25 transition-all duration-200"
              >
                <span>Enter Player Cockpit</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => navigate('/sessions')}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-3.5 rounded-xl font-bold border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.03] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/10 transition-all duration-200"
              >
                <Video className="w-4 h-4" />
                <span>Try Instant Upload</span>
              </button>
            </motion.div>

          </div>

          {/* Hero visual widget (5/12 width) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 flex justify-center"
          >
            <div className="relative w-full max-w-[360px] p-5 rounded-3xl border border-slate-200 dark:border-white/5 bg-white dark:bg-darkbg-700 shadow-2xl overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-cricket-neon/5 via-transparent to-transparent opacity-50"></div>
              
              {/* Header HUD */}
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  Live Engine Simulator
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-cricket-neon animate-ping"></span>
              </div>

              {/* Live Canvas Mockup */}
              <div className="rounded-2xl bg-[#06080F] border border-white/5 aspect-square flex items-center justify-center p-3 relative overflow-hidden">
                <canvas 
                  ref={heroCanvasRef} 
                  width={300} 
                  height={300} 
                  className="w-full h-full"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. AI Coach Features */}
      <section id="features" className="space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-xs font-black tracking-widest text-cricket-neon uppercase">
            Platform Capabilities
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Built for Peak Biomechanical Diagnostics
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
            Standard video players miss the posture anomalies that derail consistency. CricVerse analyzes the math of your swing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-darkbg-700 shadow-sm relative overflow-hidden hover:border-cricket-neon/20 transition-all duration-300 group">
            <div className="w-10 h-10 rounded-xl bg-cricket-neon/10 text-cricket-neon flex items-center justify-center mb-4">
              <Cpu className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-lg text-slate-900 dark:text-white mb-2 group-hover:text-cricket-neon transition-colors">
              Skeletal Pose Tracking
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              Maps 14 biometric joint markers recursively. Tracks wrists, hips, elbows, and knees to map structural balance.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-darkbg-700 shadow-sm relative overflow-hidden hover:border-cricket-cyan/20 transition-all duration-300 group">
            <div className="w-10 h-10 rounded-xl bg-cricket-cyan/10 text-cricket-cyan flex items-center justify-center mb-4">
              <Activity className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-lg text-slate-900 dark:text-white mb-2 group-hover:text-cricket-cyan transition-colors">
              Joint Flexion Metrics
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              Calculates joint angles at setup, backswing, contact, and follow-through. Audits stance collapse in slow-motion.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-darkbg-700 shadow-sm relative overflow-hidden hover:border-cricket-orange/20 transition-all duration-300 group">
            <div className="w-10 h-10 rounded-xl bg-cricket-orange/10 text-cricket-orange flex items-center justify-center mb-4">
              <Target className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-lg text-slate-900 dark:text-white mb-2 group-hover:text-cricket-orange transition-colors">
              Elite Comparisons
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              Compares your posture overlays frame-by-frame with professional batting and bowling benchmarks.
            </p>
          </div>
        </div>
      </section>

      {/* 4. How It Works */}
      <section id="how-it-works" className="space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-xs font-black tracking-widest text-cricket-cyan uppercase">
            The Workflow
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Diagnose Form In 4 Simple Steps
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Step 1 */}
          <div className="space-y-3 relative p-4 rounded-xl border border-slate-200/50 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.01]">
            <span className="text-4xl font-black text-cricket-neon/20 dark:text-white/5 font-mono">01</span>
            <h4 className="font-extrabold text-base text-slate-900 dark:text-white">Record Clip</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Record a batting drive or bowling release on your phone (ideally side-on and at 60 FPS).
            </p>
          </div>

          {/* Step 2 */}
          <div className="space-y-3 relative p-4 rounded-xl border border-slate-200/50 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.01]">
            <span className="text-4xl font-black text-cricket-neon/20 dark:text-white/5 font-mono">02</span>
            <h4 className="font-extrabold text-base text-slate-900 dark:text-white">Initialize Upload</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Drag the file into the Sessions vault and specify the analysis type.
            </p>
          </div>

          {/* Step 3 */}
          <div className="space-y-3 relative p-4 rounded-xl border border-slate-200/50 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.01]">
            <span className="text-4xl font-black text-cricket-neon/20 dark:text-white/5 font-mono">03</span>
            <h4 className="font-extrabold text-base text-slate-900 dark:text-white">Skeletal Extract</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              CricVerse AI maps joint positions and matches your stance against elite limits.
            </p>
          </div>

          {/* Step 4 */}
          <div className="space-y-3 relative p-4 rounded-xl border border-slate-200/50 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.01]">
            <span className="text-4xl font-black text-cricket-neon/20 dark:text-white/5 font-mono">04</span>
            <h4 className="font-extrabold text-base text-slate-900 dark:text-white">Audit & Adjust</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Scrub frame-by-frame, review correction points, and apply drills to rebuild muscle memory.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Why CricVerse */}
      <section className="p-8 rounded-3xl border border-slate-200 dark:border-white/5 bg-slate-50/70 dark:bg-darkbg-700 shadow-sm relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-72 h-72 bg-cricket-neon/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              Traditional Coaching vs. CricVerse AI Posture Diagnostics
            </h3>
            
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              Human coaching is subject to visual limits, qualitative biases, and scheduling conflicts. CricVerse runs 3D math on your frames instantly, providing a consistent index.
            </p>

            <div className="space-y-3 text-xs">
              <div className="flex items-center space-x-3 text-slate-650 dark:text-slate-350 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-cricket-neon shrink-0" />
                <span>Biomechanical joint calculations accurate within 5% error margin</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-650 dark:text-slate-350 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-cricket-neon shrink-0" />
                <span>Continuous slow-motion scrub playback controls at 0.25x and 0.50x speeds</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-650 dark:text-slate-350 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-cricket-neon shrink-0" />
                <span>Pro model overlay mappings (benchmarked against Virat Kohli & Brett Lee)</span>
              </div>
            </div>
          </div>

          {/* Placeholders Illustrations */}
          <div className="border border-slate-200 dark:border-white/5 rounded-2xl bg-white dark:bg-darkbg-800 p-6 flex flex-col justify-center items-center relative aspect-video overflow-hidden">
            {/* Grid pattern */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#a3e635_1px,transparent_1px)] [background-size:16px_16px]"></div>
            
            <ShieldCheck className="w-12 h-12 text-cricket-neon mb-3 relative z-10" />
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white relative z-10">Elite Safety Standards</h4>
            <p className="text-[10px] text-slate-450 dark:text-slate-500 text-center mt-1 max-w-[280px] leading-relaxed relative z-10">
              Joint strain thresholds are audited to alert bowlers of lumbar overload risks before injury occurs.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Statistics Section */}
      <section id="stats" className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* Stat 1 */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-darkbg-700 text-center">
          <span className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white bg-gradient-to-r from-cricket-neon to-slate-500 dark:to-white bg-clip-text text-transparent font-mono">
            +18.4%
          </span>
          <h4 className="font-extrabold text-xs text-slate-450 dark:text-slate-400 mt-2 uppercase tracking-wider">
            Technique Improvement
          </h4>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Average athlete score increase within 30 days</p>
        </div>

        {/* Stat 2 */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-darkbg-700 text-center">
          <span className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white bg-gradient-to-r from-cricket-cyan to-slate-500 dark:to-white bg-clip-text text-transparent font-mono">
            4.2M
          </span>
          <h4 className="font-extrabold text-xs text-slate-450 dark:text-slate-400 mt-2 uppercase tracking-wider">
            Biometric Frames
          </h4>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Skeletal vectors processed and evaluated</p>
        </div>

        {/* Stat 3 */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-darkbg-700 text-center">
          <span className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white bg-gradient-to-r from-cricket-orange to-slate-500 dark:to-white bg-clip-text text-transparent font-mono">
            96.8%
          </span>
          <h4 className="font-extrabold text-xs text-slate-450 dark:text-slate-400 mt-2 uppercase tracking-wider">
            Analysis Accuracy
          </h4>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Postural match alignment correlation rate</p>
        </div>
      </section>

      {/* 7. Testimonials */}
      <section className="space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-xs font-black tracking-widest text-cricket-neon uppercase">
            Testimonials
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Backed by Professional Academies
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Testimonial 1 */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-darkbg-700 shadow-sm space-y-4 relative">
            <Quote className="absolute top-6 right-6 w-8 h-8 text-slate-100 dark:text-white/[0.02] pointer-events-none" />
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              "CricVerse has changed how we train our batsmen. Instead of generic suggestions, our coaches can point to exact elbow flexion angles on the canvas player. Stance consistency has shot up by 15%."
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <img 
                src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&h=80&fit=crop" 
                alt="Kumar" 
                className="w-9 h-9 rounded-xl object-cover"
              />
              <div>
                <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">Kumar Sangakkara</h4>
                <span className="text-[9px] text-slate-400 block font-semibold">CricVerse Advisory Board & Head Coach</span>
              </div>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-darkbg-700 shadow-sm space-y-4 relative">
            <Quote className="absolute top-6 right-6 w-8 h-8 text-slate-100 dark:text-white/[0.02] pointer-events-none" />
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              "For fast bowlers, monitoring release angle and deceleration stride count is vital. CricVerse AI diagnostics alerts athletes of lumbar knee buckling risks, saving them from stress injuries."
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop" 
                alt="Brett" 
                className="w-9 h-9 rounded-xl object-cover"
              />
              <div>
                <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">Brett Lee</h4>
                <span className="text-[9px] text-slate-400 block font-semibold">Fast Bowling Consultant & Elite Partner</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQ Section */}
      <section id="faq" className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-xs font-black tracking-widest text-cricket-cyan uppercase">
            FAQ
          </h2>
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Frequently Asked Questions
          </h3>
        </div>

        <div className="divide-y divide-slate-250/50 dark:divide-white/5 border-y border-slate-250/50 dark:border-white/5">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div key={idx} className="py-4 font-sans">
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between py-2 text-left text-xs sm:text-sm font-bold text-slate-800 dark:text-white focus:outline-none"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="pt-2 pb-3 text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* 9. Call To Action (CTA) */}
      <section className="relative p-12 rounded-3xl border border-slate-200 dark:border-white/5 bg-gradient-to-br from-slate-900 to-darkbg-900 text-center space-y-6 overflow-hidden">
        {/* Neon Glow spots */}
        <div className="absolute -top-12 -right-12 w-60 h-60 bg-cricket-neon/10 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute -bottom-12 -left-12 w-60 h-60 bg-cricket-cyan/10 rounded-full blur-[80px] pointer-events-none"></div>

        <h3 className="text-3xl sm:text-4xl font-black tracking-tight text-white max-w-lg mx-auto leading-tight">
          Ready to Audit Your Cricket Stance?
        </h3>
        
        <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed font-semibold">
          Unlock instant biomechanical evaluations and compare your stance frame-by-frame with elite professional models.
        </p>

        <div className="pt-2 flex justify-center">
          <button
            onClick={() => navigate('/register')}
            className="flex items-center space-x-2 px-8 py-3.5 rounded-xl font-bold bg-cricket-neon text-darkbg-900 hover:bg-cricket-neon/90 shadow-lg shadow-cricket-neon/15 hover:shadow-cricket-neon/25 transition-all duration-200"
          >
            <span>Activate Free Account</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

    </div>
  );
}
