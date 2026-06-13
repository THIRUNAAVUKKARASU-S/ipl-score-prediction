import React from 'react';
import { motion } from 'framer-motion';
import { Award, Zap, Shield, Flame } from 'lucide-react';

export default function PredictionResult({ result }) {
  if (!result) return null;

  const { predicted_score, category } = result;

  // Configuration based on prediction category
  let themeClass = '';
  let badgeClass = '';
  let icon = null;
  let description = '';

  if (predicted_score < 140) {
    themeClass = 'from-blue-900/40 to-slate-900/40 border-blue-500/30';
    badgeClass = 'bg-blue-500/10 text-blue-300 border-blue-500/20';
    icon = <Shield className="w-8 h-8 text-blue-400" />;
    description = "Bowlers are dominating the game. The pitch is likely offering assistance, making this a tough chase.";
  } else if (predicted_score <= 180) {
    themeClass = 'from-yellow-900/30 to-orange-950/20 border-yellow-500/30';
    badgeClass = 'bg-yellow-500/10 text-yellow-300 border-yellow-500/20';
    icon = <Zap className="w-8 h-8 text-yellow-400" />;
    description = "A balanced, competitive contest. Both teams have equal opportunities if they execute their strategies.";
  } else {
    themeClass = 'from-orange-900/40 to-red-950/20 border-orange-500/30';
    badgeClass = 'bg-orange-500/10 text-orange-300 border-orange-500/20';
    icon = <Flame className="w-8 h-8 text-orange-400" />;
    description = "Batter-friendly conditions! Expect fireworks and big hitting as the batting team dominates.";
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
      className={`w-full max-w-lg mx-auto bg-gradient-to-br ${themeClass} border rounded-2xl shadow-2xl p-8 glassmorphism text-center relative overflow-hidden`}
    >
      {/* Background flare */}
      <div className="absolute -top-20 -left-20 w-44 h-44 bg-blue-500/10 rounded-full blur-2xl"></div>
      <div className="absolute -bottom-20 -right-20 w-44 h-44 bg-purple-500/10 rounded-full blur-2xl"></div>

      {/* Header Icon */}
      <div className="flex justify-center mb-4">
        <div className="p-3.5 bg-slate-900/70 border border-slate-700 rounded-full shadow-inner">
          {icon}
        </div>
      </div>

      <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">
        Neural Network Score Forecast
      </h3>
      
      {/* Main Score display */}
      <div className="my-4">
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
          className="text-6xl font-extrabold text-white tracking-tight inline-block"
        >
          {predicted_score}
        </motion.span>
        <span className="text-2xl font-bold text-slate-300 ml-2">Runs</span>
      </div>

      {/* Category Badge */}
      <div className="inline-block">
        <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${badgeClass} uppercase tracking-wider`}>
          {category}
        </span>
      </div>

      {/* Commentary */}
      <p className="mt-5 text-sm text-slate-300 font-light leading-relaxed max-w-md mx-auto">
        {description}
      </p>

      {/* Mini Details */}
      <div className="mt-6 pt-5 border-t border-slate-700/50 grid grid-cols-2 gap-4 text-xs text-slate-400">
        <div>
          <span>Confidence Interval</span>
          <span className="block font-semibold text-slate-200 mt-0.5">± 8.06 Runs</span>
        </div>
        <div>
          <span>Model Architecture</span>
          <span className="block font-semibold text-slate-200 mt-0.5">ML Neural Network</span>
        </div>
      </div>
    </motion.div>
  );
}
