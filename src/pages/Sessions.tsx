import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UploadCloud, 
  Search, 
  Video, 
  ChevronRight, 
  Sparkles,
  Loader2,
} from 'lucide-react';
import { Session, MetricBreakdown } from '../api/coachingApi';
import SpecularCard from '../components/SpecularCard';

interface SessionsProps {
  sessions: Session[];
  onAddSession: (session: Session) => void;
}

export default function Sessions({ sessions, onAddSession }: SessionsProps) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'batting' | 'bowling'>('all');
  
  // Upload States
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgressStep, setUploadProgressStep] = useState(0);
  const [sessionTypeToCreate, setSessionTypeToCreate] = useState<'batting' | 'bowling'>('batting');
  const [customTitle, setCustomTitle] = useState('');

  const steps = [
    "Ingesting high-framerate video stream (60 FPS)...",
    "Running OpenPose model to locate 14 critical joint nodes...",
    "Extracting 3D skeletal vectors & calculating elbow/knee flexion angles...",
    "Benchmarking posture constraints against CricVerse Elite database...",
    "Writing detailed biomechanical scorecard & recommendations..."
  ];

  // Filtering
  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' ? true : session.type === activeTab;
    return matchesSearch && matchesTab;
  });

  const handleStartSimulatedUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle) return;

    setIsUploading(true);
    setUploadProgressStep(0);

    const interval = setInterval(() => {
      setUploadProgressStep(prev => {
        if (prev >= steps.length - 1) {
          clearInterval(interval);
          
          setTimeout(() => {
            const randomScore = Math.floor(Math.random() * 20) + 75; // 75 - 95
            const metrics: MetricBreakdown = {
              setup: Math.floor(Math.random() * 15) + 80,
              backswing: Math.floor(Math.random() * 20) + 75,
              contact: Math.floor(Math.random() * 25) + 70,
              followThrough: Math.floor(Math.random() * 15) + 80
            };

            const newId = `s-${Date.now()}`;
            const newSession: Session = {
              id: newId,
              type: sessionTypeToCreate,
              title: customTitle,
              date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
              thumbnail: sessionTypeToCreate === 'batting' 
                ? "https://images.unsplash.com/photo-1540747737956-37872c76d1fd?w=400&h=225&fit=crop"
                : "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&h=225&fit=crop",
              videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-cricket-batsman-hitting-a-ball-34351-large.mp4",
              overallScore: randomScore,
              metrics,
              critique: {
                setup: "Ready stance looks stable. Alignments are matching pro limits within 5% variance.",
                backswing: "Backlift looks clean. Back leg stance shows excellent stability.",
                contact: `AI identified a minor angle anomaly at point of contact. Your joint flexion is slightly off by ${Math.floor(Math.random() * 15) + 5} degrees.`,
                followThrough: "Follow-through was well controlled, displaying clean weight deceleration."
              },
              recommendations: [
                "Practice shadow drills to lock the joints at impact.",
                "Ensure your head points down the line of delivery at stance."
              ],
              proCompare: {
                name: sessionTypeToCreate === 'batting' ? "Virat Kohli" : "Jasprit Bumrah",
                avgScore: 96,
                videoUrl: "",
                avatar: sessionTypeToCreate === 'batting'
                  ? "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=100&h=100&fit=crop"
                  : "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
                elbowAngleDiff: Math.floor(Math.random() * 20) - 10
              }
            };

            onAddSession(newSession);
            setIsUploading(false);
            setCustomTitle('');
            
            navigate(`/analyzer/${newId}`);
          }, 1000);
          return prev;
        }
        return prev + 1;
      });
    }, 1800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="border-b border-white/5 pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Session Vault
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
          Upload and organize your batting and bowling sessions for biomechanical audits.
        </p>
      </div>

      {/* Upload Zone & Catalog */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Upload Form */}
        <div className="lg:col-span-1">
          <SpecularCard
            radius={16}
            lineColor="#10b981"
            baseColor="rgba(255, 255, 255, 0.05)"
            intensity={1.5}
            thickness={1.5}
            className="w-full flex"
          >
            <div className="p-6 rounded-2xl bg-white dark:bg-darkbg-700 shadow-sm space-y-6 w-full h-full">
              <div className="flex items-center space-x-2 text-cricket-neon">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">New AI Posture Audit</h3>
              </div>

              <form onSubmit={handleStartSimulatedUpload} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">
                    Session Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Cover Drive Net Practice"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-darkbg-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cricket-neon/30 focus:border-cricket-neon transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">
                    Analysis Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSessionTypeToCreate('batting')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                        sessionTypeToCreate === 'batting'
                          ? 'bg-cricket-neon/15 border-cricket-neon text-cricket-neon'
                          : 'border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02] text-slate-550 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      Batting Stance
                    </button>
                    <button
                      type="button"
                      onClick={() => setSessionTypeToCreate('bowling')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                        sessionTypeToCreate === 'bowling'
                          ? 'bg-cricket-cyan/15 border-cricket-cyan text-cricket-cyan'
                          : 'border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02] text-slate-550 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      Bowling Release
                    </button>
                  </div>
                </div>

                {/* Drop Zone */}
                <div className="border border-dashed border-slate-200 dark:border-white/10 rounded-2xl p-6 text-center bg-slate-50 dark:bg-darkbg-800 relative hover:border-cricket-neon/30 transition-colors">
                  <UploadCloud className="w-8 h-8 text-slate-400 dark:text-slate-500 mx-auto mb-2" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-350 block mb-1">
                    Drag and drop session video
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 block mb-3">
                    MP4 or MOV, up to 100MB (Max 30s)
                  </span>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file && !customTitle) {
                        setCustomTitle(file.name.replace(/\.[^/.]+$/, ""));
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isUploading}
                  className="w-full py-2.5 px-4 rounded-xl text-sm font-bold bg-cricket-neon text-darkbg-900 hover:bg-cricket-neon/90 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <span>Initialize AI Analysis</span>
                </button>
              </form>
            </div>
          </SpecularCard>
        </div>

        {/* Catalog */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-405" />
              <input
                type="text"
                placeholder="Search audit sessions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-sm pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-darkbg-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cricket-neon focus:border-cricket-neon transition-all"
              />
            </div>

            <div className="flex bg-slate-100 dark:bg-white/[0.03] p-1 rounded-xl border border-slate-200 dark:border-white/5 self-stretch sm:self-auto">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'all'
                    ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-550 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab('batting')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'batting'
                    ? 'bg-cricket-neon/15 text-cricket-neon shadow-sm'
                    : 'text-slate-550 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Batting
              </button>
              <button
                onClick={() => setActiveTab('bowling')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'bowling'
                    ? 'bg-cricket-cyan/15 text-cricket-cyan shadow-sm'
                    : 'text-slate-550 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Bowling
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredSessions.map((session) => {
              const cardColor = session.overallScore >= 80 ? "#10b981" : session.overallScore >= 70 ? "#00f0ff" : "#f59e0b";
              return (
                <SpecularCard
                  key={session.id}
                  radius={16}
                  lineColor={cardColor}
                  baseColor="rgba(255, 255, 255, 0.05)"
                  intensity={1.5}
                  thickness={1.5}
                  className="w-full flex cursor-pointer"
                >
                  <div
                    onClick={() => navigate(`/analyzer/${session.id}`)}
                    className="group bg-white dark:bg-darkbg-700/80 backdrop-blur-sm rounded-2xl overflow-hidden w-full h-full transition-all duration-300"
                  >
                    <div className="aspect-video relative overflow-hidden bg-slate-950">
                      <img 
                        src={session.thumbnail} 
                        alt={session.title} 
                        className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute top-3 right-3 px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wide bg-slate-900/90 text-white border border-white/10">
                        {session.type}
                      </div>
                      <div className="absolute bottom-3 left-3 flex items-center space-x-1 bg-darkbg-900/90 border border-cricket-neon/20 px-2 py-1 rounded-lg">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Score</span>
                        <span className="text-xs text-cricket-neon font-black">{session.overallScore}</span>
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      <span className="text-[10px] text-slate-400 font-bold block">{session.date}</span>
                      <h3 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-cricket-neon transition-colors truncate">
                        {session.title}
                      </h3>
                    </div>
                  </div>
                </SpecularCard>
              );
            })}
          </div>

        </div>

      </div>

      {/* Processing Loader Modal */}
      <AnimatePresence>
        {isUploading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-darkbg-900/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="w-full max-w-md p-8 rounded-3xl border border-white/5 bg-darkbg-700 text-center space-y-6 shadow-2xl glow-border-green"
            >
              <Loader2 className="w-12 h-12 text-cricket-neon animate-spin mx-auto" />
              
              <div className="space-y-2">
                <h3 className="text-xl font-extrabold text-white">Ingesting Analytics Data</h3>
                <p className="text-xs text-slate-405 leading-relaxed font-bold">
                  CricVerse AI is extracting postural skeletal coordinates...
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <motion.div 
                    className="h-full bg-cricket-neon rounded-full"
                    animate={{ width: `${((uploadProgressStep + 1) / steps.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <div className="h-16 flex items-center justify-center p-3 rounded-xl bg-darkbg-800 border border-white/5">
                  <span className="text-xs font-mono text-cricket-neon tracking-wide">
                    {steps[uploadProgressStep]}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
