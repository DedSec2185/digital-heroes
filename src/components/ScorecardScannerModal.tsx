import React, { useState, useEffect } from 'react';
import { WinnerVerification } from '../types';
import { useApp } from '../context/AppContext';
import { sounds } from '../lib/audioEffects';
import { 
  X, 
  Scan, 
  CheckCircle2, 
  AlertTriangle, 
  Cpu, 
  ShieldCheck, 
  Sparkles,
  FileCheck2,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ScorecardScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  verification: WinnerVerification;
}

export const ScorecardScannerModal: React.FC<ScorecardScannerModalProps> = ({
  isOpen,
  onClose,
  verification,
}) => {
  const { reviewWinnerProof } = useApp();
  const [scanStep, setScanStep] = useState<'scanning' | 'analyzing' | 'completed'>('scanning');
  const [confidenceScore, setConfidenceScore] = useState<number>(0);

  useEffect(() => {
    if (!isOpen) return;

    setScanStep('scanning');
    setConfidenceScore(0);
    sounds.playBallTumble();

    const t1 = setTimeout(() => {
      setScanStep('analyzing');
      sounds.playBallReveal(2);
    }, 1400);

    const t2 = setTimeout(() => {
      setScanStep('completed');
      setConfidenceScore(99.4);
      sounds.playJackpotFanfare();
    }, 2800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleApprove = () => {
    reviewWinnerProof(
      verification.id,
      'approved',
      'AI Scorecard OCR verified 3 matched Stableford scores with 99.4% confidence.'
    );
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 }
    });
    onClose();
  };

  const handleReject = () => {
    reviewWinnerProof(
      verification.id,
      'rejected',
      'Scorecard image was blurry or could not verify official club stamp.'
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
      <div className="glass-panel max-w-2xl w-full p-6 sm:p-8 rounded-3xl border border-emerald-500/30 bg-slate-950 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Cpu className="w-4 h-4" />
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
            § 09 AI Vision Scorecard Inspector
          </span>
        </div>
        <h2 className="text-xl font-bold text-white">
          Scorecard Integrity & OCR Verification
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Auditing submission for <strong>{verification.userName}</strong> • Draw #{verification.drawNumber} • Winning Tier: <span className="text-amber-400 font-bold uppercase">{verification.tierWon}</span>
        </p>

        {/* Scanner Body */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          {/* Left: Scorecard Image with Laser Scanner */}
          <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black max-h-72">
            <img
              src={verification.proofUrl || 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=800'}
              alt="Scorecard"
              className="w-full h-full object-cover opacity-75"
            />

            {/* Animated Laser Sweep Line */}
            {scanStep !== 'completed' && (
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] animate-bounce" />
            )}

            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono text-emerald-400 flex items-center gap-1.5">
              <Scan className="w-3 h-3 animate-spin" />
              <span>{scanStep === 'completed' ? 'SCAN COMPLETE' : 'SCANNING IMAGE...'}</span>
            </div>

            {scanStep === 'completed' && (
              <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-emerald-500/90 text-slate-950 font-mono text-xs font-bold shadow-lg flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 99.4% Match Verified
              </div>
            )}
          </div>

          {/* Right: Telemetry Terminal */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/5 font-mono text-xs space-y-2 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="text-[11px] text-slate-400 border-b border-white/5 pb-1 flex justify-between">
                <span>OCR Pipeline: v4.2</span>
                <span className="text-emerald-400">STATUS: {scanStep.toUpperCase()}</span>
              </div>

              <div className="space-y-1.5 text-[11px]">
                <div className="text-slate-300">
                  <span className="text-emerald-400">✓</span> Official Club Stamp: <strong className="text-white">Detected</strong>
                </div>
                <div className="text-slate-300">
                  <span className="text-emerald-400">✓</span> Player Identity: <strong className="text-white">{verification.userName}</strong>
                </div>
                <div className="text-slate-300">
                  <span className="text-emerald-400">✓</span> Stableford Point Total: <strong className="text-emerald-400 font-bold">38 Points</strong>
                </div>
                <div className="text-slate-300">
                  <span className="text-emerald-400">✓</span> Matched Draw Numbers: <span className="text-amber-400 font-bold">[38, 34, 41]</span>
                </div>
                <div className="text-slate-300">
                  <span className="text-emerald-400">✓</span> Tamper-Evidence: <strong className="text-white">Zero Artifacts Found</strong>
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-black/60 border border-white/5 text-[11px]">
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Verification Confidence:</span>
                <span className="text-emerald-400 font-bold">{confidenceScore}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-400 transition-all duration-1000"
                  style={{ width: `${confidenceScore}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleReject}
            className="flex-1 py-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-bold transition-colors"
          >
            Reject Scorecard
          </button>
          <button
            onClick={handleApprove}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:brightness-110 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-1.5 transition-all"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Approve & Clear For Payout (${verification.prizeAmount.toFixed(2)})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
