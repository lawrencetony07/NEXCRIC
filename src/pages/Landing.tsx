import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import TrueFocus from '../components/TrueFocus';
import SpecularCard from '../components/SpecularCard';
import { 
  BrainCircuit, 
  ArrowRight, 
  Cpu, 
  Activity, 
  Users, 
  TrendingUp, 
  Play, 
  CheckCircle2, 
  ChevronDown,
  Quote,
  Target,
  ShieldCheck,
  Video
} from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const [heroFrame, setHeroFrame] = useState(0);
  const heroCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [activeStadiumShot, setActiveStadiumShot] = useState<
    'all' | 'cover' | 'straight' | 'on' | 'pull' | 'cut' | 'square' | 'sweep' | 'glance'
  >('all');

  const shotsList: { id: typeof activeStadiumShot; name: string; color: string; borderGlow: string }[] = [
    { id: 'all', name: 'All Shots', color: 'bg-white text-darkbg-900', borderGlow: '' },
    { id: 'cover', name: 'Cover Drive', color: 'bg-[#10b981] text-white', borderGlow: 'shadow-[#10b981]/20' },
    { id: 'straight', name: 'Straight Drive', color: 'bg-[#00f0ff] text-darkbg-900', borderGlow: 'shadow-[#00f0ff]/20' },
    { id: 'on', name: 'On Drive', color: 'bg-[#00ffb2] text-darkbg-900', borderGlow: 'shadow-[#00ffb2]/20' },
    { id: 'pull', name: 'Pull Shot', color: 'bg-[#ef4444] text-white', borderGlow: 'shadow-[#ef4444]/20' },
    { id: 'square', name: 'Square Cut', color: 'bg-[#f59e0b] text-darkbg-900', borderGlow: 'shadow-[#f59e0b]/20' },
    { id: 'sweep', name: 'Sweep Shot', color: 'bg-[#d946ef] text-white', borderGlow: 'shadow-[#d946ef]/20' },
    { id: 'cut', name: 'Late Cut', color: 'bg-[#ff6b35] text-white', borderGlow: 'shadow-[#ff6b35]/20' },
    { id: 'glance', name: 'Leg Glance', color: 'bg-[#3b82f6] text-white', borderGlow: 'shadow-[#3b82f6]/20' },
  ];

  const shotDetails: Record<
    typeof activeStadiumShot,
    { title: string; desc: string; angle: string; gap: string }
  > = {
    all: {
      title: "Interactive 360° Shot Wagon Wheel",
      desc: "Trace your shots across a virtual representation of the cricket ground. CricVerse maps the angle, height, and velocity vectors of your strokes, automatically displaying fielder layout constraints and boundary clearance stats.",
      angle: "Full 360° Spray",
      gap: "Multiple boundary scoring zones mapped across all quadrants."
    },
    cover: {
      title: "Cover Drive (Off-Side front foot)",
      desc: "Played off the front foot to a full delivery outside off stump, sending the ball through the covers. Elite players maintain a high elbow and lean into the line of the ball.",
      angle: "Off-Side (~45° to ~60°)",
      gap: "Beats the cover-point and extra-cover fielders."
    },
    straight: {
      title: "Straight Drive (Down the ground)",
      desc: "Played with a straight face of the bat, directing the ball straight back past the bowler. Requires perfect balance and keeping the head directly over the ball at contact.",
      angle: "Straight (~0° / 360°)",
      gap: "Pierces the gap between mid-off and the bowler."
    },
    on: {
      title: "On Drive (Mid-On region)",
      desc: "Played off the front foot, directing the ball to the leg-side of the bowler (mid-on). Requires quick wrist roll and closing the bat face slightly at impact.",
      angle: "On-Side (~15° to ~30°)",
      gap: "Pierces the gap between mid-on and the bowler/mid-wicket."
    },
    pull: {
      title: "Pull Shot (Leg-side mid-wicket)",
      desc: "Played off the back foot to a short-pitched delivery, hitting the ball in a horizontal swiveling arc in front of square on the leg side.",
      angle: "Leg-Side (~120° to ~135°)",
      gap: "Targets the deep mid-wicket and square leg boundary gap."
    },
    square: {
      title: "Square Cut (Past point)",
      desc: "Played off the back foot to a wide, short delivery, cutting the ball square on the off-side. Requires fast wrist snap and extending arms fully.",
      angle: "Square Off-Side (~90°)",
      gap: "Flies through the point and backward point region."
    },
    sweep: {
      title: "Sweep Shot (Square leg sweep)",
      desc: "Played by kneeling on one knee and sweeping the ball across the line to the leg-side. Excellent for countering spin bowlers on turning tracks.",
      angle: "Square Leg-Side (~270° / -90°)",
      gap: "Beats the backward square leg and short fine leg fielders."
    },
    cut: {
      title: "Late Cut (Behind third man)",
      desc: "Played very late under the eyes to a short, wide delivery, guiding the ball behind square on the off-side towards third man.",
      angle: "Behind Square Off-Side (~135°)",
      gap: "Guides the ball past slip / gully to the third man boundary."
    },
    glance: {
      title: "Leg Glance / Flick (Fine leg)",
      desc: "Played by flicking a delivery on the pads using wrists, directing the ball behind square on the leg-side towards fine leg.",
      angle: "Behind Square Leg-Side (~225°)",
      gap: "Beats the keeper and short fine leg to the boundary."
    }
  };

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

  // Draw Stance Balance & Posture Heatmap
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

    // 4. Draw Bat (Willow gold blade)
    ctx.strokeStyle = '#d97706'; // Blade
    ctx.lineWidth = 8;
    ctx.lineCap = 'square';
    ctx.beginPath();
    ctx.moveTo(rHandX, rHandY);
    ctx.lineTo(batTipX, batTipY);
    ctx.stroke();
    
    ctx.strokeStyle = '#10b981'; // Turf green grip
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
    ctx.fillStyle = '#0c1524';
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
    ctx.strokeStyle = isUnstable ? '#ef4444' : 'rgba(16, 185, 129, 0.3)';
    ctx.strokeRect(headX - 16, headY - 16, 32, 32);
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
    ctx.strokeRect(lFootX - 14, lFootY - 4, 28, 10);
    ctx.strokeRect(rFootX - 14, rFootY - 4, 28, 10);

    // 11. Posture Heatmaps
    const drawJoint = (x: number, y: number, color = '#10b981') => {
      ctx.beginPath(); ctx.arc(x, y, 3, 0, 2 * Math.PI);
      ctx.fillStyle = color; ctx.fill();
      ctx.beginPath(); ctx.arc(x, y, 6, 0, 2 * Math.PI);
      ctx.strokeStyle = color === '#ef4444' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(16, 185, 129, 0.25)';
      ctx.stroke();
    };
    
    drawJoint(headX, headY, isUnstable ? '#ef4444' : '#10b981');
    drawJoint(lKneeX, lKneeY);
    drawJoint(rKneeX, rKneeY);
    drawJoint(lShoulderX, lShoulderY);
    drawJoint(rShoulderX, rShoulderY);

    // 12. Scorecard Calculations
    const leftWeight = Math.round(50 - sway * 1.5);
    const rightWeight = 100 - leftWeight;

    ctx.fillStyle = 'rgba(7, 9, 14, 0.85)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.fillRect(cx - 65, height - 42, 130, 20);
    ctx.strokeRect(cx - 65, height - 42, 130, 20);

    ctx.font = 'bold 8px monospace';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(`WEIGHT DIST: L ${leftWeight}% | R ${rightWeight}%`, cx, height - 30);
    ctx.textAlign = 'left';

    if (isUnstable) {
      ctx.font = 'bold 8px monospace';
      ctx.fillStyle = '#ef4444';
      ctx.fillText("⚠️ HEAD DRIFT: OUT OF ALIGNMENT", 15, height - 52);
    } else {
      ctx.font = '8px monospace';
      ctx.fillStyle = '#00f0ff';
      ctx.fillText("✓ ALIGNMENT SECURE", 15, height - 52);
    }

    ctx.strokeStyle = 'rgba(16, 185, 129, 0.1)';
    ctx.strokeRect(5, 5, width - 10, height - 10);

    ctx.font = '8px monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fillText("STANCE_AUDITOR: ACTIVE", 14, 18);
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(8, 15, 2, 0, 2 * Math.PI);
    ctx.fill();

    ctx.textAlign = 'right';
    ctx.fillStyle = isUnstable ? '#ef4444' : '#10b981';
    ctx.fillText(isUnstable ? "ALERT: STABILITY FAIL" : "STATUS: BALANCED", width - 10, 18);
    ctx.textAlign = 'left';
  }, [heroFrame]);

  const faqs = [
    {
      q: "How does the AI analyze my technique?",
      a: "Our system uses advanced computer vision pose estimation models to track 14 key body joints in your batting or bowling video. It computes your relative joint angles frame-by-frame and compares them against optimized biomechanical limits."
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
    <div className="space-y-24 pb-16 relative turf-grid-pattern">
      {/* Stadium Spotlight Beams */}
      <div className="stadium-beam-left pointer-events-none z-0"></div>
      <div className="stadium-beam-right pointer-events-none z-0"></div>

      {/* Hero Section */}
      <section className="relative pt-12 md:pt-20 overflow-hidden z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Copy Area (7/12 width) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-green-500/20 bg-green-500/5 text-cricket-neon text-xs font-bold"
            >
              <Target className="w-3.5 h-3.5" />
              <span>Next-Gen Biomechanical Analysis</span>
            </motion.div>
            
            <div className="flex justify-center lg:justify-start">
              <TrueFocus 
                sentence="CricVerse AI Coach"
                manualMode={false}
                blurAmount={3.5}
                borderColor="#10b981"
                glowColor="rgba(16, 185, 129, 0.5)"
                animationDuration={0.4}
                pauseBetweenAnimations={1.0}
              />
            </div>

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
              className="text-base sm:text-lg text-slate-550 dark:text-slate-405 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium"
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

          {/* Hero Visual Widget (5/12 width) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 flex justify-center"
          >
            <SpecularCard
              radius={24}
              lineColor="#10b981"
              baseColor="rgba(255, 255, 255, 0.05)"
              intensity={1.5}
              thickness={1.5}
              className="w-full max-w-[360px]"
            >
              <div className="relative w-full p-5 rounded-3xl bg-white dark:bg-darkbg-700/80 backdrop-blur-xl shadow-2xl overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-cricket-neon/5 via-transparent to-transparent opacity-50"></div>
                
                {/* Header HUD */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    Live Stance Auditor
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
            </SpecularCard>
          </motion.div>
        </div>
      </section>

      {/* Interactive Stadium & Wagon Wheel Section */}
      <SpecularCard
        radius={24}
        lineColor="#00f0ff"
        baseColor="rgba(255, 255, 255, 0.03)"
        intensity={1.5}
        thickness={1.5}
        className="w-full flex z-10"
      >
        <section className="relative p-8 sm:p-12 w-full bg-white dark:bg-darkbg-700 overflow-hidden group">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-cricket-neon/5 rounded-full blur-[80px] pointer-events-none"></div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Column 1: SVG Stadium Layout (5/12) */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-4">
              <div className="p-4 rounded-2xl bg-[#03060a] border border-white/5 shadow-inner flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] opacity-5"></div>
                
                <svg viewBox="0 0 320 320" className="w-full max-w-[280px] sm:max-w-[320px] aspect-square overflow-visible">
                  {/* Outer Boundary Circle */}
                  <circle cx="160" cy="160" r="140" className="fill-[#08110b]/60 stroke-green-500/20 stroke-2" />
                  
                  {/* Concentric Turf mowing sections */}
                  <circle cx="160" cy="160" r="115" className="fill-none stroke-green-500/5 stroke-[16px] opacity-40" />
                  <circle cx="160" cy="160" r="85" className="fill-none stroke-green-500/5 stroke-[16px] opacity-40" />
                  
                  {/* 30-Yard Inner Circle */}
                  <circle cx="160" cy="160" r="70" stroke-dasharray="3,4" className="fill-none stroke-white/10" />

                  {/* Pitch (brown rectangle in the center) */}
                  <rect x="154" y="130" width="12" height="60" rx="1" className="fill-amber-900/35 stroke-amber-800/20" />
                  
                  {/* 360° Degree Angle Guidelines (Soft dashed lines) */}
                  <line x1="160" y1="20" x2="160" y2="300" stroke-dasharray="2,3" className="stroke-white/5" />
                  <line x1="20" y1="160" x2="300" y2="160" stroke-dasharray="2,3" className="stroke-white/5" />
                  <line x1="61" y1="61" x2="259" y2="259" stroke-dasharray="2,3" className="stroke-white/5" />
                  <line x1="61" y1="259" x2="259" y2="61" stroke-dasharray="2,3" className="stroke-white/5" />

                  <AnimatePresence initial={false}>
                    {/* Cover Drive (Green line to off-side boundary) */}
                    {(activeStadiumShot === 'all' || activeStadiumShot === 'cover') && (
                      <g>
                        <motion.path
                          d="M 160,180 Q 110,130 70,80"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.6 }}
                        />
                        <circle cx="70" cy="80" r="4.5" className="fill-[#10b981] animate-pulse" />
                      </g>
                    )}

                    {/* Straight Drive (Cyan line to straight boundary) */}
                    {(activeStadiumShot === 'all' || activeStadiumShot === 'straight') && (
                      <g>
                        <motion.path
                          d="M 160,180 Q 155,100 150,25"
                          fill="none"
                          stroke="#00f0ff"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.6 }}
                        />
                        <circle cx="150" cy="25" r="4.5" className="fill-[#00f0ff] animate-pulse" />
                      </g>
                    )}

                    {/* On Drive (Mint line to leg-side straight) */}
                    {(activeStadiumShot === 'all' || activeStadiumShot === 'on') && (
                      <g>
                        <motion.path
                          d="M 160,180 Q 165,100 170,25"
                          fill="none"
                          stroke="#00ffb2"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.6 }}
                        />
                        <circle cx="170" cy="25" r="4.5" className="fill-[#00ffb2] animate-pulse" />
                      </g>
                    )}

                    {/* Pull Shot (Red line to leg-side boundary) */}
                    {(activeStadiumShot === 'all' || activeStadiumShot === 'pull') && (
                      <g>
                        <motion.path
                          d="M 160,180 Q 210,130 250,80"
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.6 }}
                        />
                        <circle cx="250" cy="80" r="4.5" className="fill-[#ef4444] animate-pulse" />
                      </g>
                    )}

                    {/* Square Cut (Gold line to point boundary) */}
                    {(activeStadiumShot === 'all' || activeStadiumShot === 'square') && (
                      <g>
                        <motion.path
                          d="M 160,180 Q 100,180 30,180"
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.6 }}
                        />
                        <circle cx="30" cy="180" r="4.5" className="fill-[#f59e0b] animate-pulse" />
                      </g>
                    )}

                    {/* Sweep Shot (Magenta line to square leg boundary) */}
                    {(activeStadiumShot === 'all' || activeStadiumShot === 'sweep') && (
                      <g>
                        <motion.path
                          d="M 160,180 Q 220,180 290,180"
                          fill="none"
                          stroke="#d946ef"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.6 }}
                        />
                        <circle cx="290" cy="180" r="4.5" className="fill-[#d946ef] animate-pulse" />
                      </g>
                    )}

                    {/* Late Cut (Orange line to third man) */}
                    {(activeStadiumShot === 'all' || activeStadiumShot === 'cut') && (
                      <g>
                        <motion.path
                          d="M 160,180 Q 100,210 55,235"
                          fill="none"
                          stroke="#ff6b35"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.6 }}
                        />
                        <circle cx="55" cy="235" r="4.5" className="fill-[#ff6b35] animate-pulse" />
                      </g>
                    )}

                    {/* Leg Glance / Fine Leg (Light Blue line to fine leg) */}
                    {(activeStadiumShot === 'all' || activeStadiumShot === 'glance') && (
                      <g>
                        <motion.path
                          d="M 160,180 Q 220,210 265,235"
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.6 }}
                        />
                        <circle cx="265" cy="235" r="4.5" className="fill-[#3b82f6] animate-pulse" />
                      </g>
                    )}
                  </AnimatePresence>

                  {/* Fielder position indicators (blinking dots) */}
                  <g>
                    <circle cx="245" cy="215" r="3.5" className="fill-slate-500 stroke-darkbg-900 stroke-1" />
                    <circle cx="85" cy="115" r="3.5" className="fill-slate-500 stroke-darkbg-900 stroke-1" />
                    <circle cx="130" cy="205" r="3.5" className="fill-slate-500 stroke-darkbg-900 stroke-1" />
                    <circle cx="190" cy="95" r="3.5" className="fill-slate-500 stroke-darkbg-900 stroke-1" />
                  </g>
                </svg>
              </div>
              
              <div className="flex flex-wrap justify-center gap-1.5 max-w-[340px]">
                {shotsList.map(shot => (
                  <button 
                    key={shot.id}
                    onClick={() => setActiveStadiumShot(shot.id)}
                    className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider transition-all duration-300 ${
                      activeStadiumShot === shot.id 
                        ? `${shot.color} shadow-lg ${shot.borderGlow}` 
                        : 'bg-white/5 hover:bg-white/10 text-slate-350 border border-white/5'
                    }`}
                  >
                    {shot.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Column 2: Strategy Info (7/12) */}
            <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
              <span className="text-xs font-black tracking-widest text-cricket-cyan uppercase">Stadium Mapping</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight">
                {shotDetails[activeStadiumShot]?.title || shotDetails.all.title}
              </h3>
              
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                {shotDetails[activeStadiumShot]?.desc || shotDetails.all.desc}
              </p>

              <div className="border-t border-slate-200/50 dark:border-white/5 pt-4 grid grid-cols-2 gap-4 text-left">
                <div className="p-3.5 rounded-xl bg-slate-50/50 dark:bg-darkbg-800/40 border border-slate-200/50 dark:border-white/5">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-450">Shot Angle / Sector</h4>
                  <p className="text-xs text-slate-700 dark:text-slate-200 font-semibold mt-1">
                    {shotDetails[activeStadiumShot]?.angle || shotDetails.all.angle}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50/50 dark:bg-darkbg-800/40 border border-slate-200/50 dark:border-white/5">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-450">Tactical Target Gap</h4>
                  <p className="text-xs text-slate-700 dark:text-slate-200 font-semibold mt-1">
                    {shotDetails[activeStadiumShot]?.gap || shotDetails.all.gap}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>
      </SpecularCard>

      {/* AI Coach Features */}
      <section id="features" className="space-y-12 relative z-10">
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
          <SpecularCard
            radius={16}
            lineColor="#10b981"
            baseColor="rgba(255, 255, 255, 0.05)"
            intensity={1.5}
            thickness={1.5}
            className="w-full flex"
          >
            <div className="p-6 rounded-2xl bg-white dark:bg-darkbg-700/80 backdrop-blur-sm h-full w-full relative overflow-hidden group">
              <div className="w-10 h-10 rounded-xl bg-cricket-neon/10 text-cricket-neon flex items-center justify-center mb-4">
                <Cpu className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-lg text-slate-900 dark:text-white mb-2 group-hover:text-cricket-neon transition-colors">
                Skeletal Pose Tracking
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed">
                Extracts 14 core biomechanical joint coordinates in 2D vector layouts automatically from regular mobile videos.
              </p>
            </div>
          </SpecularCard>

          {/* Card 2 */}
          <SpecularCard
            radius={16}
            lineColor="#00f0ff"
            baseColor="rgba(255, 255, 255, 0.05)"
            intensity={1.5}
            thickness={1.5}
            className="w-full flex"
          >
            <div className="p-6 rounded-2xl bg-white dark:bg-darkbg-700/80 backdrop-blur-sm h-full w-full relative overflow-hidden group">
              <div className="w-10 h-10 rounded-xl bg-cricket-cyan/10 text-cricket-cyan flex items-center justify-center mb-4">
                <Activity className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-lg text-slate-900 dark:text-white mb-2 group-hover:text-cricket-cyan transition-colors">
                Angle & Force Analytics
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed">
                Calculates lead elbow extension, knee brace angle, head alignment, and hip opening angles frame-by-frame.
              </p>
            </div>
          </SpecularCard>

          {/* Card 3 */}
          <SpecularCard
            radius={16}
            lineColor="#f59e0b"
            baseColor="rgba(255, 255, 255, 0.05)"
            intensity={1.5}
            thickness={1.5}
            className="w-full flex"
          >
            <div className="p-6 rounded-2xl bg-white dark:bg-darkbg-700/80 backdrop-blur-sm h-full w-full relative overflow-hidden group">
              <div className="w-10 h-10 rounded-xl bg-cricket-orange/10 text-cricket-orange flex items-center justify-center mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-lg text-slate-900 dark:text-white mb-2 group-hover:text-cricket-orange transition-colors">
                Pro Technique Matching
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed">
                Superimpose your skeleton model directly onto optimized benchmark structures of elite international cricketers.
              </p>
            </div>
          </SpecularCard>
        </div>
      </section>

      {/* Elite Safety Standards */}
      <SpecularCard
        radius={24}
        lineColor="#10b981"
        baseColor="rgba(255, 255, 255, 0.03)"
        intensity={1.5}
        thickness={1.5}
        className="w-full flex z-10"
      >
        <section className="relative w-full rounded-3xl bg-white dark:bg-darkbg-700 overflow-hidden group">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[250px] bg-cricket-neon/5 rounded-full blur-[80px] pointer-events-none"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center p-8 sm:p-12 relative z-10">
            
            <div className="space-y-4 text-center md:text-left">
              <span className="text-xs font-black tracking-widest text-cricket-cyan uppercase">Injury Prevention</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                Protect Your Lumbar Spine and Knee Joints
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Fast bowlers are audited for knee buckling (over-flexion) and lumbar rotation overload at release, alerting you when joints cross high-risk impact thresholds.
              </p>
            </div>

            <div className="flex flex-col items-center justify-center p-6 border border-slate-200/50 dark:border-white/5 rounded-2xl bg-slate-50/50 dark:bg-darkbg-800/50 backdrop-blur-sm relative w-full h-full">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]"></div>
              
              <ShieldCheck className="w-12 h-12 text-cricket-neon mb-3 relative z-10" />
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white relative z-10">Elite Safety Standards</h4>
              <p className="text-[10px] text-slate-455 dark:text-slate-500 text-center mt-1 max-w-[280px] leading-relaxed relative z-10">
                Joint strain thresholds are audited to alert bowlers of lumbar overload risks before injury occurs.
              </p>
            </div>
          </div>
        </section>
      </SpecularCard>

      {/* Statistics Section */}
      <section id="stats" className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10">
        <SpecularCard
          radius={16}
          lineColor="#10b981"
          baseColor="rgba(255, 255, 255, 0.05)"
          intensity={1.5}
          thickness={1.5}
          className="w-full flex"
        >
          <div className="p-6 rounded-2xl bg-white dark:bg-darkbg-700 w-full text-center">
            <span className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white bg-gradient-to-r from-cricket-neon to-slate-500 dark:to-white bg-clip-text text-transparent font-mono">
              +18.4%
            </span>
            <h4 className="font-extrabold text-xs text-slate-450 dark:text-slate-400 mt-2 uppercase tracking-wider">
              Technique Improvement
            </h4>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Average athlete score increase within 30 days</p>
          </div>
        </SpecularCard>

        <SpecularCard
          radius={16}
          lineColor="#00f0ff"
          baseColor="rgba(255, 255, 255, 0.05)"
          intensity={1.5}
          thickness={1.5}
          className="w-full flex"
        >
          <div className="p-6 rounded-2xl bg-white dark:bg-darkbg-700 w-full text-center">
            <span className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white bg-gradient-to-r from-cricket-cyan to-slate-500 dark:to-white bg-clip-text text-transparent font-mono">
              4.2M
            </span>
            <h4 className="font-extrabold text-xs text-slate-455 dark:text-slate-400 mt-2 uppercase tracking-wider">
              Biometric Frames
            </h4>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Skeletal vectors processed and evaluated</p>
          </div>
        </SpecularCard>

        <SpecularCard
          radius={16}
          lineColor="#f59e0b"
          baseColor="rgba(255, 255, 255, 0.05)"
          intensity={1.5}
          thickness={1.5}
          className="w-full flex"
        >
          <div className="p-6 rounded-2xl bg-white dark:bg-darkbg-700 w-full text-center">
            <span className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white bg-gradient-to-r from-cricket-orange to-slate-500 dark:to-white bg-clip-text text-transparent font-mono">
              96.8%
            </span>
            <h4 className="font-extrabold text-xs text-slate-455 dark:text-slate-400 mt-2 uppercase tracking-wider">
              Analysis Accuracy
            </h4>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Postural match alignment correlation rate</p>
          </div>
        </SpecularCard>
      </section>

      {/* Testimonials */}
      <section className="space-y-12 relative z-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-xs font-black tracking-widest text-cricket-neon uppercase">
            Testimonials
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Backed by Professional Academies
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <SpecularCard
            radius={16}
            lineColor="#10b981"
            baseColor="rgba(255, 255, 255, 0.05)"
            intensity={1.5}
            thickness={1.5}
            className="w-full flex"
          >
            <div className="p-6 rounded-2xl bg-white dark:bg-darkbg-700/80 backdrop-blur-sm shadow-sm space-y-4 h-full w-full relative">
              <p className="text-xs text-slate-655 dark:text-slate-300 leading-relaxed font-semibold">
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
                  <span className="text-[9px] text-slate-405 block font-bold">CricVerse Advisory Board & Head Coach</span>
                </div>
              </div>
            </div>
          </SpecularCard>

          <SpecularCard
            radius={16}
            lineColor="#00f0ff"
            baseColor="rgba(255, 255, 255, 0.05)"
            intensity={1.5}
            thickness={1.5}
            className="w-full flex"
          >
            <div className="p-6 rounded-2xl bg-white dark:bg-darkbg-700/80 backdrop-blur-sm shadow-sm space-y-4 h-full w-full relative">
              <p className="text-xs text-slate-655 dark:text-slate-300 leading-relaxed font-semibold">
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
                  <span className="text-[9px] text-slate-405 block font-bold">Fast Bowling Consultant & Elite Partner</span>
                </div>
              </div>
            </div>
          </SpecularCard>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="max-w-3xl mx-auto space-y-8 relative z-10">
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
                      <p className="pt-2 pb-3 text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
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

      {/* CTA */}
      <SpecularCard
        radius={24}
        lineColor="#10b981"
        baseColor="rgba(255, 255, 255, 0.03)"
        intensity={1.5}
        thickness={1.5}
        className="w-full flex z-10"
      >
        <section className="relative p-12 w-full bg-gradient-to-br from-slate-900 to-darkbg-900 text-center space-y-6 overflow-hidden rounded-3xl">
          <h3 className="text-3xl sm:text-4xl font-black tracking-tight text-white max-w-lg mx-auto leading-tight">
            Ready to Audit Your Cricket Stance?
          </h3>
          
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed font-bold">
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
      </SpecularCard>

    </div>
  );
}
