import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { WinnerVerification } from '../types';
import { X, Upload, Check, AlertCircle, Image as ImageIcon } from 'lucide-react';

interface WinnerProofUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  verification: WinnerVerification;
}

const SAMPLE_SCORECARD_URLS = [
  {
    label: 'Scottish Golf Union Official Handicap Certificate',
    url: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=800&auto=format&fit=crop&q=80'
  },
  {
    label: 'St. Andrews Club Electronic Card Export',
    url: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&auto=format&fit=crop&q=80'
  }
];

export const WinnerProofUploadModal: React.FC<WinnerProofUploadModalProps> = ({
  isOpen,
  onClose,
  verification,
}) => {
  const { submitWinnerProof } = useApp();
  const [proofUrl, setProofUrl] = useState<string>(verification.proofUrl || SAMPLE_SCORECARD_URLS[0].url);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofUrl.trim()) return;

    submitWinnerProof(verification.id, proofUrl.trim());
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="glass-panel max-w-lg w-full p-6 sm:p-8 rounded-3xl border border-amber-500/30 bg-slate-900 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
            § 09 Winner Verification
          </span>
          <h3 className="text-xl font-bold text-white mt-2">
            Upload Scorecard Verification Proof
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Draw #{verification.drawNumber} • Winning Tier: <span className="text-amber-400 font-bold uppercase">{verification.tierWon}</span> (${verification.prizeAmount.toLocaleString()})
          </p>
        </div>

        {isSuccess ? (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center my-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center mx-auto mb-2 font-bold text-xl">
              ✓
            </div>
            <h4 className="text-base font-bold text-white">Scorecard Submitted For Review!</h4>
            <p className="text-xs text-emerald-300 mt-1">
              Our audit team has received your proof. Payout will be issued upon approval.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase block mb-1">
                Scorecard Screenshot URL (from official golf platform)
              </label>
              <div className="relative">
                <ImageIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  required
                  value={proofUrl}
                  onChange={(e) => setProofUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm font-mono focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Quick Pick Samples for Testing */}
            <div>
              <span className="text-[11px] text-slate-400 block mb-2 font-medium">
                Quick Test Samples:
              </span>
              <div className="space-y-1.5">
                {SAMPLE_SCORECARD_URLS.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setProofUrl(sample.url)}
                    className="w-full text-left p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-[11px] text-slate-300 flex items-center justify-between transition-colors"
                  >
                    <span>{sample.label}</span>
                    <span className="text-amber-400 font-mono text-[10px]">Select</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Proof Preview Box */}
            {proofUrl && (
              <div className="p-3 rounded-2xl bg-black/50 border border-white/10">
                <span className="text-[10px] text-slate-400 block mb-1 uppercase font-semibold">
                  Screenshot Preview:
                </span>
                <img
                  src={proofUrl}
                  alt="Scorecard Proof"
                  className="w-full h-36 object-cover rounded-xl border border-white/5"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=800&auto=format&fit=crop&q=80';
                  }}
                />
              </div>
            )}

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
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:brightness-110 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" />
                <span>Submit Verification Proof</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
