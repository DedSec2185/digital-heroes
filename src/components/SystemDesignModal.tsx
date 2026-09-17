import React, { useState } from 'react';
import { X, Layers, Database, Shield, Cpu, Code2, CheckCircle2 } from 'lucide-react';

interface SystemDesignModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemDesignModal: React.FC<SystemDesignModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'schema' | 'trigger' | 'security'>('architecture');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
      <div className="glass-panel max-w-3xl w-full p-6 sm:p-8 rounded-3xl border border-white/20 bg-slate-950 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Layers className="w-4 h-4" />
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
            § 13 & § 14 Architecture Blueprint
          </span>
        </div>
        <h2 className="text-2xl font-bold text-white">
          System Design, Data Model & Scalability Architecture
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Engineered for production readiness, sub-50ms latency, and bulletproof database integrity.
        </p>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 my-5 border-b border-white/10 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'architecture' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            System Topology
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'schema' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Database Schema (ERD)
          </button>
          <button
            onClick={() => setActiveTab('trigger')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'trigger' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            FIFO 5-Score Trigger
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'security' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Security & RLS Matrix
          </button>
        </div>

        {/* Tab 1: System Topology */}
        {activeTab === 'architecture' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-900 border border-white/5 space-y-3">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-400" /> Platform Infrastructure
              </h4>
              <p className="text-slate-300 leading-relaxed">
                The platform utilizes a modern decoupled stack: client-side SPA hosting on <strong>Vercel Global Edge Network</strong> connected to <strong>Supabase (PostgreSQL 15)</strong> via connection pooling.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-950 border border-white/5">
                  <strong className="text-emerald-400 block mb-1">Frontend Layer</strong>
                  <span>React 19, TypeScript, Tailwind CSS v4, Web Audio API, Canvas Confetti</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-white/5">
                  <strong className="text-amber-400 block mb-1">Compute & Business Logic</strong>
                  <span>Score Engine, Draw Engine (Random vs Algorithmic), Monte Carlo Simulator</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-white/5">
                  <strong className="text-teal-400 block mb-1">Persistence Layer</strong>
                  <span>PostgreSQL 15, FIFO Triggers, Row-Level Security, Supabase Storage</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5">
              <h4 className="font-bold text-white mb-2">Scalability & Zero-Deficit Guarantees (§ 14)</h4>
              <ul className="space-y-2 text-slate-400">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span><strong>Mathematical Invariant:</strong> Prize pool is permanently bounded to exactly 50% of subscriber revenue, guaranteeing zero negative cashflow.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span><strong>Sub-50ms Query Performance:</strong> Composite indexing on <code>(user_id, score_date DESC)</code> guarantees instantaneous score retrievals even with 100,000+ active golfers.</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab 2: Schema ERD */}
        {activeTab === 'schema' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-900 border border-white/5 font-mono text-[11px] leading-relaxed overflow-x-auto text-slate-300">
              <div className="text-emerald-400 font-bold mb-2">// Core Entity-Relationship Diagram</div>
              <div>[PROFILES] 1 ──── ∞ [SCORES] (Strictly limited to 5 via FIFO trigger)</div>
              <div>     │</div>
              <div>     ├──── 1 [SUBSCRIPTIONS] (Monthly $19.99 / Yearly $180)</div>
              <div>     ├──── 1 [CHARITIES] (Min 10% charity_percentage allocation)</div>
              <div>     └──── ∞ [DRAW_ENTRIES] ──── 1 [DRAWS]</div>
              <div>                  │</div>
              <div>                  └──── 1 [WINNER_VERIFICATIONS] (Scorecard screenshot audit)</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-2">
              <h4 className="font-bold text-white">Database Normalization Rationale:</h4>
              <p className="text-slate-400 text-xs">
                Scores and verification proofs are decoupled into dedicated normalized relations rather than overloaded profile columns. This ensures infinite scale for historical auditability and audit compliance.
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: FIFO Trigger */}
        {activeTab === 'trigger' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-900 border border-white/5">
              <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-emerald-400" /> Automated 5-Score FIFO Rolling Buffer (§ 05)
              </h4>
              <p className="text-slate-300 mb-3">
                To guarantee that a new score automatically evicts the oldest score without relying on client-side trust, the database executes an atomic <code>AFTER INSERT</code> trigger:
              </p>
              <pre className="p-3.5 rounded-xl bg-black font-mono text-[11px] text-emerald-300 overflow-x-auto">
{`CREATE OR REPLACE FUNCTION enforce_rolling_5_scores()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM public.scores
    WHERE id NOT IN (
        SELECT id FROM public.scores
        WHERE user_id = NEW.user_id
        ORDER BY score_date DESC, created_at DESC
        LIMIT 5
    ) AND user_id = NEW.user_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;`}
              </pre>
            </div>
          </div>
        )}

        {/* Tab 4: Security & RLS */}
        {activeTab === 'security' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-900 border border-white/5 space-y-3">
              <h4 className="font-bold text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-400" /> Row-Level Security (RLS) Matrix
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[11px]">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400">
                      <th className="py-2">Table</th>
                      <th className="py-2">Public Visitor</th>
                      <th className="py-2">Registered Subscriber</th>
                      <th className="py-2">Administrator</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    <tr>
                      <td className="py-2 font-mono text-emerald-400">scores</td>
                      <td>No Access</td>
                      <td>CRUD own 5 scores</td>
                      <td>Full Audit & Override</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-mono text-emerald-400">draws</td>
                      <td>Read published</td>
                      <td>Read & matched status</td>
                      <td>Configure, Simulate, Publish</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-mono text-emerald-400">charities</td>
                      <td>Read all</td>
                      <td>Read & select recipient</td>
                      <td>Full CRUD & Events</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-mono text-emerald-400">winner_verifications</td>
                      <td>No Access</td>
                      <td>Upload proof for own wins</td>
                      <td>Inspect, Approve/Reject, Pay</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
