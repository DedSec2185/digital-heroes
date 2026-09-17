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
import { sounds } from '../lib/audioEffects';
import confetti from 'canvas-confetti';

export const DrawMechanismSection: React.FC = () => {
  const { activeDraw, userScores } = useApp();

  // Interactive Live Simulator for visitors/subscribers to test their luck
  const [customNumbers, setCustomNumbers] = useState<number[]>([38, 34, 41, 29, 36]);
  const [testDrawnNumbers, setTestDrawnNumbers] = useState<number[]>([38, 34, 41, 15, 22]);
  const [isRevealing, setIsRevealing] = useState<boolean>(false);
  const [simulatedMatch, setSimulatedMatch] = useState<{ matchedCount: number; matchedNumbers: number[] } | null>({
    matchedCount: 3,
    matchedNumbers: [38, 34, 41]
  });

  const handleRunTestDraw = () => {
    setIsRevealing(true);
    sounds.playBallTumble();
    const fresh = DrawEngine.generateRandomNumbers();
    setTestDrawnNumbers(fresh);

    setTimeout(() => {
      setIsRevealing(false);
      const match = DrawEngine.calculateMatches(customNumbers, fresh);
      setSimulatedMatch(match);

      if (match.matchedCount >= 3) {
        sounds.playJackpotFanfare();
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.6 }
        });
      } else {
        sounds.playBallReveal(0);
      }
    }, 400);
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
    <section className="py-20 border-t border-white/15 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-amber-500/15 border-2 border-amber-500/40 text-amber-300 text-xs sm:text-sm font-bold uppercase tracking-widest mb-4 shadow-lg shadow-amber-950/40">
              <Trophy className="w-4 h-4 text-amber-400" /> § 06 & § 07 Prize Engine
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Draw Mechanics & Prize Pool Logic
            </h2>
            <p className="mt-3 text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed">
              Transparent, automated, and mathematically enforced reward splits. Monthly prize pools are funded directly by active subscriber memberships.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-6 py-3.5 rounded-2xl bg-slate-900/95 border-2 border-white/15 text-right shadow-xl">
              <span className="text-xs text-slate-400 block uppercase font-bold tracking-wider">Upcoming Draw</span>
              <span className="text-base sm:text-lg font-black text-white font-mono">
                {activeDraw ? new Date(activeDraw.drawDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Next Month'}
              </span>
            </div>
          </div>
        </div>

        {/* Prize Pool Distribution Tier Cards (§ 07) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Tier 1: 5-Number Match Jackpot */}
          <div className="glass-panel p-8 sm:p-10 rounded-3xl relative overflow-hidden border-2 border-amber-500/50 bg-gradient-to-b from-amber-500/15 via-[#0f172a] to-slate-950 shadow-2xl hover:-translate-y-1.5 transition-all">
            <div className="absolute -right-8 -top-8 w-36 h-36 bg-amber-500/25 rounded-full blur-3xl pointer-events-none" />
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs sm:text-sm font-black uppercase tracking-wider px-3 py-1.5 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/40 shadow-sm">
                5-Number Match (Jackpot)
              </span>
              <span className="text-xs font-mono font-black text-amber-400">40% POOL SHARE</span>
            </div>

            <div className="my-6">
              <span className="text-4xl sm:text-5xl font-black font-mono text-white tracking-tight text-glow-amber">
                ${(activeDraw?.jackpotPool || 20000).toLocaleString()}
              </span>
              <span className="text-xs sm:text-sm text-amber-200/90 block mt-1 font-semibold">5-Match Jackpot Prize Pool</span>
            </div>

            <div className="border-t border-white/15 pt-5 mt-5 space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between text-slate-200">
                <span className="text-slate-400">Rollover Mechanism:</span>
                <span className="text-emerald-400 font-bold">Yes — Carries Forward</span>
              </div>
              <div className="flex justify-between text-slate-200">
                <span className="text-slate-400">Carried Rollover:</span>
                <span className="font-mono text-amber-300 font-black text-sm">${(activeDraw?.rolloverJackpot || 10000).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-200">
                <span className="text-slate-400">Split Model:</span>
                <span className="text-slate-300 font-medium">Equal split among 5-match winners</span>
              </div>
            </div>
          </div>

          {/* Tier 2: 4-Number Match */}
          <div className="glass-panel p-8 sm:p-10 rounded-3xl relative overflow-hidden border-2 border-teal-500/30 bg-slate-900/80 shadow-2xl hover:-translate-y-1.5 transition-all">
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs sm:text-sm font-black uppercase tracking-wider px-3 py-1.5 rounded-xl bg-teal-400/20 text-teal-300 border border-teal-400/40 shadow-sm">
                4-Number Match
              </span>
              <span className="text-xs font-mono font-black text-teal-400">35% POOL SHARE</span>
            </div>

            <div className="my-6">
              <span className="text-4xl sm:text-5xl font-black font-mono text-white tracking-tight">
                ${(activeDraw?.tier2Pool || 8750).toLocaleString()}
              </span>
              <span className="text-xs sm:text-sm text-slate-300 block mt-1 font-semibold">Tier 2 Payout Pool</span>
            </div>

            <div className="border-t border-white/15 pt-5 mt-5 space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between text-slate-200">
                <span className="text-slate-400">Rollover Mechanism:</span>
                <span className="text-slate-300 font-semibold">No (Always Disbursed)</span>
              </div>
              <div className="flex justify-between text-slate-200">
                <span className="text-slate-400">Odds Multiplier:</span>
                <span className="text-teal-300 font-bold">High frequency tier</span>
              </div>
              <div className="flex justify-between text-slate-200">
                <span className="text-slate-400">Split Model:</span>
                <span className="text-slate-300 font-medium">Equal split among 4-match winners</span>
              </div>
            </div>
          </div>

          {/* Tier 3: 3-Number Match */}
          <div className="glass-panel p-8 sm:p-10 rounded-3xl relative overflow-hidden border-2 border-slate-700 bg-slate-900/60 shadow-2xl hover:-translate-y-1.5 transition-all">
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs sm:text-sm font-black uppercase tracking-wider px-3 py-1.5 rounded-xl bg-slate-700 text-slate-200 border border-slate-600 shadow-sm">
                3-Number Match
              </span>
              <span className="text-xs font-mono font-black text-slate-300">25% POOL SHARE</span>
            </div>

            <div className="my-6">
              <span className="text-4xl sm:text-5xl font-black font-mono text-white tracking-tight">
                ${(activeDraw?.tier3Pool || 6250).toLocaleString()}
              </span>
              <span className="text-xs sm:text-sm text-slate-300 block mt-1 font-semibold">Tier 3 Guaranteed Pool</span>
            </div>

            <div className="border-t border-white/15 pt-5 mt-5 space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between text-slate-200">
                <span className="text-slate-400">Rollover Mechanism:</span>
                <span className="text-slate-300 font-semibold">No (Guaranteed Payout)</span>
              </div>
              <div className="flex justify-between text-slate-200">
                <span className="text-slate-400">Accessibility:</span>
                <span className="text-emerald-400 font-bold">Multiple monthly winners</span>
              </div>
              <div className="flex justify-between text-slate-200">
                <span className="text-slate-400">Split Model:</span>
                <span className="text-slate-300 font-medium">Equal split among 3-match winners</span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Draw Matching Simulator (§ 06) */}
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border-2 border-white/15 bg-gradient-to-r from-slate-950 via-[#0e1628] to-slate-950 shadow-2xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-8 border-b border-white/15">
            <div>
              <span className="text-xs sm:text-sm font-black text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-5 h-5" /> Live Interactive Simulator
              </span>
              <h3 className="text-2xl sm:text-4xl font-black text-white mt-2">
                Test Your 5 Golf Scores Against A Live Draw
              </h3>
              <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-2xl leading-relaxed">
                Input any 5 Stableford numbers (1–45) to see how the matching engine checks tickets and awards cash tiers in real time.
              </p>
            </div>

            <button
              onClick={handleRunTestDraw}
              className="px-8 py-4.5 rounded-2xl bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-400 text-slate-950 font-black text-sm sm:text-base hover:brightness-110 shadow-2xl shadow-amber-500/30 flex items-center gap-3 transition-all hover:scale-105 active:scale-95 shrink-0"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Simulate New 5-Ball Draw</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-10">
            {/* Left: User Ticket Numbers */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wider">
                  Your 5 Stored Golf Scores (Range: 1–45)
                </span>
                <span className="text-xs text-slate-400 font-mono">Editable below</span>
              </div>
              
              <div className="flex flex-wrap items-center gap-3.5">
                {customNumbers.map((num, idx) => {
                  const isMatch = testDrawnNumbers.includes(num);
                  return (
                    <div key={idx} className="flex flex-col items-center gap-1.5">
                      <input
                        type="number"
                        min="1"
                        max="45"
                        value={num}
                        onChange={(e) => handleNumberInput(idx, e.target.value)}
                        className={`w-16 h-16 rounded-2xl text-center font-mono font-black text-xl border-2 transition-all outline-none shadow-md ${
                          isMatch 
                            ? 'bg-emerald-400 text-slate-950 border-emerald-300 shadow-xl shadow-emerald-500/40 ring-4 ring-emerald-500/30 scale-105' 
                            : 'bg-slate-900 text-white border-slate-700 focus:border-emerald-400'
                        }`}
                      />
                      <span className="text-xs text-slate-400 font-mono font-semibold">Game #{idx + 1}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Drawn Ball Numbers */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs sm:text-sm font-bold text-amber-300 uppercase tracking-wider">
                  Drawn Numbers From Machine (5 Balls)
                </span>
                <span className="text-xs text-amber-400 font-mono font-bold">Random Algorithm</span>
              </div>

              <div className="flex flex-wrap items-center gap-3.5">
                {testDrawnNumbers.map((ball, idx) => {
                  const isMatchedByUser = customNumbers.includes(ball);
                  return (
                    <div key={idx} className="flex flex-col items-center gap-1.5">
                      <div
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center font-mono font-black text-xl border-2 transition-all shadow-md ${
                          isMatchedByUser
                            ? 'gold-ball text-slate-950 border-amber-300 shadow-xl shadow-amber-500/40 ring-4 ring-amber-500/30 scale-105'
                            : 'bg-slate-900 text-slate-200 border-slate-700'
                        }`}
                      >
                        {ball}
                      </div>
                      <span className="text-xs text-slate-400 font-mono font-semibold">Ball #{idx + 1}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Simulation Outcome Banner */}
          <div className="mt-10 p-6 rounded-3xl bg-slate-900/95 border-2 border-white/15 flex flex-wrap items-center justify-between gap-6 shadow-2xl">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-mono font-black text-2xl shadow-xl ${
                (simulatedMatch?.matchedCount || 0) >= 3 
                  ? 'bg-emerald-400 text-slate-950 shadow-emerald-500/40' 
                  : 'bg-slate-800 text-slate-300'
              }`}>
                {simulatedMatch?.matchedCount || 0}
              </div>
              <div>
                <h4 className="text-base sm:text-xl font-black text-white">
                  {simulatedMatch?.matchedCount === 5 && '🏆 JACKPOT WINNER! 5 out of 5 Numbers Matched!'}
                  {simulatedMatch?.matchedCount === 4 && '🎉 TIER 2 WINNER! 4 out of 5 Numbers Matched!'}
                  {simulatedMatch?.matchedCount === 3 && '✨ TIER 3 WINNER! 3 out of 5 Numbers Matched!'}
                  {(simulatedMatch?.matchedCount || 0) < 3 && 'No Prize Tier Match (Requires at least 3 matching numbers)'}
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  Matched numbers:{' '}
                  {simulatedMatch?.matchedNumbers.length ? (
                    <span className="font-mono text-emerald-400 font-bold text-sm">
                      [{simulatedMatch.matchedNumbers.join(', ')}]
                    </span>
                  ) : (
                    <span className="text-slate-400">None</span>
                  )}
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400 block uppercase font-bold tracking-wider">Projected Winnings</span>
              <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">
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
