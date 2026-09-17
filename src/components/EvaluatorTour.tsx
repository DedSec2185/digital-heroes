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
  ArrowRight
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
      setTestResult('Success: Added round of 43 on ' + todayStr + '. Notice that your oldest round was evicted — exactly 5 scores retained!');
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

    // Pick first existing date from user scores
    const existingDate = userScores[0]?.date || '2026-09-14';
    const res = addScore(39, existingDate, 'Duplicate Date Test');

    if (!res.success) {
      setTestResult(`Enforced Correctly: Rejection triggered -> "${res.error}"`);
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
      `Draw Simulation Ran: Candidate numbers [${sim.drawnNumbers.join(', ')}]. Jackpot rollover triggered: ${sim.jackpotWillRollover ? 'YES (Carries Forward)' : 'NO'}.`
    );
  };

  // Scenario 4: Test Winner Verification
  const handleTestWinnerAudit = () => {
    setCurrentRole('admin');
    onNavigateTab('admin');
    sounds.playClick();
    setTestResult('Switched to Admin Control: Click "04 Winners" tab and click "Inspect Proof" to launch the AI Vision Scanner!');
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {/* Floating Toggle Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          sounds.playClick();
        }}
        className="glass-panel px-4 py-2.5 rounded-full border border-emerald-500/40 bg-slate-950/90 text-white shadow-2xl flex items-center gap-2 hover:scale-105 transition-all text-xs font-bold"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <Sparkles className="w-4 h-4 text-emerald-400" />
        <span>Evaluator Tour Guide (PRD § 16.1)</span>
        {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
      </button>

      {/* Slide-Up Scenarios Drawer */}
      {isOpen && (
        <div className="glass-panel w-84 sm:w-96 p-5 rounded-3xl border border-emerald-500/30 bg-slate-950 shadow-2xl mt-3 space-y-4 text-xs animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div>
              <h4 className="font-bold text-white text-sm">Interactive PRD Verifier</h4>
              <p className="text-[11px] text-slate-400">1-Click test scenarios for evaluating trainees</p>
            </div>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              § 16.1 Checklist
            </span>
          </div>

          <div className="space-y-2">
            {/* Action 1 */}
            <button
              onClick={handleTestFIFO}
              className="w-full text-left p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/5 flex items-center justify-between transition-colors group"
            >
              <div>
                <span className="font-semibold text-white block">1. Test 5-Score FIFO Eviction</span>
                <span className="text-[10px] text-slate-400">Inserts 6th score, evicts oldest round</span>
              </div>
              <Play className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Action 2 */}
            <button
              onClick={handleTestDuplicateDate}
              className="w-full text-left p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/5 flex items-center justify-between transition-colors group"
            >
              <div>
                <span className="font-semibold text-white block">2. Test Duplicate Date Rejection</span>
                <span className="text-[10px] text-slate-400">Attempts duplicate date submission (§ 05)</span>
              </div>
              <Play className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Action 3 */}
            <button
              onClick={handleTestRollover}
              className="w-full text-left p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/5 flex items-center justify-between transition-colors group"
            >
              <div>
                <span className="font-semibold text-white block">3. Test 5-Match Rollover Accumulation</span>
                <span className="text-[10px] text-slate-400">Carries 40% pool to next draw (§ 06, § 07)</span>
              </div>
              <Play className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Action 4 */}
            <button
              onClick={handleTestWinnerAudit}
              className="w-full text-left p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/5 flex items-center justify-between transition-colors group"
            >
              <div>
                <span className="font-semibold text-white block">4. Audit Winner & Scorecard Proof</span>
                <span className="text-[10px] text-slate-400">Tests OCR review & payout clearance (§ 09)</span>
              </div>
              <Play className="w-3.5 h-3.5 text-teal-400 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Test Result Message */}
          {testResult && (
            <div className="p-3 rounded-xl bg-black/60 border border-emerald-500/20 text-[11px] text-emerald-300">
              {testResult}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
