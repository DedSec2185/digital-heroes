import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SubscriptionPlan } from '../types';
import { 
  X, 
  CreditCard, 
  ShieldCheck, 
  Check, 
  Heart, 
  Sparkles, 
  Lock 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlan?: SubscriptionPlan;
}

export const SubscribeModal: React.FC<SubscribeModalProps> = ({
  isOpen,
  onClose,
  initialPlan = 'monthly',
}) => {
  const { charities, subscribeUser, currentUser } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>(initialPlan);
  const [selectedCharityId, setSelectedCharityId] = useState<string>(
    charities[0]?.id || ''
  );
  const [charityPercentage, setCharityPercentage] = useState<number>(15);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isDone, setIsDone] = useState<boolean>(false);

  // Mock Card fields
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');

  if (!isOpen) return null;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      subscribeUser(selectedPlan, selectedCharityId, charityPercentage);
      setIsProcessing(false);
      setIsDone(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      setTimeout(() => {
        setIsDone(false);
        setStep(1);
        onClose();
      }, 1800);
    }, 1200);
  };

  const selectedCharity = charities.find(c => c.id === selectedCharityId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="glass-panel max-w-lg w-full p-6 sm:p-8 rounded-3xl border border-emerald-500/30 bg-slate-900 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {isDone ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center mx-auto mb-4 font-black text-2xl shadow-xl shadow-emerald-500/30 animate-bounce">
              ✓
            </div>
            <h3 className="text-2xl font-bold text-white">Membership Activated!</h3>
            <p className="text-sm text-slate-300 mt-2">
              Welcome to Digital Heroes. Your ticket has been entered into the next cash championship!
            </p>
            <p className="text-xs text-emerald-400 font-mono mt-2">
              {charityPercentage}% of your subscription is powering {selectedCharity?.name}.
            </p>
          </div>
        ) : (
          <div>
            {/* Steps Indicator */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Step {step} of 3
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  {step === 1 && 'Select Membership Plan'}
                  {step === 2 && 'Designate Charity & Percentage'}
                  {step === 3 && 'Secure Payment Entry'}
                </h3>
              </div>
            </div>

            {/* Step 1: Plan Selection */}
            {step === 1 && (
              <div className="space-y-4">
                <div
                  onClick={() => setSelectedPlan('monthly')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    selectedPlan === 'monthly'
                      ? 'border-emerald-500 bg-emerald-500/10'
                      : 'border-white/10 bg-slate-950/60 hover:border-white/20'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-white text-sm">Monthly Plan</span>
                    <span className="font-mono text-emerald-400 font-bold text-base">$19.99/mo</span>
                  </div>
                  <p className="text-xs text-slate-400">Cancel anytime. 50% directly to monthly prize pools.</p>
                </div>

                <div
                  onClick={() => setSelectedPlan('yearly')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    selectedPlan === 'yearly'
                      ? 'border-amber-400 bg-amber-500/10'
                      : 'border-white/10 bg-slate-950/60 hover:border-white/20'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-white text-sm flex items-center gap-2">
                      Annual Champion
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-bold">25% Off</span>
                    </span>
                    <span className="font-mono text-amber-300 font-bold text-base">$180.00/yr</span>
                  </div>
                  <p className="text-xs text-slate-400">Guaranteed entry into all 12 monthly draws throughout the year.</p>
                </div>

                <button
                  onClick={() => setStep(2)}
                  className="w-full mt-4 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all"
                >
                  Continue to Charity Selection
                </button>
              </div>
            )}

            {/* Step 2: Charity & Contribution Percentage */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-semibold text-slate-300 uppercase block mb-2">
                    Select Your Cause (§ 08.1)
                  </label>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {charities.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => setSelectedCharityId(c.id)}
                        className={`p-3 rounded-xl border cursor-pointer flex items-center gap-3 transition-all ${
                          selectedCharityId === c.id
                            ? 'border-emerald-500 bg-emerald-500/10'
                            : 'border-white/5 bg-slate-950/60 hover:border-white/10'
                        }`}
                      >
                        <img
                          src={c.logoUrl}
                          alt={c.name}
                          className="w-9 h-9 rounded-lg object-cover border border-white/10"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-white truncate">{c.name}</h4>
                          <span className="text-[10px] text-emerald-400 block">{c.category}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Percentage Slider */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-slate-300 uppercase">
                      Charity Contribution %
                    </label>
                    <span className="text-xs font-mono font-bold text-emerald-400">{charityPercentage}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    step="5"
                    value={charityPercentage}
                    onChange={(e) => setCharityPercentage(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                    <span>10% (Min Required)</span>
                    <span>30%</span>
                    <span>50%</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
                  >
                    Proceed to Payment
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Payment Entry */}
            {step === 3 && (
              <form onSubmit={handleCheckout} className="space-y-4">
                <div className="p-4 rounded-2xl bg-black/50 border border-white/10 text-xs space-y-2">
                  <div className="flex justify-between text-slate-300">
                    <span>Selected Plan:</span>
                    <strong className="text-white capitalize">{selectedPlan}</strong>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Recipient Charity:</span>
                    <strong className="text-emerald-400">{selectedCharity?.name}</strong>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Charity Split:</span>
                    <strong className="text-white font-mono">{charityPercentage}%</strong>
                  </div>
                  <div className="border-t border-white/10 pt-2 flex justify-between text-sm font-bold text-white">
                    <span>Total Due Today:</span>
                    <span className="font-mono text-emerald-400">
                      {selectedPlan === 'monthly' ? '$19.99' : '$180.00'}
                    </span>
                  </div>
                </div>

                {/* Mock Card inputs */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 uppercase block mb-1">
                    Card Number (PCI Compliant Mock)
                  </label>
                  <div className="relative">
                    <CreditCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 uppercase block mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      required
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs text-center focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 uppercase block mb-1">
                      CVC / CVV
                    </label>
                    <input
                      type="text"
                      required
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs text-center focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>256-bit encrypted • Stripe-compatible tokenized verification</span>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 hover:brightness-110 flex items-center justify-center gap-2"
                  >
                    <span>{isProcessing ? 'Authorizing...' : `Pay ${selectedPlan === 'monthly' ? '$19.99' : '$180.00'}`}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
