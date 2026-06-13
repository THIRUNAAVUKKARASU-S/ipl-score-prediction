import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, CheckCircle, AlertTriangle } from 'lucide-react';

export default function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className={`fixed bottom-5 right-5 z-50 flex items-center space-x-3 px-4 py-3.5 rounded-xl border shadow-xl backdrop-blur-md ${
        type === 'error'
          ? 'bg-red-950/80 border-red-500/30 text-red-200'
          : 'bg-green-950/80 border-green-500/30 text-green-200'
      }`}
    >
      {type === 'error' ? (
        <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
      ) : (
        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
      )}
      <span className="text-sm font-medium pr-2">{message}</span>
      <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition">
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
