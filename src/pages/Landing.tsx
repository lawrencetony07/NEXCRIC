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

  // Draw Stance Balance & Posture Heatmap in hero illustration
  useEffect(() => {
    const canvas = heroCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const cx = width / 2;
    const cy = height / 2;

    ctx.clearRect(0, 0, width, height);

    // 1. Draw grid background lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.015)';
    ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 20) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(width, i); ctx.stroke();
    }

    // 2. Alignment Corridor (Target lines)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 6]);
    ctx.beginPath();
    ctx.moveTo(cx - 12, 20); ctx.lineTo(cx - 12, height - 20);
    ctx.moveTo(cx + 12, 20); ctx.lineTo(cx + 12, height - 20);
    ctx.stroke();
    ctx.setLineDash([]);

    // 3. Stance Sway calculation (Simulating weight transfer)
    const sway = Math.sin(heroFrame * 0.07) * 8.5; // Left-to-right sway
    const headX = cx + sway;
    const headY = cy - 65;
    const neckX = cx + sway * 0.8;
    const neckY = cy - 45;
    const hipX = cx + sway * 0.4;
    const hipY = cy + 15;
    
    const lShoulderX = cx - 22 + sway * 0.8, lShoulderY = cy - 40;
    const rShoulderX = cx + 22 + sway * 0.8, rShoulderY = cy - 40;
    
    const lFootX = cx - 35, lFootY = cy + 105;
    const rFootX = cx + 35, rFootY = cy + 105;
    
    const lKneeX = (hipX - 12 + lFootX) / 2 - 8, lKneeY = (hipY + lFootY) / 2;
    const rKneeX = (hipX + 12 + rFootX) / 2 + 8, rKneeY = (hipY + rFootY) / 2;

    const lHandX = cx - 8 + sway * 0.6, lHandY = cy + 15;
    const rHandX = cx + 8 + sway * 0.6, rHandY = cy + 15;
    const batTipX = cx + 35, batTipY = cy + 105;

    // Helper: Draw limb silhouettes
    const drawLimb = (x1: number, y1: number, x2: number, y2: number, w = 12, color = 'rgba(30, 41, 59, 0.85)') => {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = w;
      ctx.lineCap = 'round';
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    };

    // 4. Draw Bat (Tapped down near back foot)
    ctx.strokeStyle = '#854d0e'; // Blade
    ctx.lineWidth = 8;
    ctx.lineCap = 'square';
    ctx.beginPath();
    ctx.moveTo(rHandX, rHandY);
    ctx.lineTo(batTipX, batTipY);
    ctx.stroke();
    
    ctx.strokeStyle = '#a3e635'; // Neon green grip
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(rHandX, rHandY);
    ctx.lineTo(rHandX - 3, rHandY - 8);
    ctx.stroke();

    // 5. Draw Trousers & Pads
    drawLimb(hipX - 10, hipY, lKneeX, lKneeY, 15, 'rgba(226, 232, 240, 0.7)');
    drawLimb(lKneeX, lKneeY, lFootX, lFootY, 18, 'rgba(241, 245, 249, 0.95)');
    
    drawLimb(hipX + 10, hipY, rKneeX, rKneeY, 15, 'rgba(226, 232, 240, 0.7)');
    drawLimb(rKneeX, rKneeY, rFootX, rFootY, 18, 'rgba(241, 245, 249, 0.95)');

    // 6. Draw Torso Shirt
    ctx.fillStyle = 'rgba(30, 41, 59, 0.9)';
    ctx.beginPath();
    ctx.moveTo(lShoulderX, lShoulderY);
    ctx.lineTo(rShoulderX, rShoulderY);
    ctx.lineTo(hipX + 12, hipY);
    ctx.lineTo(hipX - 12, hipY);
    ctx.closePath();
    ctx.fill();

    // 7. Draw Arms
    drawLimb(lShoulderX, lShoulderY, lHandX, lHandY, 10, 'rgba(30, 41, 59, 0.9)');
    drawLimb(rShoulderX, rShoulderY, rHandX, rHandY, 10, 'rgba(30, 41, 59, 0.9)');

    // 8. Draw Helmet
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(headX, headY, 13, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.6)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(headX - 8, headY + 3);
    ctx.lineTo(headX - 4, headY + 12);
    ctx.lineTo(headX + 4, headY + 8);
    ctx.stroke();

    // 9. Draw Center of Gravity (COG) Plumb Line
    const headDrift = Math.abs(sway);
    const isUnstable = headDrift > 6.0;
    
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = isUnstable ? '#ef4444' : '#00f0ff'; // Red if drifting, Cyan if safe
    ctx.beginPath();
    ctx.moveTo(headX, headY);
    ctx.lineTo(headX, lFootY);
    ctx.stroke();

    // Draw COG ground circle
    ctx.fillStyle = isUnstable ? 'rgba(239, 68, 68, 0.15)' : 'rgba(0, 240, 255, 0.15)';
    ctx.beginPath();
    ctx.ellipse(headX, lFootY, 18, 6, 0, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = isUnstable ? '#ef4444' : '#00f0ff';
    ctx.lineWidth = 1;
    ctx.stroke();

    // 10. AI Bounding Box Overlays
    ctx.lineWidth = 1;
    
    // Head box
    ctx.strokeStyle = isUnstable ? '#ef4444' : 'rgba(163, 230, 53, 0.3)';
    ctx.strokeRect(headX - 16, headY - 16, 32, 32);
    
    // Feet boxes
    ctx.strokeStyle = 'rgba(163, 230, 53, 0.4)';
    ctx.strokeRect(lFootX - 14, lFootY - 4, 28, 10);
    ctx.strokeRect(rFootX - 14, rFootY - 4, 28, 10);

    // 11. Posture Heatmaps (Joint trackers)
    const drawJoint = (x: number, y: number, color = '#a3e635') => {
      ctx.beginPath(); ctx.arc(x, y, 3, 0, 2 * Math.PI);
      ctx.fillStyle = color; ctx.fill();
      ctx.beginPath(); ctx.arc(x, y, 6, 0, 2 * Math.PI);
      ctx.strokeStyle = color === '#ef4444' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(163, 230, 53, 0.25)';
      ctx.stroke();
    };
    
    drawJoint(headX, headY, isUnstable ? '#ef4444' : '#a3e635');
    drawJoint(lKneeX, lKneeY);
    drawJoint(rKneeX, rKneeY);
    drawJoint(lShoulderX, lShoulderY);
    drawJoint(rShoulderX, rShoulderY);

    // 12. Floating Scorecard & HUD texts
    const leftWeight = Math.round(50 - sway * 1.5);
    const rightWeight = 100 - leftWeight;

    // Display weight distribution box
    ctx.fillStyle = 'rgba(6, 8, 15, 0.85)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.fillRect(cx - 65, height - 42, 130, 20);
    ctx.strokeRect(cx - 65, height - 42, 130, 20);

    ctx.font = 'bold 8px monospace';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(`WEIGHT DIST: L ${leftWeight}% | R ${rightWeight}%`, cx, height - 30);
    ctx.textAlign = 'left';

    // Warnings if head drifts too far
    if (isUnstable) {
      ctx.font = 'bold 8px monospace';
      ctx.fillStyle = '#ef4444';
      ctx.fillText("⚠️ HEAD DRIFT: OUT OF ALIGNMENT", 15, height - 52);
    } else {
      ctx.font = '8px monospace';
      ctx.fillStyle = '#00f0ff';
      ctx.fillText("✓ ALIGNMENT SECURE", 15, height - 52);
    }

    // Outer framing
    ctx.strokeStyle = 'rgba(163, 230, 53, 0.1)';
    ctx.strokeRect(5, 5, width - 10, height - 10);

    // Corner HUD Details
    ctx.font = '8px monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fillText("STANCE_AUDITOR: ACTIVE", 14, 18);
    ctx.fillStyle = '#a3e635';
    ctx.beginPath();
    ctx.arc(8, 15, 2, 0, 2 * Math.PI);
    ctx.fill();

    ctx.textAlign = 'right';
    ctx.fillStyle = isUnstable ? '#ef4444' : '#a3e635';
    ctx.fillText(isUnstable ? "ALERT: STABILITY FAIL" : "STATUS: BALANCED", width - 10, 18);
    ctx.textAlign = 'left';

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
