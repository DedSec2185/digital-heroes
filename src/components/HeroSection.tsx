import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Trophy, 
  Heart, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  Users, 
  Calendar,
  CheckCircle2
} from 'lucide-react';

interface HeroSectionProps {
  onSubscribeClick: () => void;
  onExploreCharities: () => void;
  onEnterScores: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSubscribeClick,
  onExploreCharities,
  onEnterScores,
}) => {
  const { activeDraw, charities, subscription } = useApp();

  const totalCharityRaised = charities.reduce((sum, c) => sum + c.totalRaised, 0);

  return (
    <section className="relative pt-12 pb-20 overflow-hidden">
      {/* Background Gradients & Glow Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-500/10 via-amber-500/5 to-transparent blur-3xl -z-10 pointer-events-none" />
      <div className="absolute -top-24 right-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl -z-10" />
      <div className="absolute top-48 left-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Pill Tagline */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-900/60 to-slate-900 border border-emerald-500/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Modern Golf Performance & Charity Draw Platform</span>
          </div>
        </div>

        {/* Hero Title */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
            Play With Passion. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">
              Give With Purpose.
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Turn your weekend golf scores into guaranteed charitable funding and win your share of monthly five-figure prize pools. No fairways or plaid clichés — just pure impact.
          </p>

          {/* Action CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            {subscription?.status === 'active' ? (
              <button
                onClick={onEnterScores}
                className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-sm hover:brightness-110 shadow-lg shadow-emerald-500/25 flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Enter Your 5 Scores</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onSubscribeClick}
                className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-amber-400 text-slate-950 font-bold text-sm hover:brightness-110 shadow-lg shadow-emerald-500/25 flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Subscribe & Join Monthly Draw</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onExploreCharities}
              className="px-6 py-3.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold text-sm backdrop-blur-md flex items-center gap-2 transition-all"
            >
              <Heart className="w-4 h-4 text-emerald-400" />
              <span>Explore Listed Causes</span>
            </button>
          </div>
        </div>

        {/* Live Platform Telemetry Bar */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {/* Metric 1: Charity Impact */}
          <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Charity Impact</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <Heart className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold font-mono text-white">
                ${totalCharityRaised.toLocaleString('en-US')}
              </span>
              <span className="text-xs text-emerald-400 font-medium">100% Verified</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">Distributed directly to verified grassroots partners</p>
          </div>

          {/* Metric 2: Live Prize Pool */}
          <div className="glass-panel p-5 rounded-2xl relative overflow-hidden border-amber-500/20 bg-gradient-to-b from-amber-500/5 to-transparent">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider">Next Prize Pool</span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <Trophy className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold font-mono text-amber-400">
                ${(activeDraw?.totalPrizePool || 35000).toLocaleString('en-US')}
              </span>
              {(activeDraw?.rolloverJackpot || 0) > 0 && (
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  +${(activeDraw?.rolloverJackpot || 0).toLocaleString()} Rollover
                </span>
              )}
            </div>
            <p className="mt-1 text-[11px] text-slate-400">5-Match Jackpot: ${(activeDraw?.jackpotPool || 20000).toLocaleString()}</p>
          </div>

          {/* Metric 3: Active Subscribers */}
          <div className="glass-panel p-5 rounded-2xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Subscribers</span>
              <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold font-mono text-white">
                {(activeDraw?.totalParticipants || 1620).toLocaleString()}
              </span>
              <span className="text-xs text-teal-400 font-medium">Live Members</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">Entering rolling Stableford scores weekly</p>
          </div>
        </div>

        {/* The 3-Step Mechanics (§ 01.1) */}
        <div className="mt-20 border-t border-white/10 pt-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              How the Digital Heroes Loop Works
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Three seamless pillars combining competitive play, automated lottery mechanics, and social goodwill.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="glass-panel p-6 rounded-2xl hover:border-emerald-500/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-mono font-bold text-base mb-4">
                01
              </div>
              <h3 className="text-lg font-bold text-white">Log Your Stableford Scores</h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                Enter your last 5 golf scores (range 1–45) with dates. Our rolling engine automatically holds only your freshest 5 rounds, retiring older games seamlessly.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" /> Strictly 1 score per date verified
              </div>
            </div>

            {/* Step 2 */}
            <div className="glass-panel p-6 rounded-2xl hover:border-amber-500/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-mono font-bold text-base mb-4">
                02
              </div>
              <h3 className="text-lg font-bold text-white">Direct 10%+ To A Chosen Cause</h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                Choose from vetted charitable foundations in Youth, Health, Ocean cleanup, and Veterans. Minimum 10% of every subscription goes directly to your selected charity.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs text-amber-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" /> Customize percentage anytime
              </div>
            </div>

            {/* Step 3 */}
            <div className="glass-panel p-6 rounded-2xl hover:border-teal-500/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 font-mono font-bold text-base mb-4">
                03
              </div>
              <h3 className="text-lg font-bold text-white">Win Monthly Cash Pools</h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                Your 5 numbers are entered into the monthly draw. Match 3, 4, or all 5 numbers to win tier prizes. If the 5-match jackpot is unclaimed, it rolls over to the next month!
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs text-teal-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" /> 40% / 35% / 25% transparent splits
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
