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
    <section className="py-16 border-t border-white/10 relative" id="charities-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Heart className="w-3.5 h-3.5" /> § 08 Charity Giving Ecosystem
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Give Back. Every Round Makes An Impact.
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed">
            Every subscriber directs at least 10% of their fee to a cause they choose. Browse our verified non-profit partners or make an independent donation.
          </p>
        </div>

        {/* Search & Filter Controls (§ 08.2) */}
        <div className="glass-panel p-4 rounded-2xl mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by charity name, mission, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-all"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white bg-slate-900/40 hover:bg-slate-900/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Charities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredCharities.map((charity) => {
            const isUserRecipient = currentUser.charityId === charity.id;

            return (
              <div
                key={charity.id}
                className={`glass-panel rounded-3xl overflow-hidden flex flex-col justify-between border transition-all ${
                  isUserRecipient 
                    ? 'border-emerald-500/40 shadow-xl shadow-emerald-500/10' 
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <div>
                  {/* Card Cover Image with Category Badge */}
                  <div className="h-48 w-full relative overflow-hidden bg-slate-950">
                    <img
                      src={charity.coverImage}
                      alt={charity.name}
                      className="w-full h-full object-cover opacity-80 hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#090d16] via-[#090d16]/30 to-transparent" />
                    
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-semibold text-white border border-white/10">
                        {charity.category}
                      </span>
                      {charity.isFeatured && (
                        <span className="px-3 py-1 rounded-full bg-amber-500/80 backdrop-blur-md text-[11px] font-bold text-slate-950 flex items-center gap-1 shadow-md">
                          <Sparkles className="w-3 h-3" /> Featured Spotlight
                        </span>
                      )}
                    </div>

                    {/* Logo Overlay */}
                    <div className="absolute bottom-4 left-4 flex items-center gap-3">
                      <img
                        src={charity.logoUrl}
                        alt={charity.name}
                        className="w-12 h-12 rounded-xl object-cover border-2 border-white/20 shadow-lg bg-slate-900"
                      />
                      <div>
                        <h3 className="text-lg font-bold text-white leading-tight drop-shadow-md">
                          {charity.name}
                        </h3>
                        <p className="text-xs text-emerald-400 font-mono font-medium">
                          ${charity.totalRaised.toLocaleString()} Raised to date
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6">
                    <p className="text-xs font-semibold text-slate-300 italic mb-2">
                      "{charity.tagline}"
                    </p>
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                      {charity.description}
                    </p>

                    {/* Upcoming Golf Event (§ 08.2) */}
                    {charity.upcomingEvents.length > 0 && (
                      <div className="mt-4 p-3 rounded-xl bg-slate-900/70 border border-white/5 space-y-1 text-xs">
                        <div className="flex items-center gap-1.5 text-amber-300 font-semibold text-[11px] uppercase tracking-wider">
                          <Calendar className="w-3.5 h-3.5" /> Upcoming Charity Golf Day
                        </div>
                        <div className="text-white font-medium">{charity.upcomingEvents[0].title}</div>
                        <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-emerald-400" /> {charity.upcomingEvents[0].location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Target className="w-3 h-3 text-amber-400" /> Goal: {charity.upcomingEvents[0].goal}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="px-6 py-4 bg-slate-950/60 border-t border-white/5 flex flex-wrap items-center justify-between gap-3">
                  {isUserRecipient ? (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                      <Check className="w-3.5 h-3.5" /> Currently Selected ({currentUser.charityPercentage}%)
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        updateCharityPreference(charity.id, currentUser.charityPercentage || 10);
                        if (onSelectForSubscription) onSelectForSubscription(charity.id);
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 text-xs font-medium transition-all"
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
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-sm transition-all"
                  >
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>Direct Donation</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal: Independent Donation Option (§ 08.1) */}
        {donatingTo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="glass-panel max-w-md w-full p-6 sm:p-8 rounded-3xl border border-white/20 bg-slate-900 shadow-2xl relative">
              <h3 className="text-xl font-bold text-white mb-1">
                Direct Donation to {donatingTo.name}
              </h3>
              <p className="text-xs text-slate-400 mb-6">
                Independent donation not tied to gameplay or subscription. 100% passes directly to the charity foundation.
              </p>

              {donationSuccess ? (
                <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center my-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center mx-auto mb-2 font-bold text-xl">
                    ✓
                  </div>
                  <h4 className="text-base font-bold text-white">Thank You For Your Support!</h4>
                  <p className="text-xs text-emerald-300 mt-1">
                    Your contribution of ${donationAmount} has been delivered.
                  </p>
                </div>
              ) : (
                <>
                  <label className="text-xs font-semibold text-slate-300 block mb-2 uppercase">
                    Select Contribution Amount (USD)
                  </label>
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {[25, 50, 100, 250].map((amt) => (
                      <button
                        key={amt}
                        onClick={() => setDonationAmount(amt)}
                        className={`py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                          donationAmount === amt
                            ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        ${amt}
                      </button>
                    ))}
                  </div>

                  <div className="mb-6">
                    <label className="text-[11px] text-slate-400 block mb-1">Custom Amount</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">$</span>
                      <input
                        type="number"
                        min="5"
                        value={donationAmount}
                        onChange={(e) => setDonationAmount(parseFloat(e.target.value) || 0)}
                        className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setDonatingTo(null)}
                      className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleExecuteDonation}
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:brightness-110 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all"
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
