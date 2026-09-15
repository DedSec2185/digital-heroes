import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GolfScore } from '../types';
import { X, Calendar, Flag, AlertCircle, Sparkles } from 'lucide-react';

interface ScoreEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingScore?: GolfScore | null;
}

export const ScoreEntryModal: React.FC<ScoreEntryModalProps> = ({
  isOpen,
  onClose,
  editingScore,
}) => {
  const { addScore, updateScore, userScores } = useApp();

  const [scoreVal, setScoreVal] = useState<string>(
    editingScore ? editingScore.score.toString() : '36'
  );
  const [dateVal, setDateVal] = useState<string>(
    editingScore ? editingScore.date : new Date().toISOString().split('T')[0]
  );
  const [courseVal, setCourseVal] = useState<string>(
    editingScore ? editingScore.courseName : 'St. Andrews Old Course'
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const parsedScore = parseInt(scoreVal);
    if (isNaN(parsedScore) || parsedScore < 1 || parsedScore > 45) {
      setErrorMessage('Score must be a valid integer between 1 and 45 (Stableford format).');
      return;
    }

    if (!dateVal) {
      setErrorMessage('Please select a valid date for this golf round.');
      return;
    }

    if (editingScore) {
      const res = updateScore(editingScore.id, parsedScore, dateVal, courseVal);
      if (!res.success) {
        setErrorMessage(res.error || 'Failed to update score.');
        return;
      }
    } else {
      const res = addScore(parsedScore, dateVal, courseVal);
      if (!res.success) {
        setErrorMessage(res.error || 'Failed to record score.');
        return;
      }
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-panel max-w-md w-full p-6 sm:p-8 rounded-3xl border border-white/20 bg-slate-900 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            § 05 Score Management
          </span>
          <h3 className="text-xl font-bold text-white mt-2">
            {editingScore ? 'Edit Recorded Score' : 'Log New Stableford Score'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Valid range: 1–45. Adding a 6th score automatically replaces your oldest round.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Stableford Score Input */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-300 uppercase">
                Stableford Points (1–45)
              </label>
              <span className="text-[11px] text-emerald-400 font-mono">1–45 Range</span>
            </div>
            <input
              type="number"
              min="1"
              max="45"
              required
              value={scoreVal}
              onChange={(e) => setScoreVal(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-2xl font-bold text-center focus:outline-none focus:border-emerald-400 shadow-inner"
            />
          </div>

          {/* Date Picker */}
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase block mb-1">
              Date of Round
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="date"
                required
                max={new Date().toISOString().split('T')[0]}
                value={dateVal}
                onChange={(e) => setDateVal(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-400"
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              * Strictly 1 score per date. Existing rounds for this date must be edited.
            </p>
          </div>

          {/* Course Name */}
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase block mb-1">
              Golf Course / Club Name
            </label>
            <div className="relative">
              <Flag className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={courseVal}
                onChange={(e) => setCourseVal(e.target.value)}
                placeholder="e.g. St. Andrews Links, Pebble Beach"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-400"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:brightness-110 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all"
            >
              {editingScore ? 'Save Changes' : 'Confirm & Save Score'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
