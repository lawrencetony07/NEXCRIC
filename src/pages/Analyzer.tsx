import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Check, 
  Layers, 
  MessageSquareCode, 
  Sparkles, 
  Users, 
  ChevronRight, 
  Bookmark,
  Share2,
  Volume2
} from 'lucide-react';
import { Session, getSkeletalFrame, Skeleton, Joint } from '../api/coachingApi';

interface AnalyzerProps {
  sessions: Session[];
}

export default function Analyzer({ sessions }: AnalyzerProps) {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  // Find Session
  const session = sessions.find(s => s.id === sessionId) || sessions[0];

  // Analyzer UI States
  const [frame, setFrame] = useState(50); // contact frame default
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<0.25 | 0.5 | 1>(0.5); // slow-mo by default
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [compareMode, setCompareMode] = useState(false);
  const [activeCritiqueTab, setActiveCritiqueTab] = useState<'setup' | 'backswing' | 'contact' | 'followThrough'>('contact');
  const [isAudited, setIsAudited] = useState(false);

  // Canvas Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const proCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Animate playback loop
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const updateFrame = (time: number) => {
      if (isPlaying) {
        const delta = time - lastTime;
        const framesPerSec = 30 * speed; // Base 30 FPS * speed modifier
        const increment = (delta / 1000) * framesPerSec * 3; // Multiplier to move smoothly
        
        setFrame(prev => {
          let next = prev + increment;
          if (next >= 100) {
            next = 0; // loop
          }
          return next;
        });
      }
      lastTime = time;
      animationFrameId = requestAnimationFrame(updateFrame);
    };

    animationFrameId = requestAnimationFrame(updateFrame);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, speed]);

  // Handle canvas rendering of joint skeletons
  useEffect(() => {
    if (!session) return;
    const currentFrameIndex = Math.round(frame);
    
    // Draw User Skeleton
    const userSkeleton = getSkeletalFrame(session.type, currentFrameIndex);
    drawSkeletonOnCanvas(canvasRef.current, userSkeleton, showAnnotations, '#a3e635', session.type);

    // Draw Pro Skeleton if compare mode active
    if (compareMode) {
      // Pro does the same action, but with perfect form. 
      // We add minor offsets to show comparison, or smooth it.
      const proSkeleton = getSkeletalFrame(session.type, currentFrameIndex);
      drawSkeletonOnCanvas(proCanvasRef.current, proSkeleton, showAnnotations, '#00f0ff', session.type, true);
    }
  }, [frame, session, showAnnotations, compareMode]);

  // Math helper: Vector angle between three joints
  const calculateJointAngle = (p1: Joint, center: Joint, p2: Joint): number => {
    const v1 = { x: p1.x - center.x, y: p1.y - center.y };
    const v2 = { x: p2.x - center.x, y: p2.y - center.y };

    const dotProduct = v1.x * v2.x + v1.y * v2.y;
    const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
    const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);

    if (mag1 === 0 || mag2 === 0) return 0;
    
    const angleRad = Math.acos(dotProduct / (mag1 * mag2));
    return Math.round((angleRad * 180) / Math.PI);
  };

  // HTML5 Canvas Drawing Routine
  const drawSkeletonOnCanvas = (
    canvas: HTMLCanvasElement | null, 
    skeleton: Skeleton, 
    annotate: boolean, 
    color: string, 
    actionType: 'batting' | 'bowling',
    isPro = false
  ) => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set background layout grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // Drawing settings
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Helper to draw bone lines
    const drawBone = (j1: Joint, j2: Joint, thickness = 3.5, strokeColor = 'rgba(255, 255, 255, 0.55)') => {
      ctx.beginPath();
      ctx.moveTo(j1.x, j1.y);
      ctx.lineTo(j2.x, j2.y);
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = thickness;
      ctx.stroke();
    };

    // Draw Bat (if Batting)
    if (actionType === 'batting' && skeleton.batTip) {
      // Draw thicker bat from hands
      ctx.beginPath();
      ctx.moveTo(skeleton.rightWrist.x, skeleton.rightWrist.y);
      ctx.lineTo(skeleton.batTip.x, skeleton.batTip.y);
      ctx.strokeStyle = '#d97706'; // wood color
      ctx.lineWidth = 8;
      ctx.stroke();

      // Bat face accent
      ctx.beginPath();
      ctx.moveTo(skeleton.rightWrist.x + 2, skeleton.rightWrist.y - 2);
      ctx.lineTo(skeleton.batTip.x + 2, skeleton.batTip.y - 2);
      ctx.strokeStyle = color; // Neon indicator
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Draw Ball (if Bowling)
    if (actionType === 'bowling' && skeleton.ballPosition) {
      ctx.beginPath();
      ctx.arc(skeleton.ballPosition.x, skeleton.ballPosition.y, 6, 0, 2 * Math.PI);
      ctx.fillStyle = '#ef4444'; // Red cricket ball
      ctx.fill();
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#ef4444';
      
      // Draw ball track line
      ctx.shadowBlur = 0; // reset shadow
    }

    // Connect skeleton joints (Bones)
    // Spine & Neck
    drawBone(skeleton.head, skeleton.neck, 3, 'rgba(255,255,255,0.7)');
    drawBone(skeleton.neck, { x: (skeleton.leftShoulder.x + skeleton.rightShoulder.x)/2, y: (skeleton.leftShoulder.y + skeleton.rightShoulder.y)/2 }, 3.5);

    // Shoulder line
    drawBone(skeleton.leftShoulder, skeleton.rightShoulder, 4);

    // Arms
    drawBone(skeleton.leftShoulder, skeleton.leftElbow, 3.5);
    drawBone(skeleton.leftElbow, skeleton.leftWrist, 3);
    drawBone(skeleton.rightShoulder, skeleton.rightElbow, 3.5);
    drawBone(skeleton.rightElbow, skeleton.rightWrist, 3);

    // Torso Hips
    const hipCenter = { x: (skeleton.leftHip.x + skeleton.rightHip.x) / 2, y: (skeleton.leftHip.y + skeleton.rightHip.y) / 2 };
    drawBone(skeleton.neck, hipCenter, 4);
    drawBone(skeleton.leftHip, skeleton.rightHip, 4);

    // Legs
    drawBone(skeleton.leftHip, skeleton.leftKnee, 4);
    drawBone(skeleton.leftKnee, skeleton.leftAnkle, 3.5);
    drawBone(skeleton.rightHip, skeleton.rightKnee, 4);
    drawBone(skeleton.rightKnee, skeleton.rightAnkle, 3.5);

    // Draw Joint Nodes (Glow circles)
    const joints = Object.values(skeleton).filter((j): j is Joint => j !== undefined && 'x' in j);
    
    joints.forEach(j => {
      // Don't draw node circle for batTip or ballPosition
      if (j.name === 'Bat Tip' || j.name === 'Cricket Ball') return;

      ctx.beginPath();
      ctx.arc(j.x, j.y, 4.5, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(j.x, j.y, 8, 0, 2 * Math.PI);
      ctx.strokeStyle = `${color}40`; // transparent halo
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    // Annotations (Angle labels)
    if (annotate) {
      ctx.font = '10px monospace';
      ctx.fillStyle = '#94a3b8';

      // 1. Calculate and display Elbow Bend Angle
      // Let's use the right elbow (main arm)
      const elbowAngle = calculateJointAngle(skeleton.rightShoulder, skeleton.rightElbow, skeleton.rightWrist);
      
      ctx.beginPath();
      ctx.arc(skeleton.rightElbow.x, skeleton.rightElbow.y, 14, 0, 2 * Math.PI);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.stroke();

      ctx.fillStyle = isPro ? '#00f0ff' : '#a3e635';
      ctx.fillText(`${elbowAngle}°`, skeleton.rightElbow.x + 18, skeleton.rightElbow.y + 4);

      // 2. Display Front Knee Angle
      // Let's use the left knee (front plant knee)
      const kneeAngle = calculateJointAngle(skeleton.leftHip, skeleton.leftKnee, skeleton.leftAnkle);
      ctx.fillText(`${kneeAngle}°`, skeleton.leftKnee.x - 28, skeleton.leftKnee.y + 4);

      // Draw bounding box details on overlay
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.fillText(isPro ? 'PRO MODEL: 98% MATCH' : 'LIVE ATHLETE POSTURE', 20, 28);
    }
  };

  // Calculate current display angle (for the scorecard)
  const currentSkeleton = getSkeletalFrame(session.type, Math.round(frame));
  const displayElbowAngle = calculateJointAngle(
    currentSkeleton.rightShoulder, 
    currentSkeleton.rightElbow, 
    currentSkeleton.rightWrist
  );

  const displayKneeAngle = calculateJointAngle(
    currentSkeleton.leftHip,
    currentSkeleton.leftKnee,
    currentSkeleton.leftAnkle
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Navigation and Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/50 dark:border-white/5 pb-4">
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400">
          <span className="hover:underline cursor-pointer" onClick={() => navigate('/')}>Dashboard</span>
          <ChevronRight className="w-3 h-3" />
          <span className="hover:underline cursor-pointer" onClick={() => navigate('/sessions')}>Vault</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-800 dark:text-slate-200 truncate max-w-[200px]">{session.title}</span>
        </div>

        <div className="flex items-center space-x-2 self-end sm:self-auto">
          <button className="p-2 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors">
            <Bookmark className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Analyzer Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Area: Canvas Viewport (7/12 width) */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-darkbg-700 shadow-sm space-y-4">
            
            {/* Viewport Canvas container */}
            <div className={`grid ${compareMode ? 'grid-cols-1 sm:grid-cols-2 gap-4' : 'grid-cols-1'} bg-[#06080F] rounded-xl p-4 overflow-hidden relative border border-white/5`}>
              
              {/* User Canvas */}
              <div className="flex flex-col items-center justify-center">
                <canvas 
                  ref={canvasRef} 
                  width={340} 
                  height={320} 
                  className="w-full max-w-[340px] aspect-square rounded-lg bg-darkbg-900 border border-white/[0.02]"
                />
                <span className="text-[10px] font-bold text-cricket-neon mt-2 uppercase tracking-widest">
                  Athlete (Lawrence)
                </span>
              </div>

              {/* Pro Canvas (Compare mode) */}
              {compareMode && (
                <div className="flex flex-col items-center justify-center border-t sm:border-t-0 sm:border-l border-white/10 pt-4 sm:pt-0 sm:pl-4">
                  <canvas 
                    ref={proCanvasRef} 
                    width={340} 
                    height={320} 
                    className="w-full max-w-[340px] aspect-square rounded-lg bg-darkbg-900 border border-white/[0.02]"
                  />
                  <span className="text-[10px] font-bold text-cricket-cyan mt-2 uppercase tracking-widest">
                    Pro Match ({session.proCompare.name})
                  </span>
                </div>
              )}

              {/* Floating Real-time HUD stats */}
              <div className="absolute top-6 left-6 pointer-events-none font-mono text-[10px] space-y-1.5 p-2 bg-darkbg-900/90 rounded border border-white/5">
                <div className="text-white font-extrabold uppercase text-[9px] tracking-wider mb-1 text-cricket-neon">Posture HUD</div>
                <div>Elbow Bend: <span className="text-white font-bold">{displayElbowAngle}°</span></div>
                <div>Knee Flex: <span className="text-white font-bold">{displayKneeAngle}°</span></div>
                <div>Sim Frame: <span className="text-white font-bold">{Math.round(frame)}/100</span></div>
              </div>
            </div>

            {/* Playback HUD controls */}
            <div className="space-y-4">
              
              {/* Timeline Scrub Slider */}
              <div className="flex items-center space-x-4">
                <span className="text-[10px] font-mono text-slate-400 w-8 text-right">F-{Math.round(frame)}</span>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={Math.round(frame)}
                  onChange={(e) => {
                    setFrame(parseInt(e.target.value));
                    setIsPlaying(false); // Pause on scrub
                  }}
                  className="flex-1 h-1.5 rounded-lg appearance-none cursor-pointer bg-slate-100 dark:bg-white/10 accent-cricket-neon focus:outline-none"
                />
                <span className="text-[10px] font-mono text-slate-400 w-8">F-100</span>
              </div>

              {/* Controller buttons */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-9 h-9 rounded-xl bg-cricket-neon text-darkbg-900 hover:bg-cricket-neon/90 flex items-center justify-center transition-colors"
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-darkbg-900 text-darkbg-900" /> : <Play className="w-4 h-4 fill-darkbg-900 text-darkbg-900 translate-x-[1px]" />}
                  </button>
                  <button
                    onClick={() => { setFrame(0); setIsPlaying(false); }}
                    className="p-2 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  {/* Playback speed toggle */}
                  <div className="flex bg-slate-100 dark:bg-white/[0.02] p-1 rounded-lg border border-slate-200 dark:border-white/5 text-[10px] font-bold font-mono">
                    <button 
                      onClick={() => setSpeed(0.25)}
                      className={`px-2 py-1 rounded ${speed === 0.25 ? 'bg-white dark:bg-white/10 text-slate-950 dark:text-white shadow-sm' : 'text-slate-400'}`}
                    >
                      0.25x
                    </button>
                    <button 
                      onClick={() => setSpeed(0.5)}
                      className={`px-2 py-1 rounded ${speed === 0.5 ? 'bg-white dark:bg-white/10 text-slate-950 dark:text-white shadow-sm' : 'text-slate-400'}`}
                    >
                      0.50x
                    </button>
                    <button 
                      onClick={() => setSpeed(1)}
                      className={`px-2 py-1 rounded ${speed === 1 ? 'bg-white dark:bg-white/10 text-slate-950 dark:text-white shadow-sm' : 'text-slate-400'}`}
                    >
                      1.0x
                    </button>
                  </div>
                </div>

                {/* Option Toggles */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowAnnotations(!showAnnotations)}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      showAnnotations 
                        ? 'bg-slate-100 dark:bg-white/10 border-slate-350 dark:border-white/10 text-slate-900 dark:text-white' 
                        : 'border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.01] text-slate-400'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Overlay angles</span>
                  </button>

                  <button
                    onClick={() => setCompareMode(!compareMode)}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      compareMode 
                        ? 'bg-cricket-cyan/10 border-cricket-cyan/30 text-cricket-cyan' 
                        : 'border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.01] text-slate-400'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Pro Overlay</span>
                  </button>
                </div>

              </div>

            </div>

          </div>

          {/* AI Recommendations Checklist */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-darkbg-700 shadow-sm space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">AI Posture Corrections</h3>
            <div className="space-y-3">
              {session.recommendations.map((rec, idx) => (
                <div key={idx} className="flex items-start text-xs p-3 rounded-xl bg-slate-50 dark:bg-white/[0.01] border border-slate-200/50 dark:border-white/5">
                  <div className="w-5 h-5 rounded-full bg-cricket-neon/10 text-cricket-neon flex items-center justify-center shrink-0 mr-3 mt-0.5 font-extrabold">
                    {idx + 1}
                  </div>
                  <span className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    {rec}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Area: Scores & Critique Sidebar (5/12 width) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Score card block */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-darkbg-700 shadow-sm space-y-6">
            
            {/* Index Ring and Label */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-xl text-slate-900 dark:text-white">Technique Analysis</h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Verified biomechanical score</p>
              </div>

              {/* Large Score Indicator */}
              <div className="relative w-16 h-16 flex items-center justify-center rounded-2xl bg-gradient-to-tr from-cricket-neon/10 via-darkbg-900/10 to-transparent border border-cricket-neon/20 shadow-lg shadow-cricket-neon/5">
                <div className="text-center">
                  <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{session.overallScore}</span>
                  <span className="text-[9px] block font-extrabold text-cricket-neon uppercase tracking-wider -mt-1">INDEX</span>
                </div>
              </div>
            </div>

            {/* Critique breakdown progression metrics */}
            <div className="space-y-4 border-t border-slate-100 dark:border-white/5 pt-4">
              {/* Setup */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400 font-semibold">1. Stance & Setup</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{session.metrics.setup}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100 dark:bg-white/[0.04] overflow-hidden">
                  <div className="h-full bg-cricket-neon rounded-full" style={{ width: `${session.metrics.setup}%` }} />
                </div>
              </div>

              {/* Backswing */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400 font-semibold">2. Backlift & Swing Path</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{session.metrics.backswing}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100 dark:bg-white/[0.04] overflow-hidden">
                  <div className="h-full bg-cricket-neon rounded-full" style={{ width: `${session.metrics.backswing}%` }} />
                </div>
              </div>

              {/* Contact */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400 font-semibold">3. Impact / Contact point</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{session.metrics.contact}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100 dark:bg-white/[0.04] overflow-hidden">
                  <div className="h-full bg-cricket-orange rounded-full" style={{ width: `${session.metrics.contact}%` }} />
                </div>
              </div>

              {/* Follow through */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400 font-semibold">4. Follow-Through Balance</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{session.metrics.followThrough}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100 dark:bg-white/[0.04] overflow-hidden">
                  <div className="h-full bg-cricket-neon rounded-full" style={{ width: `${session.metrics.followThrough}%` }} />
                </div>
              </div>
            </div>

          </div>

          {/* Detailed Critique Commentary Accordion */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-darkbg-700 shadow-sm space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">AI Critique Breakdown</h3>
            
            {/* Tab Header buttons */}
            <div className="flex flex-wrap bg-slate-100 dark:bg-white/[0.02] p-1 rounded-xl border border-slate-200 dark:border-white/5 text-[10px] font-bold">
              <button 
                onClick={() => setActiveCritiqueTab('setup')}
                className={`flex-1 min-w-[70px] py-1.5 rounded-lg transition-colors ${activeCritiqueTab === 'setup' ? 'bg-white dark:bg-white/10 text-slate-950 dark:text-white' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}
              >
                1. Setup
              </button>
              <button 
                onClick={() => setActiveCritiqueTab('backswing')}
                className={`flex-1 min-w-[70px] py-1.5 rounded-lg transition-colors ${activeCritiqueTab === 'backswing' ? 'bg-white dark:bg-white/10 text-slate-950 dark:text-white' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}
              >
                2. Swing
              </button>
              <button 
                onClick={() => setActiveCritiqueTab('contact')}
                className={`flex-1 min-w-[70px] py-1.5 rounded-lg transition-colors ${activeCritiqueTab === 'contact' ? 'bg-white dark:bg-white/10 text-slate-950 dark:text-white' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}
              >
                3. Impact
              </button>
              <button 
                onClick={() => setActiveCritiqueTab('followThrough')}
                className={`flex-1 min-w-[70px] py-1.5 rounded-lg transition-colors ${activeCritiqueTab === 'followThrough' ? 'bg-white dark:bg-white/10 text-slate-950 dark:text-white' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}
              >
                4. Follow
              </button>
            </div>

            {/* Critique Comment Panel */}
            <div className="p-4 rounded-xl border border-slate-200/50 dark:border-white/5 bg-slate-50 dark:bg-white/[0.01] min-h-[90px] flex items-center">
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {session.critique[activeCritiqueTab]}
              </p>
            </div>
          </div>

          {/* Professional Coach Review Submit Desk */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/5 bg-gradient-to-br from-purple-950/5 via-darkbg-700 to-purple-950/5 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 text-purple-400">
              <MessageSquareCode className="w-5 h-5" />
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Elite Coach Audit</h3>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed">
              Send this biomechanical scorecard directly to one of our verified human cricket coaches for an audio analysis and training review.
            </p>

            <AnimatePresence mode="wait">
              {!isAudited ? (
                <motion.button
                  key="submit-btn"
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setIsAudited(true);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-purple-500 hover:bg-purple-600 text-white shadow-lg shadow-purple-500/10 transition-colors flex items-center justify-center space-x-1.5"
                >
                  <span>Submit to Brett Lee / Sangakkara</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </motion.button>
              ) : (
                <motion.div
                  key="success-msg"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center space-x-2 p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold"
                >
                  <Check className="w-4 h-4" />
                  <span>Submitted to Coaching Desk! We will notify you.</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </motion.div>
  );
}
