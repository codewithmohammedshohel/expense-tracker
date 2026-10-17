import React, { useState } from 'react';
import {
  FileText,
  X,
  Layers,
  Shield,
  Smartphone,
  Share2,
  Cpu,
  Database,
  CheckCircle,
  Copy,
  Check,
} from 'lucide-react';

interface ProductSpecificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProductSpecificationModal: React.FC<ProductSpecificationModalProps> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState<'overview' | 'frs' | 'tech' | 'security' | 'sync'>('overview');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-zinc-900 px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-100">
                Product Specification &amp; System Architecture Document (PRD)
              </h3>
              <p className="text-xs text-zinc-400">Lead Product Manager &amp; Lead Full-Stack Software Architect Blueprint</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex overflow-x-auto bg-zinc-900/60 px-6 py-2 border-b border-zinc-800 gap-2 no-scrollbar">
          {[
            { id: 'overview', label: '1. Executive Summary & Vision' },
            { id: 'frs', label: '2. Functional Specification (FRS)' },
            { id: 'tech', label: '3. Full-Stack Architecture' },
            { id: 'security', label: '4. Security & Encryption' },
            { id: 'sync', label: '5. Cross-Platform & Google Sites Sync' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeSection === tab.id
                  ? 'bg-zinc-800 text-emerald-400 border border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-zinc-300 leading-relaxed">
          {activeSection === 'overview' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                <h4 className="text-sm font-bold text-zinc-100">Product Vision &amp; Problem Statement</h4>
                <p>
                  Modern freelancers, consultants, and small business owners juggle multi-currency revenue, rapid micro-expenses, and fragmented banking platforms. Existing budgeting applications suffer from high friction (requiring 6+ taps to record a coffee), lack native Schedule C tax deductions, fail to provide cross-device synchronization with internal corporate intranet portals (like Google Sites), and compromise privacy with third-party tracking.
                </p>
                <p>
                  <strong className="text-emerald-400">ApexLedger</strong> provides an enterprise-grade financial intelligence system combining instant mobile home screen widget quick-logging, real-time Plaid bank transaction streaming, Gemini 3.8 Flash ML categorization, automated Schedule C tax harvesting, and seamless two-way state mesh between native Android/iOS clients and Google Sites endpoints.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800">
                  <span className="font-bold text-zinc-200 block mb-1">Target Personas</span>
                  <p className="text-zinc-400 text-[11px]">
                    Freelancers, solo SaaS founders, creative agencies, and cross-border consultants managing mixed business &amp; personal cash flow.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800">
                  <span className="font-bold text-zinc-200 block mb-1">Key Value Proposition</span>
                  <p className="text-zinc-400 text-[11px]">
                    1-Tap rapid logging + 100% tax deduction accuracy + real-time multi-currency conversions + zero cloud vendor lock-in.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800">
                  <span className="font-bold text-zinc-200 block mb-1">Core Tech Foundation</span>
                  <p className="text-zinc-400 text-[11px]">
                    Firebase Auth + Firestore (Enterprise ABAC) + Gemini 3.8 Flash + Node.js Express + Tailwind CSS + PWA.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'frs' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-zinc-100">Functional Requirements Matrix</h4>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-400 text-xs">FR-1: Core Tracking &amp; Multi-Currency Engine</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">P0 - Core</span>
                  </div>
                  <p className="text-zinc-400 text-[11px]">
                    System tracks daily income and expenses across 9 major global fiat currencies (USD, EUR, GBP, JPY, CAD, AUD, CHF, INR, SGD) with automatic live exchange rates, preserving original transaction values and computing base currency normalized totals.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-400 text-xs">FR-2: Recurring Subscriptions &amp; Billing Reminders</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">P0 - Core</span>
                  </div>
                  <p className="text-zinc-400 text-[11px]">
                    Automated tracking of active recurring tools (SaaS, hosting, media). Calculates monthly/annualized burn rates and dispatches automated 7-day push alerts prior to auto-renewals.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-400 text-xs">FR-3: Freelancer &amp; Small Business Schedule C Tax Hub</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">P0 - Core</span>
                  </div>
                  <p className="text-zinc-400 text-[11px]">
                    Pre-categorizes write-offs into official IRS Form 1040 Schedule C lines (Line 27a Software, Line 18 Supplies, Line 24b 50% Meals, Line 25 Utilities). Includes real-time tax bracket savings simulator and 1-click CPA CSV export.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-violet-400 text-xs">FR-4: Automated Bank Sync &amp; Gemini Smart Categorization</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-violet-500/20 text-violet-300">P0 - Core</span>
                  </div>
                  <p className="text-zinc-400 text-[11px]">
                    Secure read-only bank API integration via Plaid / MX protocol. Ingested transactions pass through `gemini-3.8-flash` to extract clean merchant titles, assign Schedule C buckets, and append tags with confidence scores.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cyan-400 text-xs">FR-5: Home Screen Quick-Logging Widget</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">P0 - Core</span>
                  </div>
                  <p className="text-zinc-400 text-[11px]">
                    Interactive mobile quick-entry widget for 1-tap micro-expense recording (Coffee, Lunch, Rideshare, Fuel) with instant tactile feedback and immediate mesh synchronization across all active endpoints.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'tech' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-zinc-100">Full-Stack System Architecture</h4>

              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-[11px] space-y-2 text-zinc-300">
                <div className="text-emerald-400 font-bold">// High-Level Component Topology</div>
                <div>[Native Android Widget / iOS Client] &lt;---&gt; [WebSocket / REST Mesh]</div>
                <div>[ApexLedger Web Dashboard] &lt;---&gt; [Express API Server (Vite / Node)]</div>
                <div>[Google Sites Intranet Gadget] &lt;---&gt; [Webhook / PostMessage Bridge]</div>
                <div className="text-zinc-500">            |</div>
                <div>            v</div>
                <div>[Gemini 3.8 Flash SDK] &lt;---&gt; [AI Categorization &amp; Insights Pipeline]</div>
                <div>[Firebase Auth &amp; Firestore] &lt;---&gt; [AES-256 Storage &amp; ABAC Rules]</div>
                <div>[Plaid / MX API Gateway] &lt;---&gt; [Bank Account Real-Time Feed]</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800">
                  <h5 className="font-bold text-xs text-zinc-200 mb-1">Frontend Layer</h5>
                  <p className="text-zinc-400 text-[11px]">
                    React 19 + TypeScript + Tailwind CSS v4 + Motion animations. Reactive single-source-of-truth state via React Context with Firestore onSnapshot listeners and fallback offline localStorage cache.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800">
                  <h5 className="font-bold text-xs text-zinc-200 mb-1">Backend &amp; AI Layer</h5>
                  <p className="text-zinc-400 text-[11px]">
                    Node.js + Express + `@google/genai` TypeScript SDK using `gemini-3.8-flash`. Strictly isolates API keys on the server and provides JSON Schema response typing.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'security' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-zinc-100">Security, Encryption &amp; Compliance Specifications</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-zinc-900/70 border border-zinc-800 space-y-1">
                  <span className="font-bold text-xs text-emerald-400">AES-256 Data at Rest</span>
                  <p className="text-[11px] text-zinc-400">
                    All persistent records in Google Cloud Firestore and local client storage partitions utilize AES-256-GCM symmetric block cipher encryption with unique per-tenant keys.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-900/70 border border-zinc-800 space-y-1">
                  <span className="font-bold text-xs text-cyan-400">TLS 1.3 Strict Data in Transit</span>
                  <p className="text-[11px] text-zinc-400">
                    All network communications require TLS 1.3 protocol negotiation with ECDHE key exchange and HSTS header enforcement, mitigating man-in-the-middle attacks.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-900/70 border border-zinc-800 space-y-1">
                  <span className="font-bold text-xs text-violet-400">Zero-Trust ABAC Firestore Rules</span>
                  <p className="text-[11px] text-zinc-400">
                    Mathematically blocks unauthorized cross-user operations. Enforces strict schema keys (`hasOnly`), path variable size guards (`isValidId`), and mandatory user ownership verification.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-900/70 border border-zinc-800 space-y-1">
                  <span className="font-bold text-xs text-amber-400">Automated Cloud Disaster Recovery</span>
                  <p className="text-[11px] text-zinc-400">
                    Automated cryptographic snapshots calculate SHA-256 checksums to verify archive integrity, allowing point-in-time state restoration at any moment.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'sync' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-zinc-100">Two-Way Synchronization &amp; Google Sites Integration Protocol</h4>

              <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
                <h5 className="font-bold text-xs text-emerald-400">Two-Way State Synchronization Model</h5>
                <p className="text-[11px] text-zinc-300">
                  ApexLedger uses an event-driven delta sync engine. When a transaction is logged on an Android mobile widget or an external Google Sites embedded gadget:
                </p>
                <ol className="list-decimal list-inside space-y-1 text-zinc-400 text-[11px]">
                  <li>The originating client generates an immutable payload with an incremental sync version number.</li>
                  <li>The event is dispatched to `/api/sync/two-way` and committed to Firestore.</li>
                  <li>Real-time snapshot streams immediately notify all connected nodes (Android, iOS, Web Dashboard, and Google Sites).</li>
                  <li>Conflict resolution utilizes Server Timestamp Authority with deterministic Last-Write-Wins (LWW) guarantees.</li>
                </ol>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
                <h5 className="font-bold text-xs text-cyan-400">Google Sites Intranet Gadget Implementation</h5>
                <p className="text-[11px] text-zinc-300">
                  Corporate dashboards on Google Sites can embed ApexLedger via an iframe web gadget. The gadget communicates with the parent window using a bi-directional `postMessage` protocol, enabling two-way interaction with enterprise intranets.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-zinc-900 px-6 py-3 border-t border-zinc-800 flex items-center justify-between text-xs">
          <span className="text-zinc-500">Document Version: 2.4.0 (Enterprise Production)</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium transition-colors"
          >
            Close Document
          </button>
        </div>
      </div>
    </div>
  );
};
