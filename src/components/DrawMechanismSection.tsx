import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DrawEngine } from '../lib/drawEngine';
import { 
  Trophy, 
  Sparkles, 
  RotateCcw, 
  Coins, 
  Check, 
  Info,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const DrawMechanismSection: React.FC = () => {
  const { activeDraw, userScores } = useApp();

  // Interactive Live Simulator for visitors/subscribers to test their luck
  const [customNumbers, setCustomNumbers] = useState<number[]>([38, 34, 41, 29, 36]);
  const [testDrawnNumbers, setTestDrawnNumbers] = useState<number[]>([38, 34, 41, 15, 22]);
  const [simulatedMatch, setSimulatedMatch] = useState<{ matchedCount: number; matchedNumbers: number[] } | null>({
    matchedCount: 3,
    matchedNumbers: [38, 34, 41]
  });

  const handleRunTestDraw = () => {
    const fresh = DrawEngine.generateRandomNumbers();
    setTestDrawnNumbers(fresh);
    const match = DrawEngine.calculateMatches(customNumbers, fresh);
    setSimulatedMatch(match);

    if (match.matchedCount >= 3) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
  };

  const handleNumberInput = (idx: number, val: string) => {
    const num = parseInt(val);
    if (!isNaN(num) && num >= 1 && num <= 45) {
      const copy = [...customNumbers];
      copy[idx] = num;
      setCustomNumbers(copy);
      const match = DrawEngine.calculateMatches(copy, testDrawnNumbers);
      setSimulatedMatch(match);
    }
  };

  return (
    <section className="py-16 border-t border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <Trophy className="w-3.5 h-3.5" /> § 06 & § 07 Prize Engine
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Draw Mechanics & Prize Pool Logic
            </h2>
            <p className="mt-2 text-slate-400 text-sm max-w-xl">
              Transparent, automated, and mathematically enforced reward splits. Monthly prize pools are funded directly by active subscriber memberships.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-right">
              <span className="text-[11px] text-slate-400 block uppercase font-medium">Upcoming Draw</span>
              <span className="text-sm font-bold text-white font-mono">
                {activeDraw ? new Date(activeDraw.drawDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Next Month'}
              </span>
            </div>
          </div>
        </div>

        {/* Prize Pool Distribution Tier Cards (§ 07) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Tier 1: 5-Number Match Jackpot */}
          <div className="glass-panel p-6 rounded-2xl relative overflow-hidden border-amber-500/30 bg-gradient-to-b from-amber-500/10 via-slate-900 to-slate-950">
            <div className="absolute -right-8 -top-8 w-28 h-28 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                5-Number Match (Jackpot)
              </span>
              <span className="text-xs font-mono font-bold text-amber-400">40% POOL SHARE</span>
            </div>

            <div className="my-4">
              <span className="text-3xl sm:text-4xl font-black font-mono text-white">
                ${(activeDraw?.jackpotPool || 20000).toLocaleString()}
              </span>
              <span className="text-xs text-slate-400 block mt-1">Est. Payout per Winner</span>
            </div>

            <div className="border-t border-white/10 pt-4 mt-4 space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Rollover Mechanism:</span>
                <span className="text-emerald-400 font-semibold">Yes — Carries Forward</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Current Carried Rollover:</span>
                <span className="font-mono text-amber-300 font-semibold">${(activeDraw?.rolloverJackpot || 10000).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Split Model:</span>
                <span className="text-slate-400">Equal split among 5-match winners</span>
              </div>
            </div>
          </div>

          {/* Tier 2: 4-Number Match */}
          <div className="glass-panel p-6 rounded-2xl relative overflow-hidden border-teal-500/20 bg-slate-900/60">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-teal-400/20 text-teal-300 border border-teal-400/30">
                4-Number Match
              </span>
              <span className="text-xs font-mono font-bold text-teal-400">35% POOL SHARE</span>
            </div>

            <div className="my-4">
              <span className="text-3xl sm:text-4xl font-black font-mono text-white">
                ${(activeDraw?.tier2Pool || 8750).toLocaleString()}
              </span>
              <span className="text-xs text-slate-400 block mt-1">Dedicated Tier Pool</span>
            </div>

            <div className="border-t border-white/10 pt-4 mt-4 space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Rollover Mechanism:</span>
                <span className="text-slate-400">No (Always Disbursed)</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Odds Multiplier:</span>
                <span className="text-teal-300 font-semibold">High frequency tier</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Split Model:</span>
                <span className="text-slate-400">Equal split among 4-match winners</span>
              </div>
            </div>
          </div>

          {/* Tier 3: 3-Number Match */}
          <div className="glass-panel p-6 rounded-2xl relative overflow-hidden border-slate-700 bg-slate-900/40">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-slate-700 text-slate-200 border border-slate-600">
                3-Number Match
              </span>
              <span className="text-xs font-mono font-bold text-slate-300">25% POOL SHARE</span>
            </div>

            <div className="my-4">
              <span className="text-3xl sm:text-4xl font-black font-mono text-white">
                ${(activeDraw?.tier3Pool || 6250).toLocaleString()}
              </span>
              <span className="text-xs text-slate-400 block mt-1">Dedicated Tier Pool</span>
            </div>

            <div className="border-t border-white/10 pt-4 mt-4 space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Rollover Mechanism:</span>
                <span className="text-slate-400">No (Guaranteed Payout)</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Accessibility:</span>
                <span className="text-slate-300 font-semibold">Multiple monthly winners</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Split Model:</span>
                <span className="text-slate-400">Equal split among 3-match winners</span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Draw Matching Simulator (§ 06) */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Live Interactive Simulator
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                Test Your 5 Golf Scores Against A Live Draw
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Input any 5 Stableford numbers (1–45) to see how the matching engine checks tickets and awards cash tiers in real time.
              </p>
            </div>

            <button
              onClick={handleRunTestDraw}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 font-bold text-xs hover:brightness-110 shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Simulate New 5-Ball Draw</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            {/* Left: User Ticket Numbers */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Your 5 Stored Golf Scores (Range: 1–45)
                </span>
                <span className="text-[11px] text-slate-500">Edit values below</span>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                {customNumbers.map((num, idx) => {
                  const isMatch = testDrawnNumbers.includes(num);
                  return (
                    <div key={idx} className="flex flex-col items-center gap-1">
                      <input
                        type="number"
                        min="1"
                        max="45"
                        value={num}
                        onChange={(e) => handleNumberInput(idx, e.target.value)}
                        className={`w-14 h-14 rounded-2xl text-center font-mono font-bold text-lg border-2 transition-all outline-none ${
                          isMatch 
                            ? 'bg-emerald-500 text-slate-950 border-emerald-300 shadow-lg shadow-emerald-500/40 ring-4 ring-emerald-500/20' 
                            : 'bg-slate-900 text-white border-slate-700 focus:border-emerald-400'
                        }`}
                      />
                      <span className="text-[10px] text-slate-400">Game #{idx + 1}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Drawn Ball Numbers */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
                  Drawn Numbers From Machine (5 Balls)
                </span>
                <span className="text-[11px] text-amber-400/80 font-mono">Random Selection</span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {testDrawnNumbers.map((ball, idx) => {
                  const isMatchedByUser = customNumbers.includes(ball);
                  return (
                    <div
                      key={idx}
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center font-mono font-bold text-lg border-2 transition-all ${
                        isMatchedByUser
                          ? 'gold-ball text-slate-950 border-amber-300 shadow-lg shadow-amber-500/40 ring-4 ring-amber-500/20'
                          : 'bg-slate-800/80 text-slate-300 border-slate-700'
                      }`}
                    >
                      {ball}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Simulation Outcome Banner */}
          <div className="mt-8 p-4 rounded-2xl bg-slate-900/90 border border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-base ${
                (simulatedMatch?.matchedCount || 0) >= 3 
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30' 
                  : 'bg-slate-800 text-slate-400'
              }`}>
                {simulatedMatch?.matchedCount || 0}
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  {simulatedMatch?.matchedCount === 5 && 'JACKPOT WINNER! 5 out of 5 Numbers Matched!'}
                  {simulatedMatch?.matchedCount === 4 && 'TIER 2 WINNER! 4 out of 5 Numbers Matched!'}
                  {simulatedMatch?.matchedCount === 3 && 'TIER 3 WINNER! 3 out of 5 Numbers Matched!'}
                  {(simulatedMatch?.matchedCount || 0) < 3 && 'No Prize Tier Match (Requires at least 3 matching numbers)'}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Matched numbers:{' '}
                  {simulatedMatch?.matchedNumbers.length ? (
                    <span className="font-mono text-emerald-400 font-semibold">
                      [{simulatedMatch.matchedNumbers.join(', ')}]
                    </span>
                  ) : (
                    'None'
                  )}
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-slate-400 block uppercase">Projected Winnings</span>
              <span className="text-base font-bold font-mono text-emerald-400">
                {simulatedMatch?.matchedCount === 5 && `$${(activeDraw?.jackpotPool || 20000).toLocaleString()}`}
                {simulatedMatch?.matchedCount === 4 && `$${(activeDraw?.tier2Pool || 8750).toLocaleString()}`}
                {simulatedMatch?.matchedCount === 3 && `$${Math.round((activeDraw?.tier3Pool || 6250) / 8).toLocaleString()}`}
                {(simulatedMatch?.matchedCount || 0) < 3 && '$0.00'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
