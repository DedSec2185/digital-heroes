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
    <section className="py-20 border-t border-white/10 relative" id="pricing-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Zap className="w-3.5 h-3.5" /> § 04 Membership & Subscription
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            One Membership. Dual Purpose.
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            Participate in monthly five-figure cash draws while automatically funding life-changing charities across the globe.
          </p>

          {/* Monthly / Yearly Switcher */}
          <div className="mt-8 inline-flex items-center p-1.5 rounded-2xl bg-slate-900 border border-white/10">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-5 py-2 rounded-xl text-xs font-semibold transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                billingCycle === 'yearly'
                  ? 'bg-gradient-to-r from-emerald-500 to-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Annual Plan</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-amber-400/30 text-amber-900 font-black">
                Save 25%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Card 1: Monthly Membership */}
          <div className={`glass-panel p-8 rounded-3xl flex flex-col justify-between border transition-all ${
            billingCycle === 'monthly'
              ? 'border-emerald-500/40 shadow-xl shadow-emerald-500/10 bg-slate-900/80'
              : 'border-white/10 opacity-80'
          }`}>
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-800 text-slate-300">
                  Monthly Freedom
                </span>
                <span className="text-xs text-slate-400">Cancel anytime</span>
              </div>

              <div className="flex items-baseline gap-1 my-4">
                <span className="text-4xl sm:text-5xl font-extrabold font-mono text-white">$19.99</span>
                <span className="text-slate-400 text-sm font-medium">/ month</span>
              </div>

              <p className="text-xs text-slate-400 mb-6">
                Full access to golf score logging, monthly draw tickets, and custom charity allocation.
              </p>

              {/* Fund Allocation Breakdown (§ 04, § 07, § 08) */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2.5 mb-6 text-xs">
                <div className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Transparent Revenue Split:
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" /> Guaranteed Prize Pool:
                  </span>
                  <span className="font-mono text-amber-400 font-bold">$10.00 (50%)</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-emerald-400" /> Your Chosen Charity:
                  </span>
                  <span className="font-mono text-emerald-400 font-bold">Min $2.00 (10%+)</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Platform Operations & Audits:</span>
                  <span className="font-mono">$7.99</span>
                </div>
              </div>

              {/* Feature Checklist */}
              <ul className="space-y-3 text-xs text-slate-300 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>5-score rolling Stableford tracker with date verification</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>1 Automated Draw Ticket per monthly championship</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Eligible for 5-Match Jackpot with rollover payouts</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Official winner scorecard verification portal</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onSelectPlan('monthly')}
              className={`w-full py-3.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                subscription?.plan === 'monthly' && subscription.status === 'active'
                  ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20'
              }`}
            >
              <span>{subscription?.plan === 'monthly' && subscription.status === 'active' ? 'Active Membership' : 'Select Monthly Plan'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: Annual Champion Plan */}
          <div className={`glass-panel p-8 rounded-3xl flex flex-col justify-between border relative overflow-hidden transition-all ${
            billingCycle === 'yearly'
              ? 'border-amber-500/50 shadow-2xl shadow-amber-500/10 bg-gradient-to-b from-amber-500/10 via-slate-900 to-slate-950'
              : 'border-white/10 opacity-80'
          }`}>
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-md">
                Best Value
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  Annual Champion
                </span>
              </div>

              <div className="flex items-baseline gap-1 my-4">
                <span className="text-4xl sm:text-5xl font-extrabold font-mono text-white">$180.00</span>
                <span className="text-slate-400 text-sm font-medium">/ year ($15/mo)</span>
              </div>

              <p className="text-xs text-slate-400 mb-6">
                Year-round entry into 12 consecutive monthly cash draws and maximized long-term charity contribution.
              </p>

              {/* Fund Allocation Breakdown */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2.5 mb-6 text-xs">
                <div className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider mb-1">
                  Transparent Revenue Split:
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" /> Guaranteed Prize Pool:
                  </span>
                  <span className="font-mono text-amber-400 font-bold">$90.00 (50%)</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-emerald-400" /> Your Chosen Charity:
                  </span>
                  <span className="font-mono text-emerald-400 font-bold">Min $18.00 (10%+)</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Platform Operations & Audits:</span>
                  <span className="font-mono">$72.00</span>
                </div>
              </div>

              {/* Feature Checklist */}
              <ul className="space-y-3 text-xs text-slate-300 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Guaranteed entry into all 12 monthly draws throughout the year</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>VIP Invitation to annual charity Pro-Am and golf open days</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Automatic rollover inclusion for all unclaimed jackpots</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Expedited priority payout verification for winning rounds</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onSelectPlan('yearly')}
              className={`w-full py-3.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                subscription?.plan === 'yearly' && subscription.status === 'active'
                  ? 'bg-slate-800 text-amber-400 border border-amber-500/30'
                  : 'bg-gradient-to-r from-amber-400 to-yellow-500 hover:brightness-110 text-slate-950 shadow-lg shadow-amber-500/25'
              }`}
            >
              <span>{subscription?.plan === 'yearly' && subscription.status === 'active' ? 'Active Membership' : 'Select Annual Plan (25% Off)'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
