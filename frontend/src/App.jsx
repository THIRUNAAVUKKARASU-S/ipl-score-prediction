import React, { useState, useEffect } from 'react';
import { Sun, Moon, Database, Award, Info, Phone, Play, Calendar, User } from 'lucide-react';
import LandingPage from './components/LandingPage';
import PredictionForm from './components/PredictionForm';
import PredictionResult from './components/PredictionResult';
import StatsDashboard from './components/StatsDashboard';
import AboutProject from './components/AboutProject';
import Contact from './components/Contact';
import Toast from './components/Toast';
import SkeletonLoader from './components/SkeletonLoader';
import { AnimatePresence } from 'framer-motion';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [metadata, setMetadata] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
  const [predictionLoading, setPredictionLoading] = useState(false);
  const [predictionError, setPredictionError] = useState(null);
  
  // Toast notifications state
  const [toast, setToast] = useState(null);

  // Fetch metadata from backend on mount
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/metadata');
        if (!response.ok) throw new Error('Could not connect to ML backend.');
        const data = await response.json();
        setMetadata(data);
      } catch (err) {
        showToast("Error connecting to prediction server. Ensure backend is running.", "error");
        console.error(err);
      }
    };
    fetchMetadata();
  }, []);

  // Sync dark mode class with body element
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.remove('light');
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
  }, [isDarkMode]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handlePredictionResult = (result) => {
    setPredictionResult(result);
    showToast("Prediction generated successfully!", "success");
    // Scroll down to result
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    }, 100);
  };

  const handlePredictionError = (errorMsg) => {
    setPredictionError(errorMsg);
    showToast(errorMsg || "Prediction failed.", "error");
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-slate-100' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 text-slate-800'}`}>
      
      {/* Header / Navbar */}
      <header className="border-b border-slate-800/20 backdrop-blur-md sticky top-0 z-40 bg-slate-900/40 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="p-2.5 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg shadow-blue-500/20">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-orange-400">
                IPL Score Predictor
              </span>
              <span className="block text-[10px] text-slate-400 font-semibold uppercase tracking-widest leading-none mt-0.5">Machine Learning</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${activeTab === 'home' ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveTab('prediction')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${activeTab === 'prediction' ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Prediction
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${activeTab === 'stats' ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Stats Dashboard
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${activeTab === 'about' ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 'text-slate-400 hover:text-slate-200'}`}
            >
              About Project
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${activeTab === 'contact' ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Contact
            </button>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2.5 bg-slate-800/60 border border-slate-700/50 rounded-xl hover:bg-slate-700 transition cursor-pointer text-slate-300"
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Quick Action */}
            <button
              onClick={() => setActiveTab('prediction')}
              className="hidden sm:flex items-center space-x-1.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-95 text-white font-semibold text-sm px-4.5 py-2.5 rounded-xl shadow-lg transition"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Predict Live</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main View Area */}
      <main className="flex-1 flex flex-col justify-start pb-20">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <LandingPage
              onPredictClick={() => setActiveTab('prediction')}
              onLearnMoreClick={() => setActiveTab('about')}
            />
          )}

          {activeTab === 'prediction' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 w-full z-10">
              <div className="text-center space-y-2 mb-4">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white">IPL Score Prediction</h1>
                <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto font-light">
                  Predict innings scores dynamically using our pre-trained Deep Learning model.
                </p>
              </div>

              <PredictionForm
                metadata={metadata}
                onPredictionResult={handlePredictionResult}
                onLoadingChange={setPredictionLoading}
                onError={handlePredictionError}
              />

              {predictionLoading && <SkeletonLoader />}

              {!predictionLoading && predictionResult && (
                <PredictionResult result={predictionResult} />
              )}
            </div>
          )}

          {activeTab === 'stats' && <StatsDashboard />}

          {activeTab === 'about' && <AboutProject />}

          {activeTab === 'contact' && (
            <Contact onShowToast={(msg, type) => showToast(msg, type)} />
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/30 bg-slate-950/75 py-8 text-center text-xs text-slate-400 z-10 relative">
        <div className="max-w-7xl mx-auto px-4 space-y-3">
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-slate-300 font-medium text-sm">
            <span>Developer: Thirunaavukkarasu S</span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span>Project: IPL Score Prediction Using Machine Learning</span>
          </div>
          <p className="font-light">
            Designed and built as a premium cricket analytics portal using TensorFlow/Keras Neural Networks, Flask, React, and Tailwind CSS.
          </p>
          <p className="text-slate-500 mt-2">
            Copyright © 2026 • All Rights Reserved.
          </p>
        </div>
      </footer>

      {/* Toast notifications */}
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
