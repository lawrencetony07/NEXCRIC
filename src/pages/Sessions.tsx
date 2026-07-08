import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UploadCloud, 
  Search, 
  SlidersHorizontal, 
  Video, 
  ChevronRight, 
  Trash2,
  Calendar,
  Sparkles,
  AlertCircle,
  Loader2,
  CheckCircle,
  Play
} from 'lucide-react';
import { Session, MetricBreakdown } from '../api/coachingApi';

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

  // Start Simulated AI processing
  const handleStartSimulatedUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle) return;

    setIsUploading(true);
    setUploadProgressStep(0);

    // Set interval to increment step
    const interval = setInterval(() => {
      setUploadProgressStep(prev => {
        if (prev >= steps.length - 1) {
          clearInterval(interval);
          
          // Complete and create session
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
            
            // Navigate directly to the new session's analyzer
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
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Session Vault
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Upload and organize your batting and bowling sessions for skeletal node extraction.
        </p>
      </div>

      {/* Upload Zone & Filter Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Upload Form (1/3 width) */}
        <div className="lg:col-span-1">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-darkbg-700 shadow-sm space-y-6">
            <div className="flex items-center space-x-2 text-cricket-neon">
              <Sparkles className="w-5 h-5" />
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">New AI Posture Audit</h3>
            </div>

            <form onSubmit={handleStartSimulatedUpload} className="space-y-4">
              {/* Session Title */}
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
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-darkbg-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cricket-neon/50 focus:border-cricket-neon transition-all"
                />
              </div>

              {/* Session Type Selector */}
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
                        ? 'bg-cricket-neon/10 border-cricket-neon text-cricket-neon'
                        : 'border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02] text-slate-500 hover:text-slate-950 dark:hover:text-white'
                    }`}
                  >
                    Batting Technique
                  </button>
                  <button
                    type="button"
                    onClick={() => setSessionTypeToCreate('bowling')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      sessionTypeToCreate === 'bowling'
                        ? 'bg-cricket-cyan/10 border-cricket-cyan text-cricket-cyan'
                        : 'border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02] text-slate-500 hover:text-slate-950 dark:hover:text-white'
                    }`}
                  >
                    Bowling Action
                  </button>
                </div>
              </div>

              {/* Upload Zone */}
              <div className="border border-dashed border-slate-200 dark:border-white/10 rounded-2xl p-6 text-center bg-slate-50 dark:bg-darkbg-800 relative hover:border-cricket-neon/30 transition-colors">
                <UploadCloud className="w-8 h-8 text-slate-400 dark:text-slate-500 mx-auto mb-2" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Drag and drop batting/bowling video
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block mb-3">
                  MP4, MOV, up to 100MB (Max 30s)
                </span>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file && !customTitle) {
                      // Autocomplete title
                      setCustomTitle(file.name.replace(/\.[^/.]+$/, ""));
                    }
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>

              <button
                type="submit"
                disabled={isUploading}
                className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold bg-cricket-neon text-darkbg-900 hover:bg-cricket-neon/90 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <span>Initialize AI Analysis</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Sessions Catalog (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Controls: Search, Tabs */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search audit sessions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-sm pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-darkbg-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cricket-neon focus:border-cricket-neon transition-all"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex bg-slate-100 dark:bg-white/[0.03] p-1 rounded-xl border border-slate-200 dark:border-white/5 self-stretch sm:self-auto">
              <button
                onClick={() => setActiveTab('all')}
                className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'all'
                    ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab('batting')}
                className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'batting'
                    ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                }`}
              >
                Batting
              </button>
              <button
                onClick={() => setActiveTab('bowling')}
                className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'bowling'
                    ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                }`}
              >
                Bowling
              </button>
            </div>
          </div>

          {/* Session Cards Grid */}
          {filteredSessions.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filteredSessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => navigate(`/analyzer/${session.id}`)}
                  className="group bg-white dark:bg-darkbg-700 border border-slate-200 dark:border-white/5 hover:border-cricket-neon/20 hover:shadow-lg hover:shadow-cricket-neon/5 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300"
                >
                  {/* Thumbnail viewport */}
                  <div className="aspect-video w-full overflow-hidden relative bg-slate-950 flex items-center justify-center">
                    <img 
                      src={session.thumbnail} 
                      alt={session.title} 
                      className="w-full h-full object-cover opacity-70 group-hover:scale-102 transition-transform duration-500" 
                    />
                    <div className="absolute top-4 right-4 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-slate-950/80 text-white border border-white/5">
                      {session.type}
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-darkbg-900/60 to-transparent flex items-end justify-between p-4">
                      {/* Overall Rating Chip */}
                      <div className="flex items-center space-x-1 bg-darkbg-900/90 border border-cricket-neon/20 px-2.5 py-1 rounded-lg">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Index</span>
                        <span className="text-xs text-cricket-neon font-black">{session.overallScore}</span>
                      </div>
                      
                      {/* Interactive click symbol */}
                      <div className="w-8 h-8 rounded-full bg-cricket-neon text-darkbg-900 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Play className="w-3.5 h-3.5 fill-darkbg-900 text-darkbg-900 translate-x-[1px]" />
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5 text-slate-400">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-semibold">{session.date}</span>
                      </div>
                    </div>
                    
                    <h4 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-cricket-neon transition-colors truncate">
                      {session.title}
                    </h4>

                    {/* Breakdown metrics mini-grid */}
                    <div className="grid grid-cols-4 gap-1.5 text-[10px] border-t border-slate-100 dark:border-white/5 pt-3">
                      <div>
                        <span className="text-slate-400 block font-medium">Setup</span>
                        <span className="font-bold text-slate-700 dark:text-slate-300">{session.metrics.setup}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">Swing</span>
                        <span className="font-bold text-slate-700 dark:text-slate-300">{session.metrics.backswing}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">Contact</span>
                        <span className="font-bold text-slate-700 dark:text-slate-300">{session.metrics.contact}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">Follow</span>
                        <span className="font-bold text-slate-700 dark:text-slate-300">{session.metrics.followThrough}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-16 border border-dashed border-slate-200 dark:border-white/5 rounded-2xl text-center bg-white dark:bg-darkbg-700">
              <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">No Audits Found</h4>
              <p className="text-xs text-slate-400 mt-1">Try resetting the filter tabs or upload a new swing.</p>
            </div>
          )}

        </div>

      </div>

      {/* Simulated AI Uploading Overlay */}
      <AnimatePresence>
        {isUploading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#06080F]/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="max-w-lg w-full p-8 rounded-2xl bg-darkbg-800 border border-white/5 shadow-2xl relative overflow-hidden"
            >
              {/* Ambient neon radial glows */}
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-cricket-neon/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-cricket-cyan/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="text-center space-y-6 relative">
                {/* Loader Spinner */}
                <div className="relative w-16 h-16 mx-auto">
                  <div className="absolute inset-0 rounded-full border-4 border-white/5"></div>
                  <Loader2 className="w-16 h-16 text-cricket-neon animate-spin" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-black text-white flex items-center justify-center space-x-1.5">
                    <span>Analyzing Neural Kinematics</span>
                    <Sparkles className="w-4 h-4 text-cricket-neon animate-pulse" />
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Session: <span className="text-cricket-cyan">{customTitle}</span>
                  </p>
                </div>

                {/* Progress Timeline Stepper */}
                <div className="text-left border border-white/5 bg-darkbg-900/50 p-4 rounded-xl space-y-3.5 font-sans">
                  {steps.map((step, idx) => {
                    const isActive = idx === uploadProgressStep;
                    const isCompleted = idx < uploadProgressStep;
                    return (
                      <div 
                        key={step} 
                        className={`flex items-start text-xs transition-opacity duration-300 ${
                          isActive ? 'opacity-100 font-bold' : isCompleted ? 'opacity-50' : 'opacity-25'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="w-4 h-4 mr-2.5 text-cricket-neon shrink-0 mt-0.5" />
                        ) : isActive ? (
                          <Loader2 className="w-4 h-4 mr-2.5 text-cricket-cyan animate-spin shrink-0 mt-0.5" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-white/20 mr-2.5 shrink-0 mt-0.5 flex items-center justify-center text-[9px] font-bold font-mono">
                            {idx + 1}
                          </div>
                        )}
                        <span className={isActive ? 'text-slate-100' : isCompleted ? 'text-slate-300' : 'text-slate-500'}>
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
