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
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Top Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/30 bg-slate-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
              § 11 Master Control Center
            </span>
            <span className="text-xs text-slate-400 font-mono">Platform Admin Privileges</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            Administrator Command Surface
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Full control across user management, draw simulation and publishing, charity listings, and winner payouts.
          </p>
        </div>

        {/* 5 Control Tabs Switcher (§ 11) */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900 border border-white/10 overflow-x-auto w-full md:w-auto">
          <button
            onClick={() => setActiveTab('draws')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'draws' ? 'bg-amber-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" /> 02 Draw Engine
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'users' ? 'bg-amber-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" /> 01 Users
          </button>
          <button
            onClick={() => setActiveTab('winners')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'winners' ? 'bg-amber-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" /> 04 Winners
          </button>
          <button
            onClick={() => setActiveTab('charities')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'charities' ? 'bg-amber-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Heart className="w-3.5 h-3.5" /> 03 Charities
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'reports' ? 'bg-amber-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" /> 05 Reports
          </button>
        </div>
      </div>

      {publishSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300">
          <span>{publishSuccessMsg}</span>
          <button onClick={() => setPublishSuccessMsg(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* SURFACE 02: DRAW MANAGEMENT (§ 11.2, § 06) */}
      {activeTab === 'draws' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase font-mono">Control Surface 02</span>
                <h2 className="text-xl font-bold text-white mt-1">
                  Active Draw Configuration & Execution
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Configure generation logic, execute pre-publication dry-run simulations, and publish verified cash draws.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {/* 1,000-Draw Monte Carlo Stress Test (§ 11.2, § 11.5) */}
                <button
                  onClick={() => {
                    sounds.playClick();
                    setIsMonteCarloOpen(true);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <Activity className="w-3.5 h-3.5 text-amber-400" />
                  <span>1,000-Draw Monte Carlo</span>
                </button>

                {/* Logic Selector (§ 06: Random vs. Algorithmic) */}
                <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900 border border-white/10">
                  <span className="text-[11px] text-slate-400 px-2 font-medium">Draw Engine:</span>
                  <button
                    onClick={() => setSelectedLogic('random')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      selectedLogic === 'random'
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Standard Random
                  </button>
                  <button
                    onClick={() => setSelectedLogic('algorithmic')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      selectedLogic === 'algorithmic'
                        ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Algorithmic Frequency
                  </button>
                </div>
              </div>
            </div>

            {/* Current Active Draw Specs */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5">
                <span className="text-[10px] text-slate-400 uppercase font-medium">Draw Identifier</span>
                <div className="text-lg font-bold font-mono text-white mt-1">
                  Draw #{activeDraw?.drawNumber || 'N/A'}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5">
                <span className="text-[10px] text-slate-400 uppercase font-medium">Total Prize Pool</span>
                <div className="text-lg font-bold font-mono text-amber-400 mt-1">
                  ${(activeDraw?.totalPrizePool || 0).toLocaleString()}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5">
                <span className="text-[10px] text-slate-400 uppercase font-medium">5-Match Jackpot Pool (40%)</span>
                <div className="text-lg font-bold font-mono text-white mt-1">
                  ${(activeDraw?.jackpotPool || 0).toLocaleString()}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5">
                <span className="text-[10px] text-slate-400 uppercase font-medium">Carried Rollover Balance</span>
                <div className="text-lg font-bold font-mono text-emerald-400 mt-1">
                  ${(activeDraw?.rolloverJackpot || 0).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Simulation Action Bar */}
            <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-white/10">
              <div className="text-xs text-slate-400">
                Mode: <strong className="text-white capitalize">{selectedLogic}</strong> logic. Run a dry run to inspect exact winners and payouts before committing.
              </div>

              <button
                onClick={handleRunSimulation}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:brightness-110 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all"
              >
                <Play className="w-4 h-4" />
                <span>Run Pre-Publish Simulation</span>
              </button>
            </div>

            {/* Dry-Run Simulation Results Card (§ 06, § 11.2) */}
            {activeSimulation && (
              <div className="p-6 rounded-3xl bg-slate-950 border-2 border-amber-500/40 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-400 animate-ping" />
                    <h3 className="text-base font-bold text-white">Simulation Results (Dry Run)</h3>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    Candidate Draw: [{activeSimulation.drawnNumbers.join(', ')}]
                  </span>
                </div>

                {/* Candidate Drawn Balls */}
                <div className="flex items-center gap-3">
                  {activeSimulation.drawnNumbers.map((num, idx) => (
                    <div
                      key={idx}
                      className="w-14 h-14 rounded-2xl gold-ball flex items-center justify-center font-mono font-bold text-slate-950 text-xl shadow-lg border-2 border-amber-300"
                    >
                      {num}
                    </div>
                  ))}
                </div>

                {/* Simulation Breakdown Table */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-900 border border-white/5">
                    <span className="text-slate-400 block font-medium">5-Match Jackpot (40% Pool)</span>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-xl font-bold font-mono text-white">
                        {activeSimulation.jackpotWinnersCount} Winners
                      </span>
                    </div>
                    <p className="text-[11px] text-amber-400 font-mono mt-1">
                      {activeSimulation.jackpotWillRollover 
                        ? 'Unclaimed → Will Roll Over' 
                        : `$${activeSimulation.jackpotPayoutPerWinner.toFixed(2)} each`}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900 border border-white/5">
                    <span className="text-slate-400 block font-medium">4-Match Tier 2 (35% Pool)</span>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-xl font-bold font-mono text-white">
                        {activeSimulation.tier2WinnersCount} Winners
                      </span>
                    </div>
                    <p className="text-[11px] text-teal-400 font-mono mt-1">
                      ${activeSimulation.tier2PayoutPerWinner.toFixed(2)} each
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900 border border-white/5">
                    <span className="text-slate-400 block font-medium">3-Match Tier 3 (25% Pool)</span>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-xl font-bold font-mono text-white">
                        {activeSimulation.tier3WinnersCount} Winners
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-400 font-mono mt-1">
                      ${activeSimulation.tier3PayoutPerWinner.toFixed(2)} each
                    </p>
                  </div>
                </div>

                {/* Publish Official Confirmation */}
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-xs text-slate-300">
                    <strong className="text-amber-300">Ready to commit?</strong> Publishing will lock in these 5 numbers, record the results, spawn winner claims, and roll over unclaimed funds.
                  </div>
                  <button
                    disabled={isPublishing}
                    onClick={handlePublishDraw}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all hover:brightness-110 flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
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
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase font-mono">Control Surface 01</span>
              <h2 className="text-xl font-bold text-white mt-1">Registered Users & Scores Management</h2>
              <p className="text-xs text-slate-400 mt-1">
                View subscriber profiles, audit active 5-score combinations, and toggle subscriptions.
              </p>
            </div>
            <span className="text-xs text-slate-400 font-mono">{allUsers.length} Registered Accounts</span>
          </div>

          <div className="divide-y divide-white/5">
            {allUsers.map((user) => {
              const scores = allScores[user.id] || [];
              const charity = charities.find(c => c.id === user.charityId);

              return (
                <div key={user.id} className="py-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatarUrl}
                      alt={user.fullName}
                      className="w-10 h-10 rounded-xl object-cover border border-white/10"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{user.fullName}</span>
                        <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded ${
                          user.role === 'admin' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                        }`}>
                          {user.role}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400">
                        {user.email} • Recipient: <strong className="text-slate-200">{charity?.name || 'None'}</strong> ({user.charityPercentage}%)
                      </div>
                    </div>
                  </div>

                  {/* 5 Stored Scores Preview */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-500 font-mono">5 Scores:</span>
                    <div className="flex items-center gap-1.5">
                      {scores.slice(0, 5).map((sc, i) => (
                        <span
                          key={i}
                          className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-mono font-bold text-slate-200"
                        >
                          {sc.score}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => adminToggleUserSubscription(user.id)}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-300 transition-colors"
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
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase font-mono">Control Surface 04</span>
              <h2 className="text-xl font-bold text-white mt-1">Winner Verification & Payout Queue</h2>
              <p className="text-xs text-slate-400 mt-1">
                Inspect scorecard screenshots from winners, approve/reject submissions, and record payment completions.
              </p>
            </div>
            <span className="text-xs text-slate-400 font-mono">{verifications.length} Claims Total</span>
          </div>

          <div className="space-y-3">
            {verifications.map((v) => (
              <div key={v.id} className="p-4 rounded-2xl bg-slate-950/80 border border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <strong className="text-white text-sm">{v.userName}</strong>
                    <span className="text-slate-400">({v.userEmail})</span>
                    <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 font-bold uppercase text-[10px]">
                      {v.tierWon} WINNER
                    </span>
                  </div>
                  <div className="text-slate-400">
                    Draw #{v.drawNumber} • Prize: <strong className="text-emerald-400 font-mono text-sm">${v.prizeAmount.toFixed(2)}</strong> • Matched {v.matchedCount}/5 numbers
                  </div>
                  {v.adminNotes && (
                    <div className="text-slate-300 text-[11px] italic">
                      Admin Note: {v.adminNotes}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {v.proofUrl ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          sounds.playClick();
                          setScannerVerification(v);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <Scan className="w-3.5 h-3.5 text-emerald-400" />
                        <span>AI Vision OCR</span>
                      </button>
                      <button
                        onClick={() => setInspectingVerification(v)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Inspect Image</span>
                      </button>
                    </div>
                  ) : (
                    <span className="text-slate-500 italic text-xs">No Proof Uploaded</span>
                  )}

                  {/* Verification Status Badge */}
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase ${
                    v.status === 'approved' ? 'bg-emerald-500/20 text-emerald-300' :
                    v.status === 'rejected' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {v.status}
                  </span>

                  {/* Payout State Button */}
                  {v.paymentStatus === 'paid' ? (
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs">
                      Paid
                    </span>
                  ) : (
                    <button
                      disabled={v.status !== 'approved'}
                      onClick={() => markPayoutCompleted(v.id)}
                      className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                        v.status === 'approved'
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:brightness-110 text-slate-950 shadow-md'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
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
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase font-mono">Control Surface 03</span>
              <h2 className="text-xl font-bold text-white mt-1">Charity Directory Listings CRUD</h2>
              <p className="text-xs text-slate-400 mt-1">
                Add new verified non-profit partners, update fundraising goals, and manage charity golf days.
              </p>
            </div>
            <button
              onClick={() => setIsAddingCharity(true)}
              className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Charity</span>
            </button>
          </div>

          {/* Add Charity Form */}
          {isAddingCharity && (
            <form onSubmit={handleCreateCharity} className="p-6 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-4">
              <h3 className="text-base font-bold text-white">Create Verified Charity Partner</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Charity Name</label>
                  <input
                    type="text"
                    required
                    value={newCharityName}
                    onChange={(e) => setNewCharityName(e.target.value)}
                    placeholder="e.g. Trees for Future"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={newCharityCategory}
                    onChange={(e) => setNewCharityCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
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
                <label className="block text-slate-300 font-semibold text-xs mb-1">Tagline</label>
                <input
                  type="text"
                  value={newCharityTagline}
                  onChange={(e) => setNewCharityTagline(e.target.value)}
                  placeholder="One sentence mission"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingCharity(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold"
                >
                  Save Charity
                </button>
              </div>
            </form>
          )}

          {/* Charity List */}
          <div className="divide-y divide-white/5 text-xs">
            {charities.map((c) => (
              <div key={c.id} className="py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={c.logoUrl}
                    alt={c.name}
                    className="w-10 h-10 rounded-xl object-cover border border-white/10"
                  />
                  <div>
                    <h4 className="font-bold text-white text-sm">{c.name}</h4>
                    <p className="text-slate-400">{c.category} • Total Raised: <strong className="text-emerald-400 font-mono">${c.totalRaised.toLocaleString()}</strong></p>
                  </div>
                </div>
                <button
                  onClick={() => deleteCharity(c.id)}
                  className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300"
                  title="Remove charity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SURFACE 05: REPORTS & ANALYTICS (§ 11.5) */}
      {activeTab === 'reports' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
          <div className="pb-4 border-b border-white/10">
            <span className="text-xs font-bold text-amber-400 uppercase font-mono">Control Surface 05</span>
            <h2 className="text-xl font-bold text-white mt-1">Platform Reports & Real-Time Analytics</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="glass-panel p-5 rounded-2xl">
              <span className="text-xs font-semibold text-slate-400 uppercase">Total User Accounts</span>
              <div className="text-2xl font-bold font-mono text-white mt-2">{totalSubscribers}</div>
              <span className="text-[11px] text-emerald-400 mt-1 block">100% Active in draws</span>
            </div>
            <div className="glass-panel p-5 rounded-2xl">
              <span className="text-xs font-semibold text-slate-400 uppercase">Total Prize Pool History</span>
              <div className="text-2xl font-bold font-mono text-amber-400 mt-2">${totalPrizePoolsHistory.toLocaleString()}</div>
              <span className="text-[11px] text-slate-400 mt-1 block">Across {draws.length} Draws</span>
            </div>
            <div className="glass-panel p-5 rounded-2xl">
              <span className="text-xs font-semibold text-slate-400 uppercase">Charity Contributions</span>
              <div className="text-2xl font-bold font-mono text-emerald-400 mt-2">${totalCharityRaised.toLocaleString()}</div>
              <span className="text-[11px] text-slate-400 mt-1 block">Grassroots Verified</span>
            </div>
            <div className="glass-panel p-5 rounded-2xl">
              <span className="text-xs font-semibold text-slate-400 uppercase">Rollover Balance</span>
              <div className="text-2xl font-bold font-mono text-white mt-2">${(activeDraw?.rolloverJackpot || 10000).toLocaleString()}</div>
              <span className="text-[11px] text-amber-400 mt-1 block">Carried to Draw #{activeDraw?.drawNumber}</span>
            </div>
          </div>
        </div>
      )}

      {/* Proof Inspection Modal (§ 11.4) */}
      {inspectingVerification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="glass-panel max-w-xl w-full p-6 sm:p-8 rounded-3xl border border-white/20 bg-slate-900 shadow-2xl relative">
            <button
              onClick={() => setInspectingVerification(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-1">
              Audit Winner Scorecard Proof
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Candidate: <strong>{inspectingVerification.userName}</strong> • Draw #{inspectingVerification.drawNumber} • Winning Tier: {inspectingVerification.tierWon.toUpperCase()}
            </p>

            <div className="p-3 rounded-2xl bg-black/60 border border-white/10 mb-4">
              <img
                src={inspectingVerification.proofUrl}
                alt="Winner Proof Scorecard"
                className="w-full max-h-72 object-contain rounded-xl"
              />
            </div>

            <div className="mb-4">
              <label className="text-xs text-slate-300 font-semibold block mb-1">Admin Audit Notes</label>
              <input
                type="text"
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="e.g. Verified against Scottish Golf Union official handicap portal"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  reviewWinnerProof(inspectingVerification.id, 'rejected', adminNote || 'Scorecard did not match recorded dates');
                  setInspectingVerification(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold transition-colors"
              >
                Reject Proof
              </button>
              <button
                onClick={() => {
                  reviewWinnerProof(inspectingVerification.id, 'approved', adminNote || 'Verified by admin');
                  setInspectingVerification(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-md shadow-emerald-500/20 transition-all"
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
