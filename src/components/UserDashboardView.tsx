import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GolfScore, WinnerVerification } from '../types';
import { ScoreEntryModal } from './ScoreEntryModal';
import { WinnerProofUploadModal } from './WinnerProofUploadModal';
import { ScorecardScannerModal } from './ScorecardScannerModal';
import { ImpactCalculator } from '../lib/impactCalculator';
import { sounds } from '../lib/audioEffects';
import { 
  Sparkles, 
  Calendar, 
  Plus, 
  Trash2, 
  Edit3, 
  Heart, 
  Trophy, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Info,
  Scan
} from 'lucide-react';

interface UserDashboardViewProps {
  onOpenSubscribe: () => void;
  onExploreCharities: () => void;
}

export const UserDashboardView: React.FC<UserDashboardViewProps> = ({
  onOpenSubscribe,
  onExploreCharities,
}) => {
  const { 
    currentUser, 
    subscription, 
    userScores, 
    deleteScore, 
    selectedCharity, 
    updateCharityPreference,
    activeDraw,
    draws,
    verifications,
    cancelSubscription,
    renewSubscription
  } = useApp();

  // Modals state
  const [isScoreModalOpen, setIsScoreModalOpen] = useState<boolean>(false);
  const [editingScore, setEditingScore] = useState<GolfScore | null>(null);
  
  const [activeProofVerification, setActiveProofVerification] = useState<WinnerVerification | null>(null);

  // Charity percentage slider state
  const [sliderPercentage, setSliderPercentage] = useState<number>(currentUser.charityPercentage || 10);
  const [inspectingVerification, setInspectingVerification] = useState<WinnerVerification | null>(null);

  const tangibleImpact = selectedCharity
    ? ImpactCalculator.getTangibleImpact(selectedCharity.category, (19.99 * sliderPercentage) / 100)
    : null;

  const avgScore = userScores.length
    ? (userScores.reduce((sum, s) => sum + s.score, 0) / userScores.length).toFixed(1)
    : '0.0';
  const bestScore = userScores.length ? Math.max(...userScores.map(s => s.score)) : 0;
  const lowestScore = userScores.length ? Math.min(...userScores.map(s => s.score)) : 0;

  const handleOpenAddScore = () => {
    sounds.playClick();
    setEditingScore(null);
    setIsScoreModalOpen(true);
  };

  const handleOpenEditScore = (score: GolfScore) => {
    sounds.playClick();
    setEditingScore(score);
    setIsScoreModalOpen(true);
  };

  const handleCommitSliderPercentage = () => {
    sounds.playBallReveal(3);
    if (selectedCharity) {
      updateCharityPreference(selectedCharity.id, sliderPercentage);
    }
  };

  // User winnings
  const userVerifications = verifications.filter(v => v.userId === currentUser.id);
  const totalWon = userVerifications.reduce((sum, v) => sum + v.prizeAmount, 0);

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Top Banner / User Welcome (§ 10) */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-white/15 bg-gradient-to-r from-slate-950 via-[#0c1424] to-slate-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 shadow-2xl">
        <div className="flex items-center gap-5">
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.fullName}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-400 shadow-xl shadow-emerald-950/50"
          />
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">{currentUser.fullName}</h1>
              <span className="text-xs uppercase font-mono font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Verified Subscriber
              </span>
            </div>
            <p className="text-sm sm:text-base text-slate-300 mt-2 flex flex-wrap items-center gap-3">
              <span>Home Club: <strong className="text-white font-semibold">{currentUser.homeClub}</strong></span>
              <span className="text-slate-500">•</span>
              <span>Handicap Index: <strong className="text-emerald-400 font-mono font-bold">{currentUser.handicap}</strong></span>
            </p>
          </div>
        </div>

        {/* 1. Subscription Status Module (§ 04, § 10) */}
        <div className="flex items-center gap-6 p-5 rounded-2xl bg-black/60 border border-white/15 w-full md:w-auto justify-between md:justify-start shadow-inner">
          <div>
            <span className="text-xs text-slate-400 block uppercase tracking-wider font-bold">Subscription Status</span>
            <div className="flex items-center gap-2.5 mt-1">
              <span className={`w-3 h-3 rounded-full ${
                subscription?.status === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
              }`} />
              <span className="text-base sm:text-lg font-black text-white capitalize">
                {subscription?.status || 'Inactive'} ({subscription?.plan || 'No plan'})
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Renewal Date: <span className="text-white font-mono font-semibold">{subscription?.renewalDate || 'N/A'}</span>
            </p>
          </div>

          <div className="border-l border-white/15 pl-5">
            {subscription?.status === 'active' ? (
              <button
                onClick={cancelSubscription}
                className="text-xs text-rose-400 hover:text-rose-300 underline font-semibold transition-colors"
              >
                Pause / Cancel
              </button>
            ) : (
              <button
                onClick={renewSubscription}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 shadow-md"
              >
                Reactivate
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Score Management & Charity Impact */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 2. Score Management System (§ 05, § 10) - 2 Columns wide */}
        <div className="lg:col-span-2 glass-panel p-8 sm:p-10 rounded-3xl border border-white/15 space-y-8 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/15">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  § 05 Engine
                </span>
                <span className="text-xs text-slate-300 font-mono">5-Score Rolling FIFO Buffer</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-2">Your 5 Active Stableford Scores</h2>
              <p className="text-sm text-slate-300 mt-1">
                These exact 5 numbers represent your active ticket in the upcoming cash draw.
              </p>
            </div>

            <button
              onClick={handleOpenAddScore}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400 hover:brightness-110 text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-emerald-500/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
            >
              <Plus className="w-5 h-5" />
              <span>Log New Round</span>
            </button>
          </div>

          {/* Performance Analytics Telemetry Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-black/60 border border-white/10 text-center shadow-inner">
            <div className="p-2">
              <span className="text-xs text-slate-400 block uppercase font-semibold">Average Points</span>
              <span className="text-xl sm:text-2xl font-black font-mono text-emerald-400 mt-1 block">{avgScore}</span>
            </div>
            <div className="p-2">
              <span className="text-xs text-slate-400 block uppercase font-semibold">Best Round</span>
              <span className="text-xl sm:text-2xl font-black font-mono text-amber-400 mt-1 block">{bestScore} pts</span>
            </div>
            <div className="p-2">
              <span className="text-xs text-slate-400 block uppercase font-semibold">Low Round</span>
              <span className="text-xl sm:text-2xl font-black font-mono text-slate-200 mt-1 block">{lowestScore} pts</span>
            </div>
            <div className="p-2">
              <span className="text-xs text-slate-400 block uppercase font-semibold">Rolling Buffer</span>
              <span className="text-xl sm:text-2xl font-black font-mono text-teal-400 mt-1 block">{userScores.length}/5 Active</span>
            </div>
          </div>

          {/* 5-Score Rolling Slot Cards View */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {[0, 1, 2, 3, 4].map((slotIdx) => {
              const scoreEntry = userScores[slotIdx];

              if (scoreEntry) {
                return (
                  <div
                    key={scoreEntry.id}
                    className="p-5 rounded-2xl bg-slate-900/95 border-2 border-emerald-500/40 shadow-xl relative group hover:border-emerald-300 transition-all flex flex-col justify-between hover:-translate-y-1"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                        <span className="font-mono font-bold text-emerald-400">Slot #{slotIdx + 1}</span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleOpenEditScore(scoreEntry)}
                            className="p-1.5 hover:text-emerald-300 text-slate-300 bg-black/40 rounded"
                            title="Edit this score"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteScore(scoreEntry.id)}
                            className="p-1.5 hover:text-rose-400 text-slate-300 bg-black/40 rounded"
                            title="Delete this score"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Large 3D Golf Ball Visual Element */}
                      <div className="w-16 h-16 rounded-full golf-ball-active mx-auto flex items-center justify-center my-3 shadow-xl">
                        <span className="text-2xl font-black font-mono text-slate-950">
                          {scoreEntry.score}
                        </span>
                      </div>
                    </div>

                    <div className="text-center pt-3 border-t border-white/10">
                      <span className="text-xs font-bold text-white block truncate" title={scoreEntry.courseName}>
                        {scoreEntry.courseName}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono block mt-0.5">
                        {scoreEntry.date}
                      </span>
                    </div>
                  </div>
                );
              }

              // Empty Slot placeholder
              return (
                <div
                  key={slotIdx}
                  onClick={handleOpenAddScore}
                  className="p-5 rounded-2xl border-2 border-dashed border-white/15 hover:border-emerald-500/50 cursor-pointer transition-all flex flex-col items-center justify-center text-center group min-h-[160px] bg-white/[0.02] hover:bg-white/[0.05]"
                >
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-emerald-400 group-hover:bg-emerald-500/20 mb-2 transition-all">
                    <Plus className="w-5 h-5" />
                  </div>
                  <span className="text-xs text-slate-300 font-bold">Slot #{slotIdx + 1}</span>
                  <span className="text-[11px] text-slate-500 font-mono">Empty Round</span>
                </div>
              );
            })}
          </div>

          {/* Rolling Replacement Notice */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 flex items-center gap-3.5 text-xs sm:text-sm text-slate-300">
            <Info className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>
              <strong className="text-white">FIFO Rolling Engine:</strong> Only your latest 5 rounds are kept. When you add a new round, the oldest recorded score ({userScores[userScores.length - 1]?.date || 'None'}) will be automatically archived.
            </span>
          </div>

          {/* Scores Table (Reverse Chronological) */}
          <div>
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
              Scores History (Reverse Chronological Order)
            </h3>
            <div className="divide-y divide-white/5 bg-slate-950/40 rounded-2xl border border-white/5 overflow-hidden text-xs">
              {userScores.map((score, idx) => (
                <div key={score.id} className="p-3.5 flex items-center justify-between hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono font-bold flex items-center justify-center">
                      {score.score}
                    </span>
                    <div>
                      <div className="font-semibold text-white">{score.courseName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{score.date}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditScore(score)}
                      className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-slate-300 text-[11px]"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteScore(score.id)}
                      className="px-2.5 py-1 rounded-md bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-[11px]"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Charity & Giving Settings Card (§ 08, § 10) */}
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-white/15 space-y-8 flex flex-col justify-between shadow-2xl">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                § 08 Impact
              </span>
              <button
                onClick={onExploreCharities}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 transition-all"
              >
                <span>Change Charity</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <h2 className="text-2xl font-black text-white">Selected Charity Recipient</h2>

            {selectedCharity ? (
              <div className="mt-5 p-5 rounded-2xl bg-slate-950/90 border-2 border-emerald-500/30 shadow-lg">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedCharity.logoUrl}
                    alt={selectedCharity.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-white/15 shadow-md"
                  />
                  <div>
                    <h4 className="text-base font-black text-white">{selectedCharity.name}</h4>
                    <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">
                      {selectedCharity.category}
                    </span>
                  </div>
                </div>
                <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {selectedCharity.tagline}
                </p>
                <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center text-xs sm:text-sm">
                  <span className="text-slate-400">Total Raised to Date:</span>
                  <span className="font-mono text-emerald-400 font-black text-base">${selectedCharity.totalRaised.toLocaleString()}</span>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-slate-950/60 border border-dashed border-white/15 text-center my-4">
                <p className="text-sm text-slate-300">No charity selected yet.</p>
                <button
                  onClick={onExploreCharities}
                  className="mt-3 text-xs text-emerald-400 underline font-bold"
                >
                  Pick A Cause From Directory
                </button>
              </div>
            )}

            {/* Interactive Voluntary Contribution Percentage Slider (§ 08.1) */}
            <div className="mt-8 pt-6 border-t border-white/15">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wider">
                  Voluntary Contribution %
                </label>
                <span className="text-lg font-black font-mono text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-xl border border-emerald-500/40">
                  {sliderPercentage}%
                </span>
              </div>
              
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={sliderPercentage}
                onChange={(e) => setSliderPercentage(parseInt(e.target.value))}
                className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />

              <div className="flex justify-between text-xs text-slate-400 font-mono mt-2 font-medium">
                <span>10% (Mandatory Floor)</span>
                <span>50%</span>
                <span>100%</span>
              </div>

              <div className="mt-5 p-4 rounded-2xl bg-black/60 border border-white/10 text-xs sm:text-sm text-slate-300 space-y-2">
                <div className="flex justify-between">
                  <span>Monthly Charity Grant:</span>
                  <span className="text-emerald-400 font-mono font-bold">
                    ${((19.99 * sliderPercentage) / 100).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Prize Pool Allocation:</span>
                  <span className="text-amber-400 font-mono font-bold">$10.00 (50.0%)</span>
                </div>
              </div>

              {/* Real-World Tangible Impact Card (§ 08) */}
              {tangibleImpact && (
                <div className="mt-4 p-4 rounded-2xl bg-emerald-950/60 border-2 border-emerald-500/40 text-xs sm:text-sm animate-in fade-in duration-300 shadow-xl">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold uppercase tracking-wider text-xs mb-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-400" /> Tangible Humanitarian Outcome
                  </div>
                  <div className="text-white font-black text-sm sm:text-base">
                    {tangibleImpact.metricNumber} {tangibleImpact.metricUnit}
                  </div>
                  <div className="text-xs text-slate-300 mt-1">
                    {tangibleImpact.secondaryOutcome}
                  </div>
                  <div className="text-xs text-emerald-300 font-mono mt-2 pt-2 border-t border-emerald-500/20 font-semibold">
                    {tangibleImpact.equivalentRounds}
                  </div>
                </div>
              )}

              {sliderPercentage !== currentUser.charityPercentage && (
                <button
                  onClick={handleCommitSliderPercentage}
                  className="w-full mt-5 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition-all shadow-xl shadow-emerald-500/20 hover:scale-[1.02]"
                >
                  Save Contribution Percentage
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Draw Participation Summary & Winnings Overview (§ 10, § 09) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 4. Draw Participation Summary (§ 10) */}
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-white/15 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between pb-4 border-b border-white/15">
            <div>
              <span className="text-xs font-mono font-bold text-amber-400 uppercase bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                § 06 & § 07 Ticket
              </span>
              <h3 className="text-xl font-black text-white mt-1">Upcoming Draw Ticket</h3>
            </div>
            <div className="px-3.5 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-300 text-xs font-mono font-bold">
              {activeDraw ? `Draw #${activeDraw.drawNumber}` : 'Next Month'}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-[#0e172a] to-slate-950 border-2 border-amber-500/30 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs sm:text-sm text-slate-300 uppercase font-bold tracking-wider">Your 5 Active Draw Numbers</span>
              <span className="text-xs text-emerald-400 font-mono font-bold bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-500/40">
                ✓ Confirmed Ticket
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3.5 my-3">
              {userScores.slice(0, 5).map((s, idx) => (
                <div
                  key={idx}
                  className="w-14 h-14 rounded-2xl gold-ball flex items-center justify-center font-mono font-black text-slate-950 text-xl shadow-lg"
                >
                  {s.score}
                </div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap justify-between items-center gap-2 text-xs sm:text-sm text-slate-300">
              <span>Next Draw Scheduled:</span>
              <span className="font-mono text-white font-bold">
                {activeDraw ? new Date(activeDraw.drawDate).toLocaleDateString() : 'End of Month'}
              </span>
            </div>
          </div>

          {/* Past Draws Summary */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Recent Draw History
            </h4>
            <div className="space-y-2 text-xs">
              {draws.filter(d => d.status === 'completed').slice(0, 2).map(draw => (
                <div key={draw.id} className="p-3 rounded-xl bg-slate-950/60 border border-white/5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white">{draw.title}</span>
                    <div className="text-[11px] text-slate-400 font-mono">
                      Drawn: [{draw.drawnNumbers?.join(', ')}]
                    </div>
                  </div>
                  <span className="text-emerald-400 font-mono font-semibold">
                    ${draw.totalPrizePool.toLocaleString()} Pool
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 5. Winnings Overview & Verification System (§ 09, § 10) */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase">§ 09 Winnings</span>
              <h3 className="text-lg font-bold text-white mt-0.5">Winnings & Payout Tracking</h3>
            </div>
            <span className="text-xl font-black font-mono text-emerald-400">
              ${totalWon.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>

          {userVerifications.length > 0 ? (
            <div className="space-y-3">
              {userVerifications.map((v) => (
                <div
                  key={v.id}
                  className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-3 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white text-sm">Draw #{v.drawNumber} — {v.tierWon.toUpperCase()} WINNER</span>
                      <p className="text-slate-400 text-[11px]">Matched {v.matchedCount} of 5 numbers</p>
                    </div>
                    <span className="text-base font-bold font-mono text-emerald-400">
                      ${v.prizeAmount.toFixed(2)}
                    </span>
                  </div>

                  {/* Verification Status Banner */}
                  <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-900 border border-white/5">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 text-[11px]">Scorecard Proof:</span>
                      {v.status === 'approved' && (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold text-[10px]">
                          ✓ Verified & Approved
                        </span>
                      )}
                      {v.status === 'pending' && (
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold text-[10px]">
                          ⏳ Pending Admin Review
                        </span>
                      )}
                      {v.status === 'rejected' && (
                        <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-semibold text-[10px]">
                          ✕ Rejected
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 text-[11px]">Payout:</span>
                      <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                        v.paymentStatus === 'paid' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {v.paymentStatus}
                      </span>
                    </div>
                  </div>

                  {/* Proof Upload Trigger if missing or rejected */}
                  {(!v.proofUrl || v.status === 'rejected') ? (
                    <button
                      onClick={() => setActiveProofVerification(v)}
                      className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all"
                    >
                      Upload Scorecard Proof To Claim
                    </button>
                  ) : (
                    <button
                      onClick={() => setInspectingVerification(v)}
                      className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/30 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Scan className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Inspect with AI Scorecard Vision Scanner</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-slate-950/40 border border-dashed border-white/10 text-center">
              <Trophy className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-xs text-slate-400">No winnings yet. Enter your scores to compete in the upcoming monthly draw!</p>
            </div>
          )}
        </div>
      </div>

      {/* Score Entry / Edit Modal */}
      <ScoreEntryModal
        isOpen={isScoreModalOpen}
        onClose={() => setIsScoreModalOpen(false)}
        editingScore={editingScore}
      />

      {/* Winner Proof Upload Modal */}
      {activeProofVerification && (
        <WinnerProofUploadModal
          isOpen={Boolean(activeProofVerification)}
          onClose={() => setActiveProofVerification(null)}
          verification={activeProofVerification}
        />
      )}

      {/* AI Scorecard Scanner Modal (§ 09) */}
      {inspectingVerification && (
        <ScorecardScannerModal
          isOpen={Boolean(inspectingVerification)}
          onClose={() => setInspectingVerification(null)}
          verification={inspectingVerification}
        />
      )}
    </div>
  );
};
