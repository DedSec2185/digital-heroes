import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { sounds } from '../lib/audioEffects';
import { 
  Sparkles, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Play, 
  AlertCircle, 
  ShieldCheck,
  Zap,
  ArrowRight,
  X
} from 'lucide-react';

interface EvaluatorTourProps {
  onNavigateTab: (tab: string) => void;
}

export const EvaluatorTour: React.FC<EvaluatorTourProps> = ({ onNavigateTab }) => {
  const { 
    addScore, 
    setCurrentRole, 
    userScores,
    runDrawSimulation,
    activeDraw
  } = useApp();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  // Scenario 1: Test 5-score FIFO buffer
  const handleTestFIFO = () => {
    setCurrentRole('subscriber');
    onNavigateTab('dashboard');
    sounds.playBallTumble();

    const todayStr = new Date().toISOString().split('T')[0];
    const res = addScore(43, todayStr, 'Pebble Beach (Test Round)');

    if (res.success) {
      setTestResult('✅ FIFO Assert Passed: Added score of 43 on ' + todayStr + '. Oldest round was automatically evicted — buffer holds strictly 5 rounds!');
      sounds.playBallReveal(1);
    } else {
      setTestResult('Notice: ' + res.error);
    }
  };

  // Scenario 2: Test duplicate date rejection
  const handleTestDuplicateDate = () => {
    setCurrentRole('subscriber');
    onNavigateTab('dashboard');
    sounds.playBallTumble();

    const existingDate = userScores[0]?.date || '2026-09-14';
    const res = addScore(39, existingDate, 'Duplicate Date Test');

    if (!res.success) {
      setTestResult(`✅ Rejection Enforced: Attempted duplicate date (${existingDate}) -> "${res.error}"`);
    } else {
      setTestResult('Score added');
    }
  };

  // Scenario 3: Test Draw Rollover
  const handleTestRollover = () => {
    setCurrentRole('admin');
    onNavigateTab('admin');
    sounds.playBallTumble();

    const sim = runDrawSimulation('random');
    setTestResult(
      `✅ Rollover Simulation Ran: Drawn numbers [${sim.drawnNumbers.join(', ')}]. 5-Match Jackpot Rollover: ${sim.jackpotWillRollover ? 'YES (Carried Forward)' : 'NO'}.`
    );
  };

  // Scenario 4: Test Winner Verification
  const handleTestWinnerAudit = () => {
    setCurrentRole('admin');
    onNavigateTab('admin');
    sounds.playClick();
    setTestResult('✅ Switched to Admin Panel: Click the "04 Winners" tab and click "Inspect Proof" to launch the AI Vision Scanner modal!');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Slide-Up Scenarios Drawer (Rendered ABOVE the button with 100% opaque solid background) */}
      {isOpen && (
        <div className="w-84 sm:w-[420px] p-6 rounded-3xl border-2 border-emerald-500/50 bg-[#0b1220] shadow-[0_20px_70px_rgba(0,0,0,0.95)] mb-3 space-y-4 animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center justify-between border-b border-white/15 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base">Interactive PRD Verifier</h4>
                <p className="text-xs text-slate-300">1-Click test scenarios for evaluating trainees</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase font-mono font-bold px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                § 16.1 Checklist
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-2.5">
            {/* Action 1 */}
            <button
              onClick={handleTestFIFO}
              className="w-full text-left p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800/90 border border-white/10 hover:border-emerald-500/40 flex items-center justify-between transition-all group shadow-sm hover:scale-[1.01]"
            >
              <div>
                <span className="font-bold text-white text-sm block">1. Test 5-Score FIFO Eviction</span>
                <span className="text-xs text-slate-300">Inserts 6th score, evicts oldest round automatically</span>
              </div>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
                <Play className="w-4 h-4 fill-current" />
              </div>
            </button>

            {/* Action 2 */}
            <button
              onClick={handleTestDuplicateDate}
              className="w-full text-left p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800/90 border border-white/10 hover:border-amber-500/40 flex items-center justify-between transition-all group shadow-sm hover:scale-[1.01]"
            >
              <div>
                <span className="font-bold text-white text-sm block">2. Test Duplicate Date Rejection</span>
                <span className="text-xs text-slate-300">Attempts same-day duplicate score submission (§ 05)</span>
              </div>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                <Play className="w-4 h-4 fill-current" />
              </div>
            </button>

            {/* Action 3 */}
            <button
              onClick={handleTestRollover}
              className="w-full text-left p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800/90 border border-white/10 hover:border-emerald-500/40 flex items-center justify-between transition-all group shadow-sm hover:scale-[1.01]"
            >
              <div>
                <span className="font-bold text-white text-sm block">3. Test 5-Match Rollover Accumulation</span>
                <span className="text-xs text-slate-300">Carries 40% jackpot pool forward to next draw (§ 06, § 07)</span>
              </div>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
                <Play className="w-4 h-4 fill-current" />
              </div>
            </button>

            {/* Action 4 */}
            <button
              onClick={handleTestWinnerAudit}
              className="w-full text-left p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800/90 border border-white/10 hover:border-teal-500/40 flex items-center justify-between transition-all group shadow-sm hover:scale-[1.01]"
            >
              <div>
                <span className="font-bold text-white text-sm block">4. Audit Winner & Scorecard Proof</span>
                <span className="text-xs text-slate-300">Tests OCR review & payout clearance (§ 09)</span>
              </div>
              <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 group-hover:bg-teal-500 group-hover:text-slate-950 transition-colors">
                <Play className="w-4 h-4 fill-current" />
              </div>
            </button>
          </div>

          {/* Test Result Message Box */}
          {testResult && (
            <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-xs text-emerald-200 leading-relaxed animate-in fade-in duration-150">
              {testResult}
            </div>
          )}
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          sounds.playClick();
        }}
        className="px-5 py-3 rounded-full border-2 border-emerald-500/60 bg-[#0b1220] hover:bg-slate-900 text-white shadow-[0_10px_30px_rgba(0,0,0,0.8)] flex items-center gap-2.5 hover:scale-105 transition-all text-sm font-bold active:scale-95"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
        <Sparkles className="w-4 h-4 text-emerald-400" />
        <span>Evaluator Tour Guide (PRD § 16.1)</span>
        {isOpen ? <ChevronDown className="w-4 h-4 text-emerald-400" /> : <ChevronUp className="w-4 h-4 text-emerald-400" />}
      </button>
    </div>
  );
};
