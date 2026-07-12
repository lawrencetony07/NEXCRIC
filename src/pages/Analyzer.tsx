import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Check, 
  Users, 
  Sparkles
} from 'lucide-react';
import { Session, getSkeletalFrame, Skeleton, Joint } from '../api/coachingApi';

interface AnalyzerProps {
  sessions: Session[];
}

export default function Analyzer({ sessions }: AnalyzerProps) {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  // Find active session
  const session = sessions.find(s => s.id === sessionId) || sessions[0];

  // UI States
  const [frame, setFrame] = useState(50); // contact frame default
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<0.25 | 0.5 | 1>(0.5); // slow-mo
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [compareMode, setCompareMode] = useState(false);
  const [activeCritiqueTab, setActiveCritiqueTab] = useState<'setup' | 'backswing' | 'contact' | 'followThrough'>('contact');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const proCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Playback timer
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const updateFrame = (time: number) => {
      if (isPlaying) {
        const delta = time - lastTime;
        const framesPerSec = 30 * speed;
        const increment = (delta / 1000) * framesPerSec * 3;
        
        setFrame(prev => {
          let next = prev + increment;
          if (next >= 100) {
            next = 0;
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

  // Handle drawings
  useEffect(() => {
    if (!session) return;
    const currentFrameIndex = Math.round(frame);
    
    // User Frame
    const userSkeleton = getSkeletalFrame(session.type, currentFrameIndex);
    drawSkeletonOnCanvas(canvasRef.current, userSkeleton, showAnnotations, '#10b981', session.type);

    // Pro Frame
    if (compareMode) {
      const proSkeleton = getSkeletalFrame(session.type, currentFrameIndex);
      drawSkeletonOnCanvas(proCanvasRef.current, proSkeleton, showAnnotations, '#00f0ff', session.type, true);
    }
  }, [frame, session, showAnnotations, compareMode]);

  const calculateJointAngle = (p1: Joint, center: Joint, p2: Joint): number => {
    const v1 = { x: p1.x - center.x, y: p1.y - center.y };
    const v2 = { x: p2.x - center.x, y: p2.y - center.y };
    const dotProduct = v1.x * v2.x + v1.y * v2.y;
    const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
    const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
    if (mag1 === 0 || mag2 === 0) return 0;
    return Math.round((Math.acos(dotProduct / (mag1 * mag2)) * 180) / Math.PI);
  };

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

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background Pitch Crease
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 40) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
    }

    // Connect skeleton bones
    const drawBone = (j1: Joint, j2: Joint, w = 3.5, stroke = 'rgba(255, 255, 255, 0.55)') => {
      ctx.beginPath();
      ctx.moveTo(j1.x, j1.y);
      ctx.lineTo(j2.x, j2.y);
      ctx.strokeStyle = stroke;
      ctx.lineWidth = w;
      ctx.stroke();
    };

    // Draw Bat
    if (actionType === 'batting' && skeleton.batTip) {
      ctx.beginPath();
      ctx.moveTo(skeleton.rightWrist.x, skeleton.rightWrist.y);
      ctx.lineTo(skeleton.batTip.x, skeleton.batTip.y);
      ctx.strokeStyle = '#d97706'; // willow wood gold
      ctx.lineWidth = 8;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(skeleton.rightWrist.x + 1, skeleton.rightWrist.y - 1);
      ctx.lineTo(skeleton.batTip.x + 1, skeleton.batTip.y - 1);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Draw Ball
    if (actionType === 'bowling' && skeleton.ballPosition) {
      ctx.beginPath();
      ctx.arc(skeleton.ballPosition.x, skeleton.ballPosition.y, 6, 0, 2 * Math.PI);
      ctx.fillStyle = '#ef4444'; // leather red ball
      ctx.fill();
    }

    drawBone(skeleton.head, skeleton.neck, 3, 'rgba(255,255,255,0.7)');
    drawBone(skeleton.neck, { x: (skeleton.leftShoulder.x + skeleton.rightShoulder.x)/2, y: (skeleton.leftShoulder.y + skeleton.rightShoulder.y)/2 }, 3.5);
    drawBone(skeleton.leftShoulder, skeleton.rightShoulder, 4);
    drawBone(skeleton.leftShoulder, skeleton.leftElbow, 3.5);
    drawBone(skeleton.leftElbow, skeleton.leftWrist, 3);
    drawBone(skeleton.rightShoulder, skeleton.rightElbow, 3.5);
    drawBone(skeleton.rightElbow, skeleton.rightWrist, 3);
    
    const hipCenter = { x: (skeleton.leftHip.x + skeleton.rightHip.x) / 2, y: (skeleton.leftHip.y + skeleton.rightHip.y) / 2 };
    drawBone(skeleton.neck, hipCenter, 4);
    drawBone(skeleton.leftHip, skeleton.rightHip, 4);
    drawBone(skeleton.leftHip, skeleton.leftKnee, 4);
    drawBone(skeleton.leftKnee, skeleton.leftAnkle, 3.5);
    drawBone(skeleton.rightHip, skeleton.rightKnee, 4);
    drawBone(skeleton.rightKnee, skeleton.rightAnkle, 3.5);

    // Draw Joint Nodes
    const joints = Object.values(skeleton).filter((j): j is Joint => j !== undefined && 'x' in j);
    joints.forEach(j => {
      if (j.name === 'Bat Tip' || j.name === 'Cricket Ball') return;
      ctx.beginPath();
      ctx.arc(j.x, j.y, 4.5, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(j.x, j.y, 8, 0, 2 * Math.PI);
      ctx.strokeStyle = `${color}40`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    if (annotate) {
      ctx.font = '10px monospace';
      const elbowAngle = calculateJointAngle(skeleton.rightShoulder, skeleton.rightElbow, skeleton.rightWrist);
      ctx.beginPath();
      ctx.arc(skeleton.rightElbow.x, skeleton.rightElbow.y, 14, 0, 2 * Math.PI);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.stroke();
      ctx.fillStyle = isPro ? '#00f0ff' : '#10b981';
      ctx.fillText(`${elbowAngle}°`, skeleton.rightElbow.x + 18, skeleton.rightElbow.y + 4);

      const kneeAngle = calculateJointAngle(skeleton.leftHip, skeleton.leftKnee, skeleton.leftAnkle);
      ctx.fillText(`${kneeAngle}°`, skeleton.leftKnee.x - 28, skeleton.leftKnee.y + 4);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-5">
        <div>
          <button 
            onClick={() => navigate('/dashboard')}
            className="text-xs text-slate-400 hover:text-white flex items-center space-x-1 mb-1 font-bold"
          >
            <span>Back to Cockpit</span>
          </button>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white truncate">
            {session.title}
          </h1>
        </div>
      </div>

      {/* Screen Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Video Review Area (8/12 width) */}
        <div className="lg:col-span-8 space-y-4">
          
          <div className={`grid ${compareMode ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
            
            {/* User Stance Window */}
            <div className="relative rounded-2xl border border-white/5 bg-slate-955 p-4 aspect-square flex flex-col justify-between overflow-hidden">
              <div className="absolute top-4 left-4 z-10 bg-darkbg-900/85 px-3 py-1 rounded-lg border border-white/10 flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cricket-neon"></span>
                <span className="text-[10px] font-bold text-slate-350 uppercase tracking-widest">Player Stance</span>
              </div>
              <canvas ref={canvasRef} width={400} height={400} className="w-full h-full my-auto" />
            </div>

            {/* Pro Comparison Window */}
            {compareMode && (
              <div className="relative rounded-2xl border border-white/5 bg-slate-955 p-4 aspect-square flex flex-col justify-between overflow-hidden">
                <div className="absolute top-4 left-4 z-10 bg-darkbg-900/85 px-3 py-1 rounded-lg border border-white/10 flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cricket-cyan"></span>
                  <span className="text-[10px] font-bold text-slate-350 uppercase tracking-widest">Pro: {session.proCompare.name}</span>
                </div>
                <canvas ref={proCanvasRef} width={400} height={400} className="w-full h-full my-auto" />
              </div>
            )}

          </div>

          {/* Timeline & Scrubber controllers */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-darkbg-700 space-y-4">
            
            {/* Scrubber Timeline */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>0.0s (Stance)</span>
                <span>0.4s (Downswing)</span>
                <span>0.8s (Release/Contact)</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="99" 
                value={Math.round(frame)}
                onChange={(e) => {
                  setFrame(Number(e.target.value));
                  setIsPlaying(false); // stop loop on manual scrub
                }}
                className="w-full h-1.5 bg-slate-100 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-cricket-neon" 
              />
            </div>

            {/* Playback Buttons */}
            <div className="flex items-center justify-between">
              
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2.5 rounded-xl bg-cricket-neon text-darkbg-900 hover:bg-cricket-neon/90 transition-all"
                >
                  {isPlaying ? <Pause className="w-4 h-4 text-darkbg-900" /> : <Play className="w-4 h-4 fill-darkbg-900 text-darkbg-900" />}
                </button>
                <button 
                  onClick={() => setFrame(0)}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 text-slate-400 hover:text-white"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Speed slow-mo controllers */}
              <div className="flex bg-slate-100 dark:bg-white/[0.03] p-1 rounded-xl border border-slate-200 dark:border-white/5">
                {[0.25, 0.5, 1].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSpeed(s as any)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                      speed === s 
                        ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-455 hover:text-white'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>

            </div>

          </div>

        </div>

        {/* Right Side: Biomechanical Scorecard (4/12 width) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Audit Scorecard */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-darkbg-700 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-450">Biomechanics Index</span>
              <span className="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase bg-cricket-neon/15 text-cricket-neon">
                Audit Completed
              </span>
            </div>
            
            <div className="flex items-baseline space-x-2">
              <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                {session.overallScore}
              </span>
              <span className="text-xs font-bold text-slate-400">/ 100</span>
            </div>

            {/* Compare Toggle */}
            <button
              onClick={() => setCompareMode(!compareMode)}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold border transition-all flex items-center justify-center space-x-2 ${
                compareMode 
                  ? 'bg-cricket-cyan/15 border-cricket-cyan text-cricket-cyan'
                  : 'border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.03] text-slate-500 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>{compareMode ? "Disable Pro Overlay" : "Superimpose Pro Form"}</span>
            </button>
          </div>

          {/* Critique Timeline Tabs */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-darkbg-700 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Form Critiques</h3>
            
            {/* Critique Tabs */}
            <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-slate-100 dark:bg-white/[0.03] border border-slate-250 dark:border-white/5">
              {(['setup', 'backswing', 'contact', 'followThrough'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveCritiqueTab(tab)}
                  className={`py-1 rounded text-[10px] font-bold uppercase truncate transition-all ${
                    activeCritiqueTab === tab
                      ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white'
                      : 'text-slate-455 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="p-3 rounded-xl bg-slate-50/50 dark:bg-darkbg-850 border border-slate-200/50 dark:border-white/5">
              <p className="text-xs text-slate-605 dark:text-slate-350 leading-relaxed font-bold">
                {session.critique[activeCritiqueTab]}
              </p>
            </div>
          </div>

          {/* AI Adjustments Checklist */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/5 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-darkbg-700 dark:to-darkbg-850 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 text-cricket-neon">
              <Sparkles className="w-4 h-4" />
              <h3 className="font-extrabold text-slate-900 dark:text-white text-xs uppercase tracking-wider">AI Adjustments</h3>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-350 font-medium">
              {session.recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start">
                  <Check className="w-4 h-4 mr-2 text-cricket-neon shrink-0 mt-0.5" />
                  <span className="font-bold">{rec}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
}
