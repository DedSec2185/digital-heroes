import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Charity, CharityCategory } from '../types';
import { CharityEngine } from '../lib/charityEngine';
import { 
  Heart, 
  Search, 
  Calendar, 
  MapPin, 
  Target, 
  ExternalLink, 
  Check, 
  Sliders, 
  Sparkles,
  DollarSign
} from 'lucide-react';
import confetti from 'canvas-confetti';

const CATEGORIES: ('All' | CharityCategory)[] = [
  'All',
  'Youth & Education',
  'Health & Research',
  'Environment & Conservation',
  'Veterans & First Responders',
  'Community & Hunger'
];

interface CharityDirectorySectionProps {
  onSelectForSubscription?: (charityId: string) => void;
}

export const CharityDirectorySection: React.FC<CharityDirectorySectionProps> = ({
  onSelectForSubscription
}) => {
  const { charities, currentUser, updateCharityPreference } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Independent Donation Modal state (§ 08.1)
  const [donatingTo, setDonatingTo] = useState<Charity | null>(null);
  const [donationAmount, setDonationAmount] = useState<number>(50);
  const [donationSuccess, setDonationSuccess] = useState<boolean>(false);

  const filteredCharities = CharityEngine.filterCharities(charities, searchQuery, selectedCategory);

  const handleExecuteDonation = () => {
    if (!donatingTo || donationAmount <= 0) return;
    donatingTo.totalRaised += donationAmount;
    setDonationSuccess(true);
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 }
    });
    setTimeout(() => {
      setDonationSuccess(false);
      setDonatingTo(null);
    }, 2000);
  };

  return (
    <section className="py-20 border-t border-white/10 relative" id="charities-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-bold uppercase tracking-wider mb-4 shadow-sm">
            <Heart className="w-4 h-4" /> § 08 Verified Charity Ecosystem
          </div>
          <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-none">
            Every Swing Funds <span className="text-emerald-400">Real Impact.</span>
          </h2>
          <p className="mt-4 text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Direct at least 10% of your subscription to a vetted foundation. Transparent financial allocation with 100% auditability.
          </p>
        </div>

        {/* Search & Filter Controls (§ 08.2) */}
        <div className="glass-panel p-5 sm:p-6 rounded-3xl mb-12 flex flex-col md:flex-row items-center justify-between gap-5 border border-white/15 bg-slate-950/80 shadow-2xl">
          {/* Search Input */}
          <div className="relative w-full md:w-[420px]">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search charities by mission, title, or cause..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-900 border border-white/15 text-white text-sm placeholder-slate-400 focus:outline-none focus:border-emerald-400 transition-all font-medium"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/25 scale-105'
                    : 'text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Charities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {filteredCharities.map((charity) => {
            const isUserRecipient = currentUser.charityId === charity.id;

            return (
              <div
                key={charity.id}
                className={`glass-panel rounded-3xl overflow-hidden flex flex-col justify-between border-2 transition-all duration-300 hover:scale-[1.01] ${
                  isUserRecipient 
                    ? 'border-emerald-400/80 bg-[#0a1520] shadow-2xl shadow-emerald-500/20' 
                    : 'border-white/15 bg-slate-950/90 hover:border-white/30'
                }`}
              >
                <div>
                  {/* Card Cover Image with Category Badge */}
                  <div className="h-56 w-full relative overflow-hidden bg-slate-950">
                    <img
                      src={charity.coverImage}
                      alt={charity.name}
                      className="w-full h-full object-cover opacity-85 hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#090d16] via-[#090d16]/40 to-transparent" />
                    
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span className="px-3.5 py-1.5 rounded-full bg-black/80 backdrop-blur-md text-xs font-bold text-white border border-white/20">
                        {charity.category}
                      </span>
                      {charity.isFeatured && (
                        <span className="px-3.5 py-1.5 rounded-full bg-amber-400 backdrop-blur-md text-xs font-black text-slate-950 flex items-center gap-1 shadow-lg">
                          <Sparkles className="w-3.5 h-3.5" /> Featured Spotlight
                        </span>
                      )}
                    </div>

                    {/* Logo Overlay */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-center gap-4">
                      <img
                        src={charity.logoUrl}
                        alt={charity.name}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-white/30 shadow-2xl bg-slate-900 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="text-xl sm:text-2xl font-black text-white leading-tight drop-shadow-md truncate">
                          {charity.name}
                        </h3>
                        <p className="text-sm text-emerald-400 font-mono font-bold mt-0.5">
                          ${charity.totalRaised.toLocaleString()} Raised to date
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-7 space-y-4">
                    <p className="text-sm font-bold text-slate-200 italic">
                      "{charity.tagline}"
                    </p>
                    <p className="text-sm text-slate-300 leading-relaxed line-clamp-3 font-normal">
                      {charity.description}
                    </p>

                    {/* Upcoming Golf Event (§ 08.2) */}
                    {charity.upcomingEvents.length > 0 && (
                      <div className="mt-4 p-4 rounded-2xl bg-slate-900/90 border border-white/10 space-y-2 text-xs sm:text-sm">
                        <div className="flex items-center gap-2 text-amber-300 font-bold uppercase tracking-wider text-xs">
                          <Calendar className="w-4 h-4" /> Upcoming Charity Golf Day
                        </div>
                        <div className="text-white font-bold text-sm">{charity.upcomingEvents[0].title}</div>
                        <div className="flex flex-wrap items-center gap-4 text-slate-300 text-xs">
                          <span className="flex items-center gap-1.5 font-medium">
                            <MapPin className="w-3.5 h-3.5 text-emerald-400" /> {charity.upcomingEvents[0].location}
                          </span>
                          <span className="flex items-center gap-1.5 font-medium">
                            <Target className="w-3.5 h-3.5 text-amber-400" /> Goal: {charity.upcomingEvents[0].goal}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="px-7 py-5 bg-slate-950/80 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                  {isUserRecipient ? (
                    <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-xs sm:text-sm font-bold">
                      <Check className="w-4 h-4 text-emerald-400" /> Active Recipient ({currentUser.charityPercentage}%)
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        updateCharityPreference(charity.id, currentUser.charityPercentage || 10);
                        if (onSelectForSubscription) onSelectForSubscription(charity.id);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-500/20 text-slate-200 hover:text-emerald-300 border border-white/15 text-xs sm:text-sm font-bold transition-all hover:scale-105"
                    >
                      Set As My Recipient
                    </button>
                  )}

                  {/* Independent One-time Donation Button (§ 08.1) */}
                  <button
                    onClick={() => {
                      setDonatingTo(charity);
                      setDonationAmount(50);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:brightness-110 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95"
                  >
                    <DollarSign className="w-4 h-4" />
                    <span>Direct Donation</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal: Independent Donation Option (§ 08.1) */}
        {donatingTo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
            <div className="glass-panel max-w-lg w-full p-8 rounded-3xl border-2 border-emerald-500/40 bg-slate-950 shadow-2xl relative">
              <h3 className="text-2xl font-black text-white mb-2">
                Direct Donation to {donatingTo.name}
              </h3>
              <p className="text-sm text-slate-300 mb-6 leading-relaxed">
                Independent donation not tied to gameplay or subscription. 100% passes directly to the charity foundation.
              </p>

              {donationSuccess ? (
                <div className="p-8 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/40 text-center my-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center mx-auto mb-4 font-black text-2xl shadow-xl shadow-emerald-500/40">
                    ✓
                  </div>
                  <h4 className="text-xl font-black text-white">Thank You For Your Support!</h4>
                  <p className="text-sm text-emerald-300 mt-2 font-medium">
                    Your contribution of ${donationAmount} has been delivered.
                  </p>
                </div>
              ) : (
                <>
                  <label className="text-xs font-bold text-slate-300 block mb-3 uppercase tracking-wider">
                    Select Contribution Amount (USD)
                  </label>
                  <div className="grid grid-cols-4 gap-3 mb-6">
                    {[25, 50, 100, 250].map((amt) => (
                      <button
                        key={amt}
                        onClick={() => setDonationAmount(amt)}
                        className={`py-3 rounded-2xl text-sm font-mono font-black transition-all ${
                          donationAmount === amt
                            ? 'bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/40 scale-105'
                            : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-white/10'
                        }`}
                      >
                        ${amt}
                      </button>
                    ))}
                  </div>

                  <div className="mb-8">
                    <label className="text-xs text-slate-400 block mb-2 font-medium">Custom Amount</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-base font-bold">$</span>
                      <input
                        type="number"
                        min="5"
                        value={donationAmount}
                        onChange={(e) => setDonationAmount(parseFloat(e.target.value) || 0)}
                        className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-slate-900 border border-slate-700 text-white font-mono text-base font-bold focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setDonatingTo(null)}
                      className="flex-1 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 text-sm font-bold transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleExecuteDonation}
                      className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-400 hover:brightness-110 text-slate-950 text-sm font-black shadow-xl shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95"
                    >
                      Donate ${donationAmount}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
