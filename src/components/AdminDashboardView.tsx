import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Charity, DrawLogicType, DrawSimulation, GolfScore, WinnerVerification } from '../types';
import { DrawEngine } from '../lib/drawEngine';
import { MonteCarloModal } from './MonteCarloModal';
import { ScorecardScannerModal } from './ScorecardScannerModal';
import { sounds } from '../lib/audioEffects';
import { 
  Users, 
  Trophy, 
  Heart, 
  CheckSquare, 
  BarChart3, 
  Settings, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  ExternalLink, 
  RotateCcw, 
  Sparkles, 
  AlertTriangle,
  Play,
  ArrowRight,
  Activity,
  Scan
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AdminDashboardView: React.FC = () => {
  const { 
    allUsers, 
    allScores, 
    charities, 
    draws, 
    activeDraw, 
    verifications,
    runDrawSimulation,
    publishOfficialDraw,
    reviewWinnerProof,
    markPayoutCompleted,
    addCharity,
    updateCharity,
    deleteCharity,
    adminOverrideScores,
    adminToggleUserSubscription,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'users' | 'draws' | 'charities' | 'winners' | 'reports'>('draws');

  // Draw Management State (§ 11.2)
  const [selectedLogic, setSelectedLogic] = useState<DrawLogicType>('random');
  const [activeSimulation, setActiveSimulation] = useState<DrawSimulation | null>(null);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [publishSuccessMsg, setPublishSuccessMsg] = useState<string | null>(null);

  // Charity Form State (§ 11.3)
  const [isAddingCharity, setIsAddingCharity] = useState<boolean>(false);
  const [newCharityName, setNewCharityName] = useState('');
  const [newCharityTagline, setNewCharityTagline] = useState('');
  const [newCharityCategory, setNewCharityCategory] = useState<any>('Youth & Education');
  const [newCharityDesc, setNewCharityDesc] = useState('');
  const [newCharityLogo, setNewCharityLogo] = useState('');
  const [newCharityCover, setNewCharityCover] = useState('');

  // Selected Proof for modal inspection (§ 11.4)
  const [inspectingVerification, setInspectingVerification] = useState<WinnerVerification | null>(null);
  const [scannerVerification, setScannerVerification] = useState<WinnerVerification | null>(null);
  const [isMonteCarloOpen, setIsMonteCarloOpen] = useState<boolean>(false);
  const [adminNote, setAdminNote] = useState('');

  // 1. Run Simulation Handler
  const handleRunSimulation = () => {
    sounds.playBallTumble();
    const sim = runDrawSimulation(selectedLogic);
    setActiveSimulation(sim);
    sounds.playBallReveal(3);
  };

  // 2. Publish Official Draw Handler
  const handlePublishDraw = () => {
    if (!activeSimulation) return;
    setIsPublishing(true);

    setTimeout(() => {
      const res = publishOfficialDraw(activeSimulation.drawnNumbers, selectedLogic);
      setIsPublishing(false);
      if (res.success) {
        setPublishSuccessMsg(`Draw successfully published! ${res.winnersCount} winning entries generated for audit.`);
        setActiveSimulation(null);
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.5 }
        });
      }
    }, 1000);
  };

  // 3. Add Charity Handler
  const handleCreateCharity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCharityName.trim()) return;

    addCharity({
      name: newCharityName,
      tagline: newCharityTagline || 'Making a positive difference in our world',
      description: newCharityDesc || 'Charity organization dedicated to impactful causes.',
      category: newCharityCategory,
      logoUrl: newCharityLogo || 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=160',
      coverImage: newCharityCover || 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800',
      isFeatured: false,
      upcomingEvents: [],
    });

    setIsAddingCharity(false);
    setNewCharityName('');
    setNewCharityTagline('');
    setNewCharityDesc('');
  };

  // Reports calculations (§ 11.5)
  const totalSubscribers = allUsers.length;
  const totalPrizePoolsHistory = draws.reduce((sum, d) => sum + d.totalPrizePool, 0);
  const totalCharityRaised = charities.reduce((sum, c) => sum + c.totalRaised, 0);

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Top Header */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border-2 border-amber-500/40 bg-gradient-to-r from-slate-950 via-[#13111c] to-slate-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="text-xs uppercase font-mono px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 font-black">
              § 11 Master Control Center
            </span>
            <span className="text-xs text-slate-400 font-mono">Platform Admin Privileges</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white mt-2 tracking-tight">
            Administrator Command Surface
          </h1>
          <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-2xl leading-relaxed">
            Full control across user management, draw simulation and publishing, charity listings, and winner payouts.
          </p>
        </div>

        {/* 5 Control Tabs Switcher (§ 11) */}
        <div className="flex items-center gap-2 p-2 rounded-2xl bg-slate-900 border-2 border-white/15 overflow-x-auto w-full md:w-auto shadow-2xl">
          <button
            onClick={() => setActiveTab('draws')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'draws' ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/30 scale-105' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Trophy className="w-4 h-4" /> 02 Draw Engine
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'users' ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/30 scale-105' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" /> 01 Users
          </button>
          <button
            onClick={() => setActiveTab('winners')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'winners' ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/30 scale-105' : 'text-slate-300 hover:text-white'
            }`}
          >
            <CheckSquare className="w-4 h-4" /> 04 Winners
          </button>
          <button
            onClick={() => setActiveTab('charities')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'charities' ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/30 scale-105' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Heart className="w-4 h-4" /> 03 Charities
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'reports' ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/30 scale-105' : 'text-slate-300 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" /> 05 Reports
          </button>
        </div>
      </div>

      {publishSuccessMsg && (
        <div className="p-5 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/40 flex items-center justify-between text-sm text-emerald-300 font-bold shadow-xl">
          <span>{publishSuccessMsg}</span>
          <button onClick={() => setPublishSuccessMsg(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* SURFACE 02: DRAW MANAGEMENT (§ 11.2, § 06) */}
      {activeTab === 'draws' && (
        <div className="space-y-8">
          <div className="glass-panel p-8 sm:p-10 rounded-3xl border-2 border-white/15 space-y-8 bg-slate-950/90 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-white/15">
              <div>
                <span className="text-xs font-black text-amber-400 uppercase font-mono tracking-wider">Control Surface 02</span>
                <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                  Active Draw Configuration & Execution
                </h2>
                <p className="text-sm text-slate-300 mt-1 max-w-xl">
                  Configure generation logic, execute pre-publication dry-run simulations, and publish verified cash draws.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* 1,000-Draw Monte Carlo Stress Test (§ 11.2, § 11.5) */}
                <button
                  onClick={() => {
                    sounds.playClick();
                    setIsMonteCarloOpen(true);
                  }}
                  className="px-5 py-3 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/50 text-xs sm:text-sm font-black flex items-center gap-2 transition-all shadow-lg hover:scale-105"
                >
                  <Activity className="w-4 h-4 text-amber-400" />
                  <span>1,000-Draw Monte Carlo</span>
                </button>

                {/* Logic Selector (§ 06: Random vs. Algorithmic) */}
                <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900 border border-white/15">
                  <span className="text-xs text-slate-400 px-2 font-bold">Engine:</span>
                  <button
                    onClick={() => setSelectedLogic('random')}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                      selectedLogic === 'random'
                        ? 'bg-amber-400 text-slate-950 shadow-md'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Random
                  </button>
                  <button
                    onClick={() => setSelectedLogic('algorithmic')}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                      selectedLogic === 'algorithmic'
                        ? 'bg-emerald-400 text-slate-950 shadow-md'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Algorithmic
                  </button>
                </div>
              </div>
            </div>

            {/* Current Active Draw Specs */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-white/10 shadow-inner">
                <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Draw Identifier</span>
                <div className="text-2xl font-black font-mono text-white mt-1">
                  Draw #{activeDraw?.drawNumber || 'N/A'}
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-white/10 shadow-inner">
                <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Total Prize Pool</span>
                <div className="text-2xl font-black font-mono text-amber-400 mt-1">
                  ${(activeDraw?.totalPrizePool || 0).toLocaleString()}
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-white/10 shadow-inner">
                <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Jackpot Pool (40%)</span>
                <div className="text-2xl font-black font-mono text-white mt-1">
                  ${(activeDraw?.jackpotPool || 0).toLocaleString()}
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-white/10 shadow-inner">
                <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Rollover Balance</span>
                <div className="text-2xl font-black font-mono text-emerald-400 mt-1">
                  ${(activeDraw?.rolloverJackpot || 0).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Simulation Action Bar */}
            <div className="pt-6 flex flex-wrap items-center justify-between gap-6 border-t border-white/15">
              <div className="text-sm text-slate-300 font-medium">
                Active Strategy: <strong className="text-amber-300 capitalize">{selectedLogic}</strong> logic. Run dry-run simulation before committing official draw.
              </div>

              <button
                onClick={handleRunSimulation}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:brightness-110 text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-amber-500/30 flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95"
              >
                <Play className="w-5 h-5 fill-slate-950" />
                <span>Run Pre-Publish Simulation</span>
              </button>
            </div>

            {/* Dry-Run Simulation Results Card (§ 06, § 11.2) */}
            {activeSimulation && (
              <div className="p-8 rounded-3xl bg-slate-950 border-2 border-amber-400/80 space-y-8 shadow-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-3.5 h-3.5 rounded-full bg-amber-400 animate-ping" />
                    <h3 className="text-xl font-black text-white">Simulation Results (Dry Run Candidate)</h3>
                  </div>
                  <span className="text-sm text-slate-400 font-mono font-bold">
                    Drawn: [{activeSimulation.drawnNumbers.join(', ')}]
                  </span>
                </div>

                {/* Candidate Drawn Balls */}
                <div className="flex items-center gap-3.5">
                  {activeSimulation.drawnNumbers.map((num, idx) => (
                    <div
                      key={idx}
                      className="w-16 h-16 rounded-2xl gold-ball flex items-center justify-center font-mono font-black text-slate-950 text-2xl shadow-xl border-2 border-amber-300"
                    >
                      {num}
                    </div>
                  ))}
                </div>

                {/* Simulation Breakdown Table */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs sm:text-sm">
                  <div className="p-5 rounded-2xl bg-slate-900 border border-white/10">
                    <span className="text-slate-400 block font-bold">5-Match Jackpot (40% Pool)</span>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-2xl font-black font-mono text-white">
                        {activeSimulation.jackpotWinnersCount} Winners
                      </span>
                    </div>
                    <p className="text-xs text-amber-400 font-mono font-bold mt-2">
                      {activeSimulation.jackpotWillRollover 
                        ? 'Unclaimed → Will Roll Over' 
                        : `$${activeSimulation.jackpotPayoutPerWinner.toFixed(2)} each`}
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900 border border-white/10">
                    <span className="text-slate-400 block font-bold">4-Match Tier 2 (35% Pool)</span>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-2xl font-black font-mono text-white">
                        {activeSimulation.tier2WinnersCount} Winners
                      </span>
                    </div>
                    <p className="text-xs text-teal-400 font-mono font-bold mt-2">
                      ${activeSimulation.tier2PayoutPerWinner.toFixed(2)} each
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900 border border-white/10">
                    <span className="text-slate-400 block font-bold">3-Match Tier 3 (25% Pool)</span>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-2xl font-black font-mono text-white">
                        {activeSimulation.tier3WinnersCount} Winners
                      </span>
                    </div>
                    <p className="text-xs text-emerald-400 font-mono font-bold mt-2">
                      ${activeSimulation.tier3PayoutPerWinner.toFixed(2)} each
                    </p>
                  </div>
                </div>

                {/* Publish Official Confirmation */}
                <div className="p-6 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                  <div className="text-sm text-slate-300">
                    <strong className="text-amber-300 font-bold">Ready to commit?</strong> Publishing will lock in these 5 numbers, record the results, spawn winner claims, and roll over unclaimed funds.
                  </div>
                  <button
                    disabled={isPublishing}
                    onClick={handlePublishDraw}
                    className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/25 transition-all hover:brightness-110 flex items-center justify-center gap-2"
                  >
                    <Check className="w-5 h-5" />
                    <span>{isPublishing ? 'Publishing Draw...' : 'Publish Official Results'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SURFACE 01: USER MANAGEMENT (§ 11.1) */}
      {activeTab === 'users' && (
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border-2 border-white/15 space-y-8 bg-slate-950/90 shadow-2xl">
          <div className="flex items-center justify-between pb-6 border-b border-white/15">
            <div>
              <span className="text-xs font-black text-amber-400 uppercase font-mono tracking-wider">Control Surface 01</span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">Registered Users & Scores Management</h2>
              <p className="text-sm text-slate-300 mt-1">
                View subscriber profiles, audit active 5-score combinations, and toggle subscriptions.
              </p>
            </div>
            <span className="text-sm text-slate-400 font-mono font-bold">{allUsers.length} Registered Accounts</span>
          </div>

          <div className="divide-y divide-white/10">
            {allUsers.map((user) => {
              const scores = allScores[user.id] || [];
              const charity = charities.find(c => c.id === user.charityId);

              return (
                <div key={user.id} className="py-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
                  <div className="flex items-center gap-4">
                    <img
                      src={user.avatarUrl}
                      alt={user.fullName}
                      className="w-12 h-12 rounded-2xl object-cover border-2 border-white/20"
                    />
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="font-black text-white text-base">{user.fullName}</span>
                        <span className={`text-xs uppercase font-mono font-bold px-2.5 py-0.5 rounded-md ${
                          user.role === 'admin' ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' : 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30'
                        }`}>
                          {user.role}
                        </span>
                      </div>
                      <div className="text-xs text-slate-300 mt-1">
                        {user.email} • Recipient: <strong className="text-white font-semibold">{charity?.name || 'None'}</strong> ({user.charityPercentage}%)
                      </div>
                    </div>
                  </div>

                  {/* 5 Stored Scores Preview */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 font-mono font-bold">5 Scores:</span>
                    <div className="flex items-center gap-2">
                      {scores.slice(0, 5).map((sc, i) => (
                        <span
                          key={i}
                          className="w-9 h-9 rounded-xl bg-slate-900 border-2 border-slate-700 flex items-center justify-center text-sm font-mono font-black text-white shadow-md"
                        >
                          {sc.score}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => adminToggleUserSubscription(user.id)}
                      className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/15 text-xs sm:text-sm font-bold text-slate-200 transition-all hover:scale-105"
                    >
                      Toggle Subscription
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SURFACE 04: WINNERS & PAYOUT VERIFICATION (§ 11.4, § 09) */}
      {activeTab === 'winners' && (
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border-2 border-white/15 space-y-8 bg-slate-950/90 shadow-2xl">
          <div className="flex items-center justify-between pb-6 border-b border-white/15">
            <div>
              <span className="text-xs font-black text-amber-400 uppercase font-mono tracking-wider">Control Surface 04</span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">Winner Verification & Payout Queue</h2>
              <p className="text-sm text-slate-300 mt-1">
                Inspect scorecard screenshots from winners, approve/reject submissions, and record payment completions.
              </p>
            </div>
            <span className="text-sm text-slate-400 font-mono font-bold">{verifications.length} Claims Total</span>
          </div>

          <div className="space-y-4">
            {verifications.map((v) => (
              <div key={v.id} className="p-6 rounded-2xl bg-slate-950 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <strong className="text-white text-base font-black">{v.userName}</strong>
                    <span className="text-slate-400 text-xs">({v.userEmail})</span>
                    <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 font-black uppercase text-xs border border-amber-400/40">
                      {v.tierWon} WINNER
                    </span>
                  </div>
                  <div className="text-slate-300 text-xs sm:text-sm">
                    Draw #{v.drawNumber} • Prize: <strong className="text-emerald-400 font-mono text-base font-black">${v.prizeAmount.toFixed(2)}</strong> • Matched {v.matchedCount}/5 numbers
                  </div>
                  {v.adminNotes && (
                    <div className="text-slate-300 text-xs italic bg-slate-900/80 p-2.5 rounded-xl border border-white/5">
                      Admin Note: {v.adminNotes}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3.5">
                  {v.proofUrl ? (
                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => {
                          sounds.playClick();
                          setScannerVerification(v);
                        }}
                        className="px-4 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 text-xs sm:text-sm font-black flex items-center gap-2 transition-all shadow-md hover:scale-105"
                      >
                        <Scan className="w-4 h-4 text-emerald-400" />
                        <span>AI Vision OCR</span>
                      </button>
                      <button
                        onClick={() => setInspectingVerification(v)}
                        className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/15 text-slate-200 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Inspect Image</span>
                      </button>
                    </div>
                  ) : (
                    <span className="text-slate-500 italic text-xs">No Proof Uploaded</span>
                  )}

                  {/* Verification Status Badge */}
                  <span className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider ${
                    v.status === 'approved' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                    v.status === 'rejected' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}>
                    {v.status}
                  </span>

                  {/* Payout State Button */}
                  {v.paymentStatus === 'paid' ? (
                    <span className="px-4 py-2 rounded-xl bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm shadow-md">
                      Paid
                    </span>
                  ) : (
                    <button
                      disabled={v.status !== 'approved'}
                      onClick={() => markPayoutCompleted(v.id)}
                      className={`px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all ${
                        v.status === 'approved'
                          ? 'bg-gradient-to-r from-emerald-400 to-teal-400 hover:brightness-110 text-slate-950 shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95'
                          : 'bg-slate-900 text-slate-600 cursor-not-allowed border border-white/5'
                      }`}
                    >
                      Disburse Payout
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SURFACE 03: CHARITY MANAGEMENT (§ 11.3) */}
      {activeTab === 'charities' && (
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border-2 border-white/15 space-y-8 bg-slate-950/90 shadow-2xl">
          <div className="flex items-center justify-between pb-6 border-b border-white/15">
            <div>
              <span className="text-xs font-black text-amber-400 uppercase font-mono tracking-wider">Control Surface 03</span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">Charity Directory Listings CRUD</h2>
              <p className="text-sm text-slate-300 mt-1">
                Add new verified non-profit partners, update fundraising goals, and manage charity golf days.
              </p>
            </div>
            <button
              onClick={() => setIsAddingCharity(true)}
              className="px-5 py-3 rounded-2xl bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Charity</span>
            </button>
          </div>

          {/* Add Charity Form */}
          {isAddingCharity && (
            <form onSubmit={handleCreateCharity} className="p-8 rounded-3xl bg-slate-900 border-2 border-emerald-500/40 space-y-5">
              <h3 className="text-xl font-black text-white">Create Verified Charity Partner</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
                <div>
                  <label className="block text-slate-300 font-bold mb-2">Charity Name</label>
                  <input
                    type="text"
                    required
                    value={newCharityName}
                    onChange={(e) => setNewCharityName(e.target.value)}
                    placeholder="e.g. Trees for Future"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-white font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-2">Category</label>
                  <select
                    value={newCharityCategory}
                    onChange={(e) => setNewCharityCategory(e.target.value as any)}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-white font-medium"
                  >
                    <option>Youth & Education</option>
                    <option>Health & Research</option>
                    <option>Environment & Conservation</option>
                    <option>Community & Hunger</option>
                    <option>Veterans & First Responders</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-slate-300 font-bold text-sm mb-2">Tagline</label>
                <input
                  type="text"
                  value={newCharityTagline}
                  onChange={(e) => setNewCharityTagline(e.target.value)}
                  placeholder="One sentence mission"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-white text-sm font-medium"
                />
              </div>
              <div className="flex items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingCharity(false)}
                  className="px-5 py-3 rounded-2xl bg-slate-950 border border-white/10 text-slate-300 text-sm font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-emerald-400 text-slate-950 text-sm font-black shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all"
                >
                  Save Charity
                </button>
              </div>
            </form>
          )}

          {/* Charity List */}
          <div className="divide-y divide-white/10 text-sm">
            {charities.map((c) => (
              <div key={c.id} className="py-5 flex items-center justify-between gap-5">
                <div className="flex items-center gap-4">
                  <img
                    src={c.logoUrl}
                    alt={c.name}
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-white/20"
                  />
                  <div>
                    <h4 className="font-black text-white text-base">{c.name}</h4>
                    <p className="text-slate-300 text-xs sm:text-sm mt-0.5">{c.category} • Total Raised: <strong className="text-emerald-400 font-mono font-bold">${c.totalRaised.toLocaleString()}</strong></p>
                  </div>
                </div>
                <button
                  onClick={() => deleteCharity(c.id)}
                  className="p-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 transition-all hover:scale-105"
                  title="Remove charity"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SURFACE 05: REPORTS & ANALYTICS (§ 11.5) */}
      {activeTab === 'reports' && (
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border-2 border-white/15 space-y-8 bg-slate-950/90 shadow-2xl">
          <div className="pb-6 border-b border-white/15">
            <span className="text-xs font-black text-amber-400 uppercase font-mono tracking-wider">Control Surface 05</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">Platform Reports & Real-Time Analytics</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-slate-900/90 shadow-inner">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total User Accounts</span>
              <div className="text-3xl font-black font-mono text-white mt-2">{totalSubscribers}</div>
              <span className="text-xs text-emerald-400 font-bold mt-1 block">100% Active in draws</span>
            </div>
            <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-slate-900/90 shadow-inner">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Prize Pool History</span>
              <div className="text-3xl font-black font-mono text-amber-400 mt-2">${totalPrizePoolsHistory.toLocaleString()}</div>
              <span className="text-xs text-slate-400 font-semibold mt-1 block">Across {draws.length} Draws</span>
            </div>
            <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-slate-900/90 shadow-inner">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Charity Contributions</span>
              <div className="text-3xl font-black font-mono text-emerald-400 mt-2">${totalCharityRaised.toLocaleString()}</div>
              <span className="text-xs text-slate-400 font-semibold mt-1 block">Grassroots Verified</span>
            </div>
            <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-slate-900/90 shadow-inner">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rollover Balance</span>
              <div className="text-3xl font-black font-mono text-white mt-2">${(activeDraw?.rolloverJackpot || 10000).toLocaleString()}</div>
              <span className="text-xs text-amber-400 font-bold mt-1 block">Carried to Draw #{activeDraw?.drawNumber}</span>
            </div>
          </div>
        </div>
      )}

      {/* Proof Inspection Modal (§ 11.4) */}
      {inspectingVerification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
          <div className="glass-panel max-w-xl w-full p-8 rounded-3xl border-2 border-white/20 bg-slate-950 shadow-2xl relative">
            <button
              onClick={() => setInspectingVerification(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-2xl font-black text-white mb-1">
              Audit Winner Scorecard Proof
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mb-6">
              Candidate: <strong>{inspectingVerification.userName}</strong> • Draw #{inspectingVerification.drawNumber} • Winning Tier: <span className="text-amber-400 uppercase font-black">{inspectingVerification.tierWon}</span>
            </p>

            <div className="p-4 rounded-2xl bg-black/80 border border-white/15 mb-6">
              <img
                src={inspectingVerification.proofUrl}
                alt="Winner Proof Scorecard"
                className="w-full max-h-72 object-contain rounded-xl"
              />
            </div>

            <div className="mb-6">
              <label className="text-xs text-slate-300 font-bold block mb-2">Admin Audit Notes</label>
              <input
                type="text"
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="e.g. Verified against official handicap system portal"
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-white text-sm font-medium"
              />
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  reviewWinnerProof(inspectingVerification.id, 'rejected', adminNote || 'Scorecard did not match recorded dates');
                  setInspectingVerification(null);
                }}
                className="flex-1 py-3.5 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-sm font-black border border-rose-500/40 transition-colors"
              >
                Reject Proof
              </button>
              <button
                onClick={() => {
                  reviewWinnerProof(inspectingVerification.id, 'approved', adminNote || 'Verified by admin');
                  setInspectingVerification(null);
                }}
                className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:brightness-110 text-slate-950 text-sm font-black shadow-xl shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95"
              >
                Approve & Validate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1,000-Draw Monte Carlo Stress Test Modal (§ 11.2, § 11.5) */}
      <MonteCarloModal
        isOpen={isMonteCarloOpen}
        onClose={() => setIsMonteCarloOpen(false)}
      />

      {/* AI Scorecard Vision Scanner Modal (§ 09, § 11.4) */}
      {scannerVerification && (
        <ScorecardScannerModal
          isOpen={Boolean(scannerVerification)}
          onClose={() => setScannerVerification(null)}
          verification={scannerVerification}
        />
      )}
    </div>
  );
};
