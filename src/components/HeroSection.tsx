import React, { useState } from 'react';
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
  CheckCircle2,
  Zap,
  Flame
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
    <section className="relative pt-16 pb-28 overflow-hidden">
      {/* Background Radiant Glow Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-emerald-500/15 via-teal-500/10 to-transparent blur-3xl -z-10 pointer-events-none" />
      <div className="absolute -top-32 right-12 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl -z-10 animate-float" />
      <div className="absolute top-64 -left-12 w-[450px] h-[450px] bg-amber-500/15 rounded-full blur-3xl -z-10 animate-float-reverse" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Pill Tagline */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-gradient-to-r from-emerald-950/80 via-slate-900 to-amber-950/80 border-2 border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-bold uppercase tracking-widest shadow-xl shadow-emerald-950/40">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Modern Golf Performance & Monthly Charity Draw</span>
          </div>
        </div>

        {/* Hero Title - Massive Editorial Typography */}
        <div className="text-center max-w-5xl mx-auto">
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white leading-[1.04]">
            Play With Passion. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 text-glow-emerald">
              Give With Purpose.
            </span>
          </h1>
          <p className="mt-8 text-lg sm:text-2xl text-slate-200 max-w-3xl mx-auto leading-relaxed font-normal">
            Turn your weekend golf scores into guaranteed charitable funding and win your share of monthly five-figure prize pools. No fairways or plaid clichés — just pure impact.
          </p>

          {/* Action CTAs with High-Contrast Sizing */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-5">
            {subscription?.status === 'active' ? (
              <button
                onClick={onEnterScores}
                className="px-9 py-4.5 rounded-2xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400 text-slate-950 font-black text-base sm:text-lg hover:brightness-110 shadow-2xl shadow-emerald-500/40 flex items-center gap-3 transition-all hover:scale-105 active:scale-95 group"
              >
                <span>Enter Your 5 Scores</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <button
                onClick={onSubscribeClick}
                className="px-9 py-4.5 rounded-2xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-amber-400 text-slate-950 font-black text-base sm:text-lg hover:brightness-110 shadow-2xl shadow-emerald-500/40 flex items-center gap-3 transition-all hover:scale-105 active:scale-95 group"
              >
                <Zap className="w-5 h-5 fill-slate-950" />
                <span>Subscribe & Join Monthly Draw</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            )}

            <button
              onClick={onExploreCharities}
              className="px-8 py-4.5 rounded-2xl bg-slate-900/90 border-2 border-white/20 hover:border-emerald-500/50 hover:bg-slate-800 text-white font-bold text-base sm:text-lg backdrop-blur-xl flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95 shadow-xl"
            >
              <Heart className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
              <span>Explore Listed Causes</span>
            </button>
          </div>
        </div>

        {/* Live Platform Telemetry Bar with High-Impact Metrics */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Metric 1: Charity Impact */}
          <div className="glass-panel p-7 rounded-3xl relative overflow-hidden group hover:border-emerald-500/40 transition-all hover:-translate-y-1.5 shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-bold text-slate-300 uppercase tracking-widest">Total Charity Impact</span>
              <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Heart className="w-5 h-5 fill-emerald-400/20" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2.5">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-black font-mono text-white tracking-tight">
                ${totalCharityRaised.toLocaleString('en-US')}
              </span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
                100% Verified
              </span>
            </div>
            <p className="mt-2 text-xs sm:text-sm text-slate-300">Distributed directly to verified grassroots partners</p>
          </div>

          {/* Metric 2: Live Prize Pool */}
          <div className="glass-panel p-7 rounded-3xl relative overflow-hidden border-amber-500/40 bg-gradient-to-b from-amber-500/10 via-slate-900/90 to-slate-950/90 group hover:border-amber-400 transition-all hover:-translate-y-1.5 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-bold text-amber-300 uppercase tracking-widest">Next Prize Pool</span>
                <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
              </div>
              <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Trophy className="w-5 h-5 fill-amber-400/20" />
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-baseline gap-2.5">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-black font-mono text-amber-400 tracking-tight text-glow-amber">
                ${(activeDraw?.totalPrizePool || 35000).toLocaleString('en-US')}
              </span>
              {(activeDraw?.rolloverJackpot || 0) > 0 && (
                <span className="text-[11px] uppercase font-mono font-bold px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40">
                  +${(activeDraw?.rolloverJackpot || 0).toLocaleString()} Rollover
                </span>
              )}
            </div>
            <p className="mt-2 text-xs sm:text-sm text-amber-200/90">5-Match Jackpot: ${(activeDraw?.jackpotPool || 20000).toLocaleString()}</p>
          </div>

          {/* Metric 3: Active Subscribers */}
          <div className="glass-panel p-7 rounded-3xl relative overflow-hidden group hover:border-teal-500/40 transition-all hover:-translate-y-1.5 shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-bold text-slate-300 uppercase tracking-widest">Active Subscribers</span>
              <div className="p-2.5 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
                <Users className="w-5 h-5 fill-teal-400/20" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2.5">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-black font-mono text-white tracking-tight">
                {(activeDraw?.totalParticipants || 1620).toLocaleString()}
              </span>
              <span className="text-xs font-bold text-teal-300 bg-teal-950/80 px-2 py-0.5 rounded-full border border-teal-500/30">
                Live Members
              </span>
            </div>
            <p className="mt-2 text-xs sm:text-sm text-slate-300">Entering rolling Stableford scores weekly</p>
          </div>
        </div>

        {/* The 3-Step Mechanics (§ 01.1) */}
        <div className="mt-24 border-t border-white/15 pt-20">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              How the Digital Heroes Loop Works
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-300">
              Three seamless pillars combining competitive play, automated lottery mechanics, and social goodwill.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="glass-panel p-8 rounded-3xl hover:border-emerald-500/40 transition-all hover:-translate-y-2 group shadow-2xl">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center text-emerald-400 font-mono font-black text-xl mb-6 shadow-lg shadow-emerald-500/10">
                01
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">Log Your Stableford Scores</h3>
              <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
                Enter your last 5 golf scores (range 1–45) with dates. Our rolling engine automatically holds only your freshest 5 rounds, retiring older games seamlessly.
              </p>
              <div className="mt-6 flex items-center gap-2 text-xs sm:text-sm text-emerald-400 font-semibold bg-emerald-950/40 p-3 rounded-xl border border-emerald-500/20">
                <CheckCircle2 className="w-4 h-4 shrink-0" /> Strictly 1 score per date verified
              </div>
            </div>

            {/* Step 2 */}
            <div className="glass-panel p-8 rounded-3xl hover:border-amber-500/40 transition-all hover:-translate-y-2 group shadow-2xl">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border-2 border-amber-500/40 flex items-center justify-center text-amber-400 font-mono font-black text-xl mb-6 shadow-lg shadow-amber-500/10">
                02
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">Direct 10%+ To A Cause</h3>
              <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
                Choose from vetted charitable foundations in Youth, Health, Ocean cleanup, and Veterans. Minimum 10% of every subscription goes directly to your selected charity.
              </p>
              <div className="mt-6 flex items-center gap-2 text-xs sm:text-sm text-amber-400 font-semibold bg-amber-950/40 p-3 rounded-xl border border-amber-500/20">
                <CheckCircle2 className="w-4 h-4 shrink-0" /> Customize percentage anytime
              </div>
            </div>

            {/* Step 3 */}
            <div className="glass-panel p-8 rounded-3xl hover:border-teal-500/40 transition-all hover:-translate-y-2 group shadow-2xl">
              <div className="w-14 h-14 rounded-2xl bg-teal-500/20 border-2 border-teal-500/40 flex items-center justify-center text-teal-400 font-mono font-black text-xl mb-6 shadow-lg shadow-teal-500/10">
                03
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">Win Monthly Cash Pools</h3>
              <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
                Your 5 numbers are entered into the monthly draw. Match 3, 4, or all 5 numbers to win tier prizes. If the 5-match jackpot is unclaimed, it rolls over to the next month!
              </p>
              <div className="mt-6 flex items-center gap-2 text-xs sm:text-sm text-teal-400 font-semibold bg-teal-950/40 p-3 rounded-xl border border-teal-500/20">
                <CheckCircle2 className="w-4 h-4 shrink-0" /> 40% / 35% / 25% transparent splits
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
