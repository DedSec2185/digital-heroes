import React from 'react';
import { Zap, Heart, Trophy, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/10 bg-slate-950/80 backdrop-blur-md pt-12 pb-8 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <span className="font-bold text-white tracking-wider font-mono">
                DIGITAL<span className="text-emerald-400">HEROES</span>
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                PRD LEVEL 1
              </span>
            </div>
            <p className="mt-2 text-slate-400 max-w-sm text-[11px] leading-relaxed">
              A golf performance and charity draw platform brief for full-stack development trainees. Edition 2026.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-400" /> 40% / 35% / 25% Transparent Prize Pools
            </span>
            <span className="flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-emerald-400" /> Min. 10% Guaranteed Charity Funding
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" /> Vetted Scorecard Audit System
            </span>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © 2026 Digital Heroes. Developed for Trainee Selection Process. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Built by Abhayraj Singh</span>
            <span>•</span>
            <a 
              href="https://github.com/DedSec2185" 
              target="_blank" 
              rel="noreferrer"
              className="text-slate-400 hover:text-white transition-colors"
            >
              github.com/DedSec2185
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
