import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SubscriptionPlan } from '../types';
import { 
  Check, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Heart, 
  Trophy,
  Zap
} from 'lucide-react';

interface PricingSectionProps {
  onSelectPlan: (plan: SubscriptionPlan) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onSelectPlan }) => {
  const { subscription } = useApp();
  const [billingCycle, setBillingCycle] = useState<SubscriptionPlan>('monthly');

  return (
    <section className="py-24 border-t border-white/10 relative" id="pricing-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs sm:text-sm font-bold uppercase tracking-wider mb-4 shadow-sm">
            <Zap className="w-4 h-4" /> § 04 Membership & Subscription Architecture
          </div>
          <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-none">
            One Membership. <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-400">Dual Purpose.</span>
          </h2>
          <p className="mt-4 text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Participate in monthly five-figure cash draws while automatically funding life-changing charities across the globe.
          </p>

          {/* Monthly / Yearly Switcher */}
          <div className="mt-10 inline-flex items-center p-2 rounded-2xl bg-slate-900 border-2 border-white/15 shadow-2xl">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-3 rounded-xl text-sm font-black transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-emerald-400 text-slate-950 shadow-xl shadow-emerald-500/30 scale-105'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-3 rounded-xl text-sm font-black transition-all flex items-center gap-2 ${
                billingCycle === 'yearly'
                  ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 shadow-xl shadow-amber-500/30 scale-105'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <span>Annual Plan</span>
              <span className="text-[11px] uppercase font-mono px-2 py-0.5 rounded-md bg-black/40 text-slate-950 font-black">
                Save 25%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 max-w-5xl mx-auto">
          {/* Card 1: Monthly Membership */}
          <div className={`glass-panel p-8 sm:p-10 rounded-3xl flex flex-col justify-between border-2 transition-all duration-300 ${
            billingCycle === 'monthly'
              ? 'border-emerald-400 bg-gradient-to-b from-slate-950 via-[#0a1520] to-slate-950 shadow-2xl shadow-emerald-500/20 scale-[1.02]'
              : 'border-white/15 bg-slate-950/80 opacity-85 hover:opacity-100'
          }`}>
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-slate-900 text-slate-200 border border-white/10">
                  Monthly Freedom
                </span>
                <span className="text-xs text-slate-400 font-mono">Cancel anytime</span>
              </div>

              <div className="flex items-baseline gap-2 my-5">
                <span className="text-5xl sm:text-6xl font-black font-mono text-white">$19.99</span>
                <span className="text-slate-400 text-base font-semibold">/ month</span>
              </div>

              <p className="text-sm text-slate-300 mb-8 leading-relaxed font-medium">
                Full access to golf score logging, automated monthly draw ticket generation, and customizable charity allocation.
              </p>

              {/* Fund Allocation Breakdown (§ 04, § 07, § 08) */}
              <div className="p-5 rounded-2xl bg-black/60 border border-white/10 space-y-3 mb-8 text-xs sm:text-sm">
                <div className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                  Transparent Revenue Split:
                </div>
                <div className="flex justify-between items-center text-slate-200">
                  <span className="flex items-center gap-2 font-medium">
                    <Trophy className="w-4 h-4 text-amber-400" /> Guaranteed Prize Pool:
                  </span>
                  <span className="font-mono text-amber-400 font-black">$10.00 (50%)</span>
                </div>
                <div className="flex justify-between items-center text-slate-200">
                  <span className="flex items-center gap-2 font-medium">
                    <Heart className="w-4 h-4 text-emerald-400" /> Your Chosen Charity:
                  </span>
                  <span className="font-mono text-emerald-400 font-black">Min $2.00 (10%+)</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Platform Operations & Audits:</span>
                  <span className="font-mono font-bold">$7.99</span>
                </div>
              </div>

              {/* Feature Checklist */}
              <ul className="space-y-3.5 text-xs sm:text-sm text-slate-200 mb-10">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>5-score rolling Stableford tracker with FIFO queue</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>1 Automated Draw Ticket per monthly championship</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Eligible for 5-Match Jackpot with rollover pool</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Official AI winner scorecard verification portal</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onSelectPlan('monthly')}
              className={`w-full py-4 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-xl hover:scale-105 active:scale-95 ${
                subscription?.plan === 'monthly' && subscription.status === 'active'
                  ? 'bg-slate-900 text-emerald-400 border-2 border-emerald-400/50 shadow-emerald-500/10'
                  : 'bg-gradient-to-r from-emerald-400 to-teal-400 hover:brightness-110 text-slate-950 shadow-emerald-500/30'
              }`}
            >
              <span>{subscription?.plan === 'monthly' && subscription.status === 'active' ? 'Active Membership' : 'Select Monthly Plan'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Card 2: Annual Champion Plan */}
          <div className={`glass-panel p-8 sm:p-10 rounded-3xl flex flex-col justify-between border-2 relative overflow-hidden transition-all duration-300 ${
            billingCycle === 'yearly'
              ? 'border-amber-400 bg-gradient-to-b from-amber-500/15 via-[#14121a] to-slate-950 shadow-2xl shadow-amber-500/25 scale-[1.02]'
              : 'border-white/15 bg-slate-950/80 opacity-85 hover:opacity-100'
          }`}>
            <div className="absolute top-6 right-6">
              <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 text-xs font-black uppercase tracking-wider shadow-lg">
                Best Value
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40">
                  Annual Champion
                </span>
              </div>

              <div className="flex items-baseline gap-2 my-5">
                <span className="text-5xl sm:text-6xl font-black font-mono text-white">$180.00</span>
                <span className="text-amber-300 text-base font-bold">/ year ($15/mo)</span>
              </div>

              <p className="text-sm text-slate-300 mb-8 leading-relaxed font-medium">
                Year-round entry into 12 consecutive monthly cash draws and maximized long-term charity foundation contribution.
              </p>

              {/* Fund Allocation Breakdown */}
              <div className="p-5 rounded-2xl bg-black/60 border border-white/10 space-y-3 mb-8 text-xs sm:text-sm">
                <div className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
                  Transparent Revenue Split:
                </div>
                <div className="flex justify-between items-center text-slate-200">
                  <span className="flex items-center gap-2 font-medium">
                    <Trophy className="w-4 h-4 text-amber-400" /> Guaranteed Prize Pool:
                  </span>
                  <span className="font-mono text-amber-400 font-black">$90.00 (50%)</span>
                </div>
                <div className="flex justify-between items-center text-slate-200">
                  <span className="flex items-center gap-2 font-medium">
                    <Heart className="w-4 h-4 text-emerald-400" /> Your Chosen Charity:
                  </span>
                  <span className="font-mono text-emerald-400 font-black">Min $18.00 (10%+)</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Platform Operations & Audits:</span>
                  <span className="font-mono font-bold">$72.00</span>
                </div>
              </div>

              {/* Feature Checklist */}
              <ul className="space-y-3.5 text-xs sm:text-sm text-slate-200 mb-10">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-amber-400 shrink-0" />
                  <span>Guaranteed entry into all 12 monthly draws throughout the year</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-amber-400 shrink-0" />
                  <span>VIP Invitation to annual charity Pro-Am and golf open days</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-amber-400 shrink-0" />
                  <span>Automatic rollover inclusion for all unclaimed jackpots</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-amber-400 shrink-0" />
                  <span>Expedited priority payout verification for winning rounds</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onSelectPlan('yearly')}
              className={`w-full py-4 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-xl hover:scale-105 active:scale-95 ${
                subscription?.plan === 'yearly' && subscription.status === 'active'
                  ? 'bg-slate-900 text-amber-400 border-2 border-amber-400/50 shadow-amber-500/10'
                  : 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:brightness-110 text-slate-950 shadow-amber-500/30'
              }`}
            >
              <span>{subscription?.plan === 'yearly' && subscription.status === 'active' ? 'Active Membership' : 'Select Annual Plan (Save 25%)'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
