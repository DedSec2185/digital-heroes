import React from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { 
  Trophy, 
  Heart, 
  ShieldCheck, 
  RotateCcw, 
  Sparkles, 
  UserCheck, 
  Globe, 
  Zap 
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openSubscribeModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeTab, 
  setActiveTab, 
  openSubscribeModal 
}) => {
  const { currentRole, setCurrentRole, subscription, resetState, currentUser } = useApp();

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    if (role === 'admin') setActiveTab('admin');
    else if (role === 'subscriber') setActiveTab('dashboard');
    else setActiveTab('home');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#090d16]/80 backdrop-blur-xl">
      {/* Top Testing & Role Quick-Switch Banner */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-amber-950/80 px-4 py-1.5 border-b border-white/5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-white tracking-wide">DIGITAL HEROES PRD (LEVEL 1)</span>
            <span className="text-slate-400 hidden sm:inline">• 2026 Trainee Evaluation System</span>
          </div>

          {/* Quick Role Switcher (§ 03) */}
          <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-lg border border-white/10">
            <span className="text-[11px] text-slate-400 font-medium px-2 flex items-center gap-1">
              <UserCheck className="w-3 h-3 text-emerald-400" /> Active Role:
            </span>
            <button
              onClick={() => handleRoleChange('visitor')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                currentRole === 'visitor' 
                  ? 'bg-slate-700 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Public Visitor
            </button>
            <button
              onClick={() => handleRoleChange('subscriber')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all flex items-center gap-1 ${
                currentRole === 'subscriber' 
                  ? 'bg-emerald-600 text-white shadow-sm font-semibold' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              Subscriber
            </button>
            <button
              onClick={() => handleRoleChange('admin')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all flex items-center gap-1 ${
                currentRole === 'admin' 
                  ? 'bg-amber-600 text-white shadow-sm font-semibold' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3 h-3" />
              Administrator
            </button>
          </div>

          <button
            onClick={() => {
              if (confirm('Reset platform data to clean seed state?')) {
                resetState();
              }
            }}
            title="Reset to original PRD seed data"
            className="text-slate-400 hover:text-amber-300 transition-colors flex items-center gap-1 text-[11px]"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-amber-400 p-[1px] shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center group-hover:bg-slate-900 transition-colors">
              <Zap className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-white font-mono">
                DIGITAL<span className="text-emerald-400">HEROES</span>
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                v1.0
              </span>
            </div>
            <p className="text-[10px] text-slate-400 tracking-wider uppercase font-medium">Golf & Charity Platform</p>
          </div>
        </div>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-1">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'home' 
                ? 'text-white bg-white/10' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Platform
          </button>
          <button
            onClick={() => setActiveTab('charities')}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'charities' 
                ? 'text-emerald-300 bg-emerald-500/10' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Heart className="w-4 h-4 text-emerald-400" />
            Charity Directory
          </button>
          <button
            onClick={() => setActiveTab('draws')}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'draws' 
                ? 'text-amber-300 bg-amber-500/10' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            Prize Draws
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'dashboard' 
                ? 'text-white bg-emerald-600/30 border border-emerald-500/30' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            Subscriber Hub
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'admin' 
                ? 'text-amber-300 bg-amber-500/20 border border-amber-500/30' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            Admin Control
          </button>
        </nav>

        {/* CTA Button / User Indicator */}
        <div className="flex items-center gap-3">
          {subscription?.status === 'active' ? (
            <div className="hidden sm:flex items-center gap-2 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-medium text-emerald-300">
                {currentUser.fullName} ({subscription.plan})
              </span>
            </div>
          ) : (
            <button
              onClick={openSubscribeModal}
              className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-xs font-semibold text-white rounded-xl group bg-gradient-to-br from-emerald-400 to-amber-500 shadow-lg shadow-emerald-500/20 hover:scale-[1.02] transition-transform active:scale-[0.98]"
            >
              <span className="px-4 py-2 transition-all ease-in duration-75 bg-slate-950 rounded-[10px] group-hover:bg-transparent">
                Subscribe to Play
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
