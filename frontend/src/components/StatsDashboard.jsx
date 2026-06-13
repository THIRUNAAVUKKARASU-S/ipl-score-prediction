import React, { useState, useEffect } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Award, Target, MapPin, BarChart2, PieChart } from 'lucide-react';
import { motion } from 'framer-motion';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function StatsDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('http://127.0.0.1:5000/stats');
        if (!res.ok) throw new Error('Failed to fetch statistics');
        const data = await res.json();
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mr-3"></div>
        <span>Loading Statistics...</span>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="max-w-md mx-auto text-center py-12 bg-red-950/20 border border-red-500/30 rounded-2xl p-6 glassmorphism">
        <p className="text-red-400 font-semibold mb-2">Error Loading Statistics</p>
        <p className="text-sm text-slate-300">{error || 'No stats data available. Check if backend is running.'}</p>
      </div>
    );
  }

  // Chart 1: Top Batsmen (Bar Chart)
  const batsmenData = {
    labels: stats.top_batsmen.map(b => b.name),
    datasets: [
      {
        label: 'Highest Individual Innings Runs',
        data: stats.top_batsmen.map(b => b.runs),
        backgroundColor: 'rgba(37, 99, 235, 0.7)', // Blue
        borderColor: 'rgba(37, 99, 235, 1)',
        borderWidth: 1.5,
        borderRadius: 6,
        hoverBackgroundColor: 'rgba(59, 130, 246, 0.85)',
      }
    ]
  };

  // Chart 2: Top Bowlers (Bar Chart)
  const bowlersData = {
    labels: stats.top_bowlers.map(b => b.name),
    datasets: [
      {
        label: 'Total Wickets Taken (Simulated Career)',
        data: stats.top_bowlers.map(b => b.wickets),
        backgroundColor: 'rgba(249, 115, 22, 0.7)', // Orange
        borderColor: 'rgba(249, 115, 22, 1)',
        borderWidth: 1.5,
        borderRadius: 6,
        hoverBackgroundColor: 'rgba(251, 146, 60, 0.85)',
      }
    ]
  };

  // Chart 3: Matches per Venue (Doughnut Chart)
  const venueData = {
    labels: stats.venue_stats.map(v => v.venue.replace(" Stadium", "")),
    datasets: [
      {
        label: 'Matches Simulated',
        data: stats.venue_stats.map(v => v.matches),
        backgroundColor: [
          'rgba(37, 99, 235, 0.65)',
          'rgba(249, 115, 22, 0.65)',
          'rgba(168, 85, 247, 0.65)',
          'rgba(16, 185, 129, 0.65)',
          'rgba(236, 72, 153, 0.65)',
          'rgba(250, 204, 21, 0.65)',
          'rgba(239, 68, 68, 0.65)',
          'rgba(14, 165, 233, 0.65)'
        ].slice(0, stats.venue_stats.length),
        borderColor: 'rgba(15, 23, 42, 0.5)',
        borderWidth: 2,
      }
    ]
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#fff',
        bodyColor: '#cbd5e1',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: '#94a3b8',
          font: { size: 10, family: 'Outfit' }
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: '#94a3b8',
          font: { size: 10, family: 'Outfit' }
        }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#cbd5e1',
          font: { size: 11, family: 'Outfit' },
          boxWidth: 12,
          padding: 15
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#fff',
        bodyColor: '#cbd5e1',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 z-10 w-full">
      {/* Header */}
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">IPL Dataset Insights & Analytics</h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto font-light">
          Deep-dive analysis of players and venue statistics from the simulated historical IPL match dataset.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top 10 Batsmen Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 glassmorphism flex flex-col"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-blue-600/20 rounded-lg">
              <Award className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Top 10 Batsmen</h2>
              <p className="text-xs text-slate-400">Highest individual runs scored in an innings</p>
            </div>
          </div>
          <div className="h-72 w-full relative">
            <Bar data={batsmenData} options={commonOptions} />
          </div>
        </motion.div>

        {/* Top 10 Bowlers Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 glassmorphism flex flex-col"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-orange-600/20 rounded-lg">
              <Target className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Top 10 Bowlers</h2>
              <p className="text-xs text-slate-400">Total career wickets in simulated matches</p>
            </div>
          </div>
          <div className="h-72 w-full relative">
            <Bar data={bowlersData} options={commonOptions} />
          </div>
        </motion.div>
      </div>

      {/* Venues Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Matches Per Venue Doughnut */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2 bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 glassmorphism flex flex-col"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-purple-600/20 rounded-lg">
              <MapPin className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Venue Popularity</h2>
              <p className="text-xs text-slate-400">Total matches simulated per stadium</p>
            </div>
          </div>
          <div className="h-72 w-full relative">
            <Doughnut data={venueData} options={doughnutOptions} />
          </div>
        </motion.div>

        {/* Venue Stats Details List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 glassmorphism flex flex-col h-full overflow-hidden"
        >
          <h2 className="text-lg font-bold text-white mb-1.5">Average Venue Scores</h2>
          <p className="text-xs text-slate-400 mb-4">Historical scoring averages per venue</p>
          
          <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
            {stats.venue_stats.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center bg-slate-900/40 border border-slate-800 p-3 rounded-xl hover:border-slate-700/50 transition-all duration-200">
                <div className="flex items-center space-x-2.5">
                  <span className="text-xs font-bold bg-slate-800 text-slate-300 w-5 h-5 flex items-center justify-center rounded-full">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="text-sm font-semibold text-white block leading-snug">
                      {item.venue.replace(" Stadium", "")}
                    </span>
                    <span className="text-[10px] text-slate-400 font-light">
                      {item.matches} Matches played
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                    {item.avg_score} Runs
                  </span>
                  <span className="text-[10px] text-slate-400 block font-light">Avg. Innings</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
