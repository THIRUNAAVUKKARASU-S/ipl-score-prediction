import React from 'react';
import { Play, Info, Award, Calendar, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage({ onPredictClick, onLearnMoreClick }) {
  return (
    <div className="relative min-h-[calc(100vh-80px)] flex flex-col justify-center overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-25 animate-pulse delay-700"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column: Hero Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left space-y-6"
          >
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-blue-500/30 px-4 py-1.5 rounded-full text-sm font-medium text-blue-300 backdrop-blur-sm">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              <span>IPL Season 2026 Edition</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none">
              Predict IPL Scores <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-orange-400 text-glow-blue">
                with Machine Learning
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-300 max-w-xl font-light leading-relaxed">
              Get accurate, real-time first innings score predictions using advanced Deep Learning Neural Network models trained on historical IPL match statistics.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <button 
                onClick={onPredictClick}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-blue-500/20 transform hover:-translate-y-0.5 transition-all duration-200 group"
              >
                <span>Predict Score</span>
                <Play className="w-5 h-5 fill-white group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button 
                onClick={onLearnMoreClick}
                className="flex items-center space-x-2 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 text-slate-200 font-semibold px-8 py-4 rounded-xl backdrop-blur-sm transition-all duration-200"
              >
                <span>Learn More</span>
                <Info className="w-5 h-5" />
              </button>
            </div>

            {/* Quick stats indicators */}
            <div className="grid grid-cols-3 gap-6 pt-10 border-t border-slate-800">
              <div>
                <p className="text-3xl font-bold text-white">94.8%</p>
                <p className="text-sm text-slate-400">Prediction Accuracy</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">74k+</p>
                <p className="text-sm text-slate-400">Match States Trained</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">&lt; 10</p>
                <p className="text-sm text-slate-400">Runs Avg. Error (MAE)</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Interactive Area */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col items-center justify-center relative"
          >
            {/* Animated Scoreboard Widget */}
            <div className="w-full max-w-md bg-slate-800/70 border border-slate-700/50 rounded-2xl shadow-2xl p-6 glassmorphism mb-8 relative z-20 overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-28 h-28 bg-orange-500/10 rounded-full blur-xl group-hover:bg-orange-500/20 transition-all duration-300"></div>
              
              <div className="flex justify-between items-center border-b border-slate-700/50 pb-4 mb-4">
                <span className="text-xs font-bold text-orange-400 uppercase tracking-widest">Live Match Predictor</span>
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>
                  <span className="text-xs text-slate-300 font-medium">SIMULATION</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white tracking-wide">RCB</h3>
                  <p className="text-xs text-slate-400">Batting 1st Innings</p>
                </div>
                <div className="text-right">
                  <h3 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">
                    174/4
                  </h3>
                  <p className="text-xs text-slate-300">18.2 Overs</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-slate-900/50 rounded-xl p-4 border border-slate-700/30 text-sm">
                <div>
                  <span className="text-xs text-slate-400 block mb-0.5">Current Striker</span>
                  <span className="font-semibold text-white">Virat Kohli* (82)</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block mb-0.5">Current Bowler</span>
                  <span className="font-semibold text-white">Jasprit Bumrah</span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-700/50 flex justify-between items-center">
                <span className="text-xs text-slate-400">Neural Network Forecast</span>
                <span className="text-base font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                  Projected: 196 Runs
                </span>
              </div>
            </div>

            {/* Stadium Illustration Wrapper */}
            <div className="relative w-full max-w-lg aspect-[4/3] flex items-center justify-center z-10">
              {/* Floating Cricket Ball */}
              <div className="absolute top-10 left-12 w-16 h-16 animate-float z-30 pointer-events-none filter drop-shadow-[0_10px_15px_rgba(249,115,22,0.4)]">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {/* Outer sphere */}
                  <circle cx="50" cy="50" r="45" fill="url(#ballGlow)" />
                  <circle cx="50" cy="50" r="43" fill="#B91C1C" stroke="#7F1D1D" strokeWidth="1.5" />
                  {/* Seams */}
                  <path d="M 50,7 A 43,43 0 0,0 50,93" stroke="white" strokeWidth="3" strokeDasharray="2,3" fill="none" />
                  <path d="M 50,7 A 43,43 0 0,1 50,93" stroke="white" strokeWidth="3" strokeDasharray="2,3" fill="none" />
                  {/* Shading */}
                  <circle cx="40" cy="40" r="35" fill="url(#ballShine)" opacity="0.35" />
                  <defs>
                    <radialGradient id="ballGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="70%" stopColor="#B91C1C" />
                      <stop offset="100%" stopColor="#7F1D1D" />
                    </radialGradient>
                    <radialGradient id="ballShine" cx="35%" cy="35%" r="40%">
                      <stop offset="0%" stopColor="white" />
                      <stop offset="100%" stopColor="transparent" />
                    </radialGradient>
                  </defs>
                </svg>
              </div>

              {/* Premium Vector Stadium SVG */}
              <svg viewBox="0 0 800 600" className="w-full h-full filter drop-shadow-[0_20px_35px_rgba(30,41,59,0.8)]">
                {/* Sky / Deep bg */}
                <rect width="800" height="600" rx="30" fill="url(#stadiumSky)" />
                
                {/* Stadium Lights (L) */}
                <g transform="translate(100, 80)" stroke="none">
                  <line x1="0" y1="120" x2="30" y2="0" stroke="#475569" strokeWidth="8" />
                  <line x1="30" y1="120" x2="30" y2="0" stroke="#64748B" strokeWidth="6" />
                  <polygon points="10,-20 50,-20 60,10 0,10" fill="#334155" />
                  {/* Lights array */}
                  <circle cx="15" cy="-5" r="5" fill="#FFF" className="animate-pulse" />
                  <circle cx="30" cy="-5" r="5" fill="#FFF" className="animate-pulse" />
                  <circle cx="45" cy="-5" r="5" fill="#FFF" className="animate-pulse" />
                  <circle cx="20" cy="5" r="5" fill="#FFF" className="animate-pulse" />
                  <circle cx="35" cy="5" r="5" fill="#FFF" className="animate-pulse" />
                  {/* Beams */}
                  <polygon points="10,10 300,500 200,500" fill="url(#lightBeam)" opacity="0.15" />
                </g>

                {/* Stadium Lights (R) */}
                <g transform="translate(640, 80)" stroke="none">
                  <line x1="60" y1="120" x2="30" y2="0" stroke="#475569" strokeWidth="8" />
                  <line x1="30" y1="120" x2="30" y2="0" stroke="#64748B" strokeWidth="6" />
                  <polygon points="10,-20 50,-20 60,10 0,10" fill="#334155" />
                  {/* Lights array */}
                  <circle cx="15" cy="-5" r="5" fill="#FFF" className="animate-pulse" />
                  <circle cx="30" cy="-5" r="5" fill="#FFF" className="animate-pulse" />
                  <circle cx="45" cy="-5" r="5" fill="#FFF" className="animate-pulse" />
                  <circle cx="20" cy="5" r="5" fill="#FFF" className="animate-pulse" />
                  <circle cx="35" cy="5" r="5" fill="#FFF" className="animate-pulse" />
                  {/* Beams */}
                  <polygon points="50,10 260,500 160,500" fill="url(#lightBeam)" opacity="0.15" />
                </g>

                {/* Stands (Tiers) */}
                <ellipse cx="400" cy="450" rx="360" ry="140" fill="#1E293B" stroke="#475569" strokeWidth="3" />
                <ellipse cx="400" cy="455" rx="330" ry="120" fill="#0F172A" />
                <ellipse cx="400" cy="460" rx="300" ry="100" fill="#1E3A8A" opacity="0.8" />

                {/* Grass Pitch Outfield */}
                <ellipse cx="400" cy="465" rx="270" ry="80" fill="url(#pitchGrass)" stroke="#10B981" strokeWidth="2" />
                
                {/* Outfield details (stripes) */}
                <ellipse cx="400" cy="465" rx="230" ry="68" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
                <ellipse cx="400" cy="465" rx="180" ry="53" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
                <ellipse cx="400" cy="465" rx="130" ry="38" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />

                {/* Pitch (Infield Clay Wicket) */}
                <polygon points="380,455 420,455 410,480 390,480" fill="#F59E0B" opacity="0.9" stroke="#D97706" strokeWidth="1" />
                <line x1="390" y1="455" x2="390" y2="480" stroke="white" strokeWidth="1" opacity="0.6" />
                <line x1="410" y1="455" x2="410" y2="480" stroke="white" strokeWidth="1" opacity="0.6" />
                
                {/* Wickets (Stumps) */}
                {/* Batsman side */}
                <g transform="translate(398, 452)">
                  <line x1="-3" y1="0" x2="-3" y2="7" stroke="white" strokeWidth="1.2" />
                  <line x1="0" y1="0" x2="0" y2="7" stroke="white" strokeWidth="1.2" />
                  <line x1="3" y1="0" x2="3" y2="7" stroke="white" strokeWidth="1.2" />
                  <line x1="-4" y1="0" x2="4" y2="0" stroke="white" strokeWidth="1" />
                </g>
                {/* Bowler side */}
                <g transform="translate(398, 477)">
                  <line x1="-2" y1="0" x2="-2" y2="5" stroke="white" strokeWidth="1.0" />
                  <line x1="0" y1="0" x2="0" y2="5" stroke="white" strokeWidth="1.0" />
                  <line x1="2" y1="0" x2="2" y2="5" stroke="white" strokeWidth="1.0" />
                  <line x1="-3" y1="0" x2="3" y2="0" stroke="white" strokeWidth="0.8" />
                </g>

                {/* Stadium Crowd / Glow */}
                <ellipse cx="400" cy="445" rx="350" ry="125" fill="none" stroke="url(#crowdGlow)" strokeWidth="10" opacity="0.4" />

                {/* Gradients */}
                <defs>
                  <linearGradient id="stadiumSky" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#0B132B" />
                    <stop offset="60%" stopColor="#1C2541" />
                    <stop offset="100%" stopColor="#3A506B" />
                  </linearGradient>
                  <linearGradient id="lightBeam" x1="0%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="pitchGrass" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#059669" />
                    <stop offset="100%" stopColor="#10B981" />
                  </linearGradient>
                  <radialGradient id="crowdGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="80%" stopColor="#3B82F6" stopOpacity="0" />
                    <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.7" />
                  </radialGradient>
                </defs>
              </svg>
            </div>
          </motion.div>
          
        </div>
      </div>
    </div>
  );
}
