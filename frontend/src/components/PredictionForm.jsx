import React, { useState, useEffect } from 'react';
import { HelpCircle, AlertTriangle, Play, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PredictionForm({ metadata, onPredictionResult, onLoadingChange, onError }) {
  const [form, setForm] = useState({
    venue: '',
    bat_team: '',
    bowl_team: '',
    runs: '',
    wickets: '',
    overs: '',
    striker: '',
    batsman: '',
    bowler: ''
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [batsmenOptions, setBatsmenOptions] = useState([]);
  const [bowlerOptions, setBowlerOptions] = useState([]);

  // Set default selections once metadata loads
  useEffect(() => {
    if (metadata && metadata.venues && metadata.teams) {
      setForm(prev => ({
        ...prev,
        venue: metadata.venues[0] || '',
        bat_team: metadata.teams[0] || '',
        bowl_team: metadata.teams[1] || ''
      }));
    }
  }, [metadata]);

  // Update striker list when batting team changes
  useEffect(() => {
    if (metadata && metadata.batsmen_by_team && form.bat_team) {
      const players = metadata.batsmen_by_team[form.bat_team] || [];
      setBatsmenOptions(players);
      setForm(prev => ({ ...prev, batsman: players[0] || '' }));
    }
  }, [form.bat_team, metadata]);

  // Update bowler list when bowling team changes
  useEffect(() => {
    if (metadata && metadata.bowlers_by_team && form.bowl_team) {
      const players = metadata.bowlers_by_team[form.bowl_team] || [];
      setBowlerOptions(players);
      setForm(prev => ({ ...prev, bowler: players[0] || '' }));
    }
  }, [form.bowl_team, metadata]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear validation error on change
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const errors = {};
    const runsNum = parseFloat(form.runs);
    const wicketsNum = parseInt(form.wickets, 10);
    const oversNum = parseFloat(form.overs);
    const strikerNum = parseFloat(form.striker);

    if (form.bat_team === form.bowl_team) {
      errors.bowl_team = "Batting and bowling teams must be different.";
    }

    if (isNaN(runsNum) || runsNum < 0) {
      errors.runs = "Runs must be a number greater than or equal to 0.";
    }

    if (isNaN(wicketsNum) || wicketsNum < 0 || wicketsNum > 10) {
      errors.wickets = "Wickets lost must be an integer between 0 and 10.";
    }

    if (isNaN(oversNum) || oversNum < 0.0 || oversNum > 20.0) {
      errors.overs = "Overs must be a decimal between 0.0 and 20.0.";
    } else {
      // Validate fractional part of overs (e.g. 10.6 is invalid, must be between .0 and .5)
      const overStr = form.overs.toString();
      const dotIndex = overStr.indexOf('.');
      if (dotIndex !== -1) {
        const decimalPart = parseInt(overStr.substring(dotIndex + 1), 10);
        const decimalDigits = overStr.substring(dotIndex + 1).length;
        // If a single digit (like .6) or double digits (like .55)
        if (decimalDigits === 1 && decimalPart > 5) {
          errors.overs = "Overs balls must be from .0 to .5 (e.g., 10.5).";
        }
      }
    }

    if (isNaN(strikerNum) || strikerNum < 0) {
      errors.striker = "Striker runs must be a positive number.";
    } else if (runsNum >= 0 && strikerNum > runsNum) {
      errors.striker = "Striker runs cannot exceed total innings runs.";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    onLoadingChange(true);
    onError(null);

    const payload = {
      venue: form.venue,
      bat_team: form.bat_team,
      bowl_team: form.bowl_team,
      runs: parseInt(form.runs, 10),
      wickets: parseInt(form.wickets, 10),
      overs: parseFloat(form.overs),
      striker: parseInt(form.striker, 10),
      batsman: form.batsman,
      bowler: form.bowler
    };

    try {
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Server error occurred during prediction.');
      }

      onPredictionResult(result);
    } catch (err) {
      onError(err.message);
    } finally {
      onLoadingChange(false);
    }
  };

  if (!metadata || !metadata.venues) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-3"></div>
        <span>Loading Match Metadata...</span>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-4xl mx-auto bg-slate-800/60 border border-slate-700/50 rounded-2xl shadow-2xl p-6 sm:p-8 glassmorphism"
    >
      <div className="flex items-center space-x-3 border-b border-slate-700/50 pb-5 mb-6">
        <div className="p-2.5 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg shadow-md">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide">Enter Match Details</h2>
          <p className="text-xs sm:text-sm text-slate-400">Input the current live match state to forecast the final innings total.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Match Setup Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Venue */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-slate-300 mb-1.5 flex items-center">
              Venue
            </label>
            <select
              name="venue"
              value={form.venue}
              onChange={handleChange}
              className="bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
            >
              {metadata.venues.map(v => (
                <option key={v} value={v} className="bg-slate-900 text-slate-200">{v}</option>
              ))}
            </select>
          </div>

          {/* Batting Team */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-slate-300 mb-1.5">
              Batting Team
            </label>
            <select
              name="bat_team"
              value={form.bat_team}
              onChange={handleChange}
              className="bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
            >
              {metadata.teams.map(t => (
                <option key={t} value={t} className="bg-slate-900 text-slate-200">{t}</option>
              ))}
            </select>
          </div>

          {/* Bowling Team */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-slate-300 mb-1.5">
              Bowling Team
            </label>
            <select
              name="bowl_team"
              value={form.bowl_team}
              onChange={handleChange}
              className={`bg-slate-900/80 border ${validationErrors.bowl_team ? 'border-red-500' : 'border-slate-700'} rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer`}
            >
              {metadata.teams.map(t => (
                <option key={t} value={t} className="bg-slate-900 text-slate-200">{t}</option>
              ))}
            </select>
            {validationErrors.bowl_team && (
              <span className="text-xs text-red-400 mt-1 flex items-center"><AlertTriangle className="w-3.5 h-3.5 mr-1" />{validationErrors.bowl_team}</span>
            )}
          </div>
        </div>

        {/* Players Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Striker (Batsman) */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Active Striker (Batsman)</span>
              <span className="text-xs text-blue-400">Filtered by Batting Team</span>
            </label>
            <select
              name="batsman"
              value={form.batsman}
              onChange={handleChange}
              className="bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
            >
              {batsmenOptions.map(player => (
                <option key={player} value={player} className="bg-slate-900 text-slate-200">{player}</option>
              ))}
            </select>
          </div>

          {/* Bowler */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Active Bowler</span>
              <span className="text-xs text-orange-400">Filtered by Bowling Team</span>
            </label>
            <select
              name="bowler"
              value={form.bowler}
              onChange={handleChange}
              className="bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
            >
              {bowlerOptions.map(player => (
                <option key={player} value={player} className="bg-slate-900 text-slate-200">{player}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Match Progress Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          {/* Current Runs */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-slate-300 mb-1.5">
              Current Runs
            </label>
            <input
              type="number"
              name="runs"
              min="0"
              value={form.runs}
              onChange={handleChange}
              placeholder="e.g. 85"
              className={`bg-slate-900/80 border ${validationErrors.runs ? 'border-red-500' : 'border-slate-700'} rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
            {validationErrors.runs && (
              <span className="text-xs text-red-400 mt-1 flex items-center"><AlertTriangle className="w-3.5 h-3.5 mr-1" />{validationErrors.runs}</span>
            )}
          </div>

          {/* Wickets Fallen */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-slate-300 mb-1.5">
              Wickets Fallen
            </label>
            <input
              type="number"
              name="wickets"
              min="0"
              max="10"
              value={form.wickets}
              onChange={handleChange}
              placeholder="0 - 10"
              className={`bg-slate-900/80 border ${validationErrors.wickets ? 'border-red-500' : 'border-slate-700'} rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
            {validationErrors.wickets && (
              <span className="text-xs text-red-400 mt-1 flex items-center"><AlertTriangle className="w-3.5 h-3.5 mr-1" />{validationErrors.wickets}</span>
            )}
          </div>

          {/* Overs Completed */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-slate-300 mb-1.5">
              Overs Completed
            </label>
            <input
              type="number"
              name="overs"
              step="0.1"
              min="0"
              max="20"
              value={form.overs}
              onChange={handleChange}
              placeholder="0.0 - 20.0"
              className={`bg-slate-900/80 border ${validationErrors.overs ? 'border-red-500' : 'border-slate-700'} rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
            {validationErrors.overs && (
              <span className="text-xs text-red-400 mt-1 flex items-center"><AlertTriangle className="w-3.5 h-3.5 mr-1" />{validationErrors.overs}</span>
            )}
          </div>

          {/* Striker Runs */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-slate-300 mb-1.5">
              Striker Runs
            </label>
            <input
              type="number"
              name="striker"
              min="0"
              value={form.striker}
              onChange={handleChange}
              placeholder="e.g. 45"
              className={`bg-slate-900/80 border ${validationErrors.striker ? 'border-red-500' : 'border-slate-700'} rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
            {validationErrors.striker && (
              <span className="text-xs text-red-400 mt-1 flex items-center"><AlertTriangle className="w-3.5 h-3.5 mr-1" />{validationErrors.striker}</span>
            )}
          </div>
        </div>

        {/* Predict Action */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 hover:opacity-95 text-white font-semibold py-4 rounded-xl shadow-lg transition duration-200 cursor-pointer group"
          >
            <span>Predict Innings Score</span>
            <Play className="w-5 h-5 fill-white group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </form>
    </motion.div>
  );
}
