import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Cpu, Award, Code, Globe, User, BookOpen, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

// Register ChartJS modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function AboutProject() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const res = await fetch('http://127.0.0.1:5000/performance');
        if (!res.ok) throw new Error('Failed to fetch model metrics');
        const data = await res.json();
        setMetrics(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPerformance();
  }, []);

  // Prepare chart data if metrics are available
  let lossChartData = null;
  let maeChartData = null;

  if (metrics) {
    const epochs = Array.from({ length: metrics.loss.length }, (_, i) => `Epoch ${i + 1}`);
    lossChartData = {
      labels: epochs,
      datasets: [
        {
          label: 'Training Loss',
          data: metrics.loss,
          borderColor: 'rgba(59, 130, 246, 1)', // Blue
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.2,
          pointRadius: 3,
        },
        {
          label: 'Validation Loss',
          data: metrics.val_loss,
          borderColor: 'rgba(236, 72, 153, 1)', // Pink
          backgroundColor: 'rgba(236, 72, 153, 0.05)',
          borderWidth: 2,
          fill: true,
          tension: 0.2,
          pointRadius: 3,
        }
      ]
    };

    maeChartData = {
      labels: epochs,
      datasets: [
        {
          label: 'Training MAE',
          data: metrics.mae,
          borderColor: 'rgba(249, 115, 22, 1)', // Orange
          backgroundColor: 'rgba(249, 115, 22, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.2,
          pointRadius: 3,
        },
        {
          label: 'Validation MAE',
          data: metrics.val_mae,
          borderColor: 'rgba(16, 185, 129, 1)', // Green
          backgroundColor: 'rgba(16, 185, 129, 0.05)',
          borderWidth: 2,
          fill: true,
          tension: 0.2,
          pointRadius: 3,
        }
      ]
    };
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#cbd5e1',
          font: { size: 11, family: 'Outfit' },
          boxWidth: 10
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#fff',
        bodyColor: '#cbd5e1',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8', font: { size: 10 } }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8', font: { size: 10 } }
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 z-10 w-full">
      {/* Title */}
      <div className="text-center space-y-2 mb-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">About the Project</h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto font-light">
          Deep learning models leveraging advanced Neural Networks to forecast first innings scores in the Indian Premier League.
        </p>
      </div>

      {/* Intro & Architecture Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* Description card */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 sm:p-8 glassmorphism flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-blue-400">
              <BookOpen className="w-6 h-6" />
              <h2 className="text-xl font-bold text-white">Project Overview</h2>
            </div>
            <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
              Predicting the score of a live cricket match is a complex task influenced by multiple dynamic factors. Traditional algorithms fail to capture the highly non-linear nature of run-scoring rates, bowler economy transitions, and player/venue specific momentum.
            </p>
            <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
              This application utilizes a custom-built <strong>Deep Learning Feedforward Neural Network</strong> built on <strong>TensorFlow and Keras</strong>. The model is trained on a simulated dataset of over 74,000 match snapshots. Categorical features like Batting Team, Bowling Team, Batsman (Striker), Bowler, and Venue are label encoded and combined with live match variables (Runs, Wickets, Overs, Striker Runs) to provide real-time, robust projections.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-700/50 grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <Cpu className="w-5 h-5 text-purple-400" />
              <div>
                <span className="text-xs text-slate-400 block">Framework</span>
                <span className="text-sm font-semibold text-white">Keras / TensorFlow 2</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Layers className="w-5 h-5 text-orange-400" />
              <div>
                <span className="text-xs text-slate-400 block">Features scaled</span>
                <span className="text-sm font-semibold text-white">MinMaxScaler</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Model Architecture layout */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 sm:p-8 glassmorphism flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-orange-400">
              <Layers className="w-6 h-6" />
              <h2 className="text-xl font-bold text-white">Model Architecture</h2>
            </div>
            
            {/* Architectural Nodes Visual representation */}
            <div className="space-y-3 pt-4">
              {/* Input Layer */}
              <div className="flex items-center justify-between bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl">
                <span className="text-sm font-bold text-slate-300">Input Layer</span>
                <span className="text-xs font-semibold bg-slate-800 text-blue-400 px-3 py-1 rounded-full border border-blue-500/20">
                  9 Features (Encoded & Scaled)
                </span>
              </div>

              {/* Dense 1 */}
              <div className="flex items-center justify-between bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl relative">
                <div className="absolute left-1/2 -top-3 w-0.5 h-3 bg-blue-500/30 transform -translate-x-1/2"></div>
                <span className="text-sm font-bold text-slate-300">Hidden Layer 1 (Dense)</span>
                <span className="text-xs font-semibold bg-slate-800 text-purple-400 px-3 py-1 rounded-full border border-purple-500/20">
                  512 Neurons | ReLU | Dropout(0.15)
                </span>
              </div>

              {/* Dense 2 */}
              <div className="flex items-center justify-between bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl relative">
                <div className="absolute left-1/2 -top-3 w-0.5 h-3 bg-purple-500/30 transform -translate-x-1/2"></div>
                <span className="text-sm font-bold text-slate-300">Hidden Layer 2 (Dense)</span>
                <span className="text-xs font-semibold bg-slate-800 text-purple-400 px-3 py-1 rounded-full border border-purple-500/20">
                  216 Neurons | ReLU | Dropout(0.15)
                </span>
              </div>

              {/* Output Layer */}
              <div className="flex items-center justify-between bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl relative">
                <div className="absolute left-1/2 -top-3 w-0.5 h-3 bg-purple-500/30 transform -translate-x-1/2"></div>
                <span className="text-sm font-bold text-slate-300">Output Layer (Dense)</span>
                <span className="text-xs font-semibold bg-slate-800 text-orange-400 px-3 py-1 rounded-full border border-orange-500/20">
                  1 Neuron (Final Score) | ReLU
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-700/50 flex justify-between items-center text-xs text-slate-400">
            <div>
              <span>Loss Function</span>
              <span className="block font-semibold text-slate-200 mt-0.5">Huber Loss</span>
            </div>
            <div className="text-right">
              <span>Optimizer</span>
              <span className="block font-semibold text-slate-200 mt-0.5">Adam (lr=0.001)</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Model Performance Section */}
      <div className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white">Model Training Analytics</h2>
        
        {loading ? (
          <div className="flex justify-center items-center py-10 text-slate-400">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mr-2"></div>
            <span>Loading performance metrics...</span>
          </div>
        ) : error || !metrics ? (
          <div className="bg-red-950/20 border border-red-500/20 rounded-xl p-4 text-center text-red-400 text-sm">
            Failed to load training analytics. Please ensure the model is trained.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Loss curve */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2 bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 glassmorphism flex flex-col"
            >
              <h3 className="text-base font-bold text-white mb-4">Training vs Validation Loss</h3>
              <div className="h-60 w-full relative">
                <Line data={lossChartData} options={chartOptions} />
              </div>
            </motion.div>

            {/* Metrics cards */}
            <div className="space-y-6 flex flex-col justify-between">
              {/* MAE card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-gradient-to-br from-blue-900/40 to-slate-900/40 border border-blue-500/30 rounded-2xl p-6 glassmorphism flex flex-col justify-center text-center relative overflow-hidden flex-1"
              >
                <div className="absolute -top-10 -left-10 w-24 h-24 bg-blue-500/5 rounded-full blur-xl"></div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Validation MAE</h4>
                <div className="text-5xl font-extrabold text-white tracking-tight">
                  {metrics.final_mae.toFixed(3)}
                </div>
                <p className="text-xs text-slate-300 mt-2 font-light">
                  Average prediction error of around 8 runs per innings.
                </p>
              </motion.div>

              {/* Epoch stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 glassmorphism flex flex-col justify-center flex-1"
              >
                <div className="flex justify-between items-center border-b border-slate-700/40 pb-2 mb-2 text-sm">
                  <span className="text-slate-400 font-light">Total Epochs</span>
                  <span className="font-semibold text-white">15</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-700/40 pb-2 mb-2 text-sm">
                  <span className="text-slate-400 font-light">Dataset Train/Val Split</span>
                  <span className="font-semibold text-white">80% / 20%</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 font-light">Final Training Loss</span>
                  <span className="font-semibold text-white">{metrics.loss[metrics.loss.length - 1].toFixed(4)}</span>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>

      {/* Developer Bio Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-gradient-to-r from-blue-950/40 via-slate-800/50 to-purple-950/40 border border-slate-700/50 rounded-2xl p-6 sm:p-8 glassmorphism flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 relative overflow-hidden"
      >
        <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-orange-500/5 rounded-full blur-xl"></div>
        <div className="p-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-xl">
          <User className="w-12 h-12 text-white" />
        </div>
        
        <div className="flex-1 text-center sm:text-left space-y-2">
          <span className="text-xs font-bold text-orange-400 uppercase tracking-widest block">Project Developer</span>
          <h3 className="text-2xl font-extrabold text-white">Thirunaavukkarasu S</h3>
          <p className="text-sm text-slate-300 font-light max-w-2xl leading-relaxed">
            Machine Learning Engineer and Full-stack Developer passionate about building high-performance AI applications, predictive systems, and interactive data visualization platforms.
          </p>
          <div className="flex flex-wrap justify-center sm:justify-start gap-4 pt-2">
            <span className="inline-flex items-center space-x-1.5 text-xs text-slate-400 bg-slate-900/40 px-3 py-1 rounded-full border border-slate-800">
              <Code className="w-3.5 h-3.5 text-blue-400" />
              <span>Full-Stack Development</span>
            </span>
            <span className="inline-flex items-center space-x-1.5 text-xs text-slate-400 bg-slate-900/40 px-3 py-1 rounded-full border border-slate-800">
              <Cpu className="w-3.5 h-3.5 text-purple-400" />
              <span>Deep Learning & TensorFlow</span>
            </span>
            <span className="inline-flex items-center space-x-1.5 text-xs text-slate-400 bg-slate-900/40 px-3 py-1 rounded-full border border-slate-800">
              <Globe className="w-3.5 h-3.5 text-orange-400" />
              <span>React & Flask Architectures</span>
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
