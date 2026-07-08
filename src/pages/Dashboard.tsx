import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Activity, 
  Award, 
  Clock, 
  ChevronRight, 
  ArrowUpRight,
  Brain,
  CheckCircle2,
  Video
} from 'lucide-react';
import { Session } from '../api/coachingApi';

interface DashboardProps {
  sessions: Session[];
}

export default function Dashboard({ sessions }: DashboardProps) {
  const navigate = useNavigate();

  // Computations
  const totalSessions = sessions.length;
  
  const avgScore = totalSessions > 0 
    ? Math.round(sessions.reduce((acc, s) => acc + s.overallScore, 0) / totalSessions) 
    : 0;

  // Breakdown averages
  const avgSetup = totalSessions > 0 
    ? Math.round(sessions.reduce((acc, s) => acc + s.metrics.setup, 0) / totalSessions) 
    : 0;
  const avgBackswing = totalSessions > 0 
    ? Math.round(sessions.reduce((acc, s) => acc + s.metrics.backswing, 0) / totalSessions) 
    : 0;
  const avgContact = totalSessions > 0 
    ? Math.round(sessions.reduce((acc, s) => acc + s.metrics.contact, 0) / totalSessions) 
    : 0;
  const avgFollowThrough = totalSessions > 0 
    ? Math.round(sessions.reduce((acc, s) => acc + s.metrics.followThrough, 0) / totalSessions) 
    : 0;

  // Recent 3 sessions
  const recentSessions = [...sessions].slice(0, 3);

  // SVG Line Chart coordinates calculations based on sessions
  // Map sessions chronologically (oldest to newest)
  const chronologicalSessions = [...sessions].reverse();
  const chartWidth = 500;
  const chartHeight = 150;
  const padding = 20;

  let pointsPath = '';
  if (chronologicalSessions.length > 1) {
    const stepX = (chartWidth - padding * 2) / (chronologicalSessions.length - 1);
    const scoreRange = 40; // 60 to 100
    pointsPath = chronologicalSessions.map((s, idx) => {
      const x = padding + idx * stepX;
      // Map score 60-100 to y chartHeight-padding down to padding
      const scoreNormalized = (s.overallScore - 60) / scoreRange; // 0 to 1
      const y = chartHeight - padding - scoreNormalized * (chartHeight - padding * 2);
      return `${x},${y}`;
    }).join(' ');
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="space-y-8"
    >
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Athlete Cockpit
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track biomechanics, review skeletal joint feedback, and accelerate your development.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/sessions')}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-cricket-neon text-darkbg-900 hover:bg-cricket-neon/90 shadow-lg shadow-cricket-neon/15 transition-all duration-200"
          >
            <Video className="w-4 h-4" />
            <span>New Video Analysis</span>
          </button>
        </div>
      </div>

      {/* Grid of Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Metric 1 */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-darkbg-700 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500">Technique Index</span>
            <span className="p-2 rounded-xl bg-cricket-neon/10 text-cricket-neon"><Award className="w-4 h-4" /></span>
          </div>
          <div className="mt-4 flex items-baseline space-x-2">
            <span className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">{avgScore}</span>
            <span className="text-xs text-cricket-neon font-bold flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +2.4%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2">Biomechanical posture matching index</p>
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cricket-neon to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-darkbg-700 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500">Sessions Audited</span>
            <span className="p-2 rounded-xl bg-cricket-cyan/10 text-cricket-cyan"><Activity className="w-4 h-4" /></span>
          </div>
          <div className="mt-4 flex items-baseline space-x-2">
            <span className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">{totalSessions}</span>
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2">Batting & bowling video uploads</p>
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cricket-cyan to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
      </div>

      {/* Main Charts & Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Progress Chart & Skill Breakdown (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Technique Progress Chart */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-darkbg-700 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Technique Progress Trend</h3>
                <p className="text-xs text-slate-400 dark:text-slate-500">Weekly overall scoring metrics</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/[0.04] text-slate-600 dark:text-slate-300">
                Last 30 Days
              </span>
            </div>

            {/* Render line graph using SVG */}
            <div className="w-full overflow-hidden">
              {chronologicalSessions.length > 1 ? (
                <div className="relative">
                  <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-40 overflow-visible">
                    {/* Grid Lines */}
                    <line x1={padding} y1={padding} x2={chartWidth - padding} y2={padding} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                    <line x1={padding} y1={chartHeight / 2} x2={chartWidth - padding} y2={chartHeight / 2} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                    <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />

                    {/* Gradient under curve */}
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#a3e635" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#a3e635" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Gradient Fill Path */}
                    <path
                      d={`M ${padding},${chartHeight - padding} L ${pointsPath} L ${chartWidth - padding},${chartHeight - padding} Z`}
                      fill="url(#chartGradient)"
                    />

                    {/* Stroke line */}
                    <polyline
                      fill="none"
                      stroke="#a3e635"
                      strokeWidth="2.5"
                      points={pointsPath}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Interactive dots */}
                    {chronologicalSessions.map((s, idx) => {
                      const stepX = (chartWidth - padding * 2) / (chronologicalSessions.length - 1);
                      const x = padding + idx * stepX;
                      const scoreNormalized = (s.overallScore - 60) / 40;
                      const y = chartHeight - padding - scoreNormalized * (chartHeight - padding * 2);
                      return (
                        <g key={s.id} className="group/dot cursor-pointer">
                          <circle
                            cx={x}
                            cy={y}
                            r="4"
                            className="fill-darkbg-900 stroke-cricket-neon stroke-2 group-hover/dot:r-6 transition-all"
                          />
                          <circle
                            cx={x}
                            cy={y}
                            r="8"
                            className="fill-cricket-neon/30 opacity-0 group-hover/dot:opacity-100 transition-opacity"
                          />
                        </g>
                      );
                    })}
                  </svg>
                  {/* Labels */}
                  <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 px-4 mt-2 font-mono">
                    {chronologicalSessions.map((s) => (
                      <span key={s.id}>{s.date.split(',')[0]}</span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-40 flex items-center justify-center border border-dashed border-slate-200 dark:border-white/5 rounded-xl">
                  <span className="text-xs text-slate-400">Perform more uploads to plot metrics.</span>
                </div>
              )}
            </div>
          </div>

          {/* Skill Breakdown Radar-equivalent */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-darkbg-700 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Biomechanical Skill Matrix</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Skill 1 */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-600 dark:text-slate-300">Stance / Setup Posture</span>
                  <span className="text-cricket-neon font-bold">{avgSetup}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-white/[0.04] overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${avgSetup}%` }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="h-full bg-cricket-neon rounded-full"
                  />
                </div>
              </div>

              {/* Skill 2 */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-600 dark:text-slate-300">Backlift & Downswing Path</span>
                  <span className="text-cricket-cyan font-bold">{avgBackswing}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-white/[0.04] overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${avgBackswing}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="h-full bg-cricket-cyan rounded-full"
                  />
                </div>
              </div>

              {/* Skill 3 */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-600 dark:text-slate-300">Timing & Elbow Extension</span>
                  <span className="text-cricket-orange font-bold">{avgContact}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-white/[0.04] overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${avgContact}%` }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="h-full bg-cricket-orange rounded-full"
                  />
                </div>
              </div>

              {/* Skill 4 */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-600 dark:text-slate-300">Hips & Follow-Through Balance</span>
                  <span className="text-purple-400 font-bold">{avgFollowThrough}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-white/[0.04] overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${avgFollowThrough}%` }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="h-full bg-purple-400 rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: AI Insights & Quick Action Checks (1/3 width) */}
        <div className="space-y-6">
          
          {/* AI Advisor Panel */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/5 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-darkbg-700 dark:to-darkbg-800 shadow-sm relative overflow-hidden">
            <div className="flex items-center space-x-2 text-cricket-neon mb-4">
              <Brain className="w-5 h-5 text-neon-green" />
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">CricVerse AI Insights</h3>
            </div>
            
            <div className="space-y-4">
              {totalSessions > 0 ? (
                <>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Based on your last cover drive analysis, your lowest metric is <strong className="text-cricket-orange">Contact Execution (76%)</strong>. 
                  </p>
                  
                  <div className="border-t border-slate-200 dark:border-white/5 pt-4 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Critical Adjustments</h4>
                    <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                      <li className="flex items-start">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-2 text-cricket-neon shrink-0 mt-0.5" />
                        <span>Lead elbow bend needs to expand from 84° to 105° to prevent early closing.</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-2 text-cricket-neon shrink-0 mt-0.5" />
                        <span>Brace your front leg knee (restrict flexion to &lt;10°) to keep stance level.</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={() => navigate('/sessions')}
                    className="w-full mt-4 flex items-center justify-center space-x-2 py-2 px-4 rounded-xl text-xs font-semibold bg-slate-900 text-white dark:bg-white/10 dark:text-white hover:bg-slate-800 dark:hover:bg-white/15 transition-all duration-200"
                  >
                    <span>Review Sessions Vault</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </>
              ) : (
                <p className="text-xs text-slate-400 leading-relaxed">
                  No video sessions processed yet. Upload your first clip to receive biomechanical AI insights.
                </p>
              )}
            </div>
          </div>

          {/* Action List (Notion / Linear Checklist style) */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-darkbg-700 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Coaching Milestones</h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-white/[0.02] border border-slate-200/50 dark:border-white/5">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded border-slate-300 text-cricket-neon focus:ring-cricket-neon dark:bg-darkbg-800 dark:border-white/10" />
                  <span className="text-slate-500 dark:text-slate-400 line-through">Upload Cover Drive Video</span>
                </div>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-200 text-slate-600 dark:bg-white/5 dark:text-slate-400">Done</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-white/[0.02] border border-slate-200/50 dark:border-white/5">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded border-slate-300 text-cricket-neon focus:ring-cricket-neon dark:bg-darkbg-800 dark:border-white/10" />
                  <span className="text-slate-500 dark:text-slate-400 line-through">Review Biomechanical Skeleton</span>
                </div>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-200 text-slate-600 dark:bg-white/5 dark:text-slate-400">Done</span>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Recent Sessions list */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-darkbg-700 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Posture Audits</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Review frame-by-frame joint movements</p>
          </div>
          <button 
            onClick={() => navigate('/sessions')}
            className="flex items-center space-x-1 text-xs text-cricket-neon font-bold hover:underline"
          >
            <span>All Sessions</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentSessions.map((session) => (
            <div 
              key={session.id} 
              onClick={() => navigate(`/analyzer/${session.id}`)}
              className="group border border-slate-200 dark:border-white/5 hover:border-cricket-neon/20 bg-slate-50/50 dark:bg-white/[0.01] hover:bg-slate-100/50 dark:hover:bg-white/[0.03] rounded-xl overflow-hidden cursor-pointer transition-all duration-300"
            >
              {/* Thumbnail */}
              <div className="aspect-video w-full overflow-hidden relative bg-slate-900">
                <img 
                  src={session.thumbnail} 
                  alt={session.title} 
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide bg-slate-900/80 dark:bg-darkbg-900/80 text-white border border-white/10">
                  {session.type}
                </div>
                
                {/* Score badge overlay */}
                <div className="absolute bottom-3 left-3 flex items-center space-x-1.5 bg-darkbg-900/90 border border-cricket-neon/20 px-2 py-1 rounded-lg">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Score</span>
                  <span className="text-xs text-cricket-neon font-black">{session.overallScore}</span>
                </div>
              </div>
              
              {/* Info content */}
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-semibold">{session.date}</span>
                  <span className="text-[10px] font-bold text-cricket-neon flex items-center group-hover:translate-x-1 transition-transform">
                    <span>Audit Frame</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                  </span>
                </div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-cricket-neon transition-colors truncate">
                  {session.title}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>

    </motion.div>
  );
}
