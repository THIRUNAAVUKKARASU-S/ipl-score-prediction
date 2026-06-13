import React from 'react';

export default function SkeletonLoader() {
  return (
    <div className="w-full max-w-lg mx-auto bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 glassmorphism animate-pulse space-y-6">
      <div className="h-4 bg-slate-700/80 rounded w-1/4"></div>
      
      <div className="space-y-4 py-4">
        <div className="h-12 bg-slate-700/60 rounded-xl w-full"></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-10 bg-slate-700/60 rounded-lg"></div>
          <div className="h-10 bg-slate-700/60 rounded-lg"></div>
        </div>
      </div>
      
      <div className="border-t border-slate-700/50 pt-4 flex justify-between items-center">
        <div className="h-4 bg-slate-700/80 rounded w-1/3"></div>
        <div className="h-8 bg-slate-700/80 rounded-full w-24"></div>
      </div>
    </div>
  );
}
