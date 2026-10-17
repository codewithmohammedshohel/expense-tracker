import React, { useState } from 'react';
import {
  Building,
  RefreshCw,
  Plus,
  ShieldCheck,
  CheckCircle,
  ExternalLink,
  Lock,
  ArrowRight,
  Sparkles,
  AlertCircle,
  X,
  CreditCard,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext.tsx';

const SUPPORTED_INSTITUTIONS = [
  { id: 'chase', name: 'Chase Bank', logo: '🏛️', type: 'Checking & Credit' },
  { id: 'bofa', name: 'Bank of America', logo: '🏦', type: 'Checking & Savings' },
  { id: 'amex', name: 'American Express', logo: '💳', type: 'Commercial Credit' },
  { id: 'svb', name: 'Silicon Valley Bank', logo: '🏢', type: 'Venture & Escrow' },
  { id: 'stripe', name: 'Stripe Corporate', logo: '⚡', type: 'Merchant Payouts' },
  { id: 'revolut', name: 'Revolut Business', logo: '🌍', type: 'Multi-Currency Global' },
];

export const BankSyncHub: React.FC = () => {
  const { bankConnections, triggerBankSync, isSyncingBank, addNotification } = useFinance();

  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [selectedInst, setSelectedInst] = useState(SUPPORTED_INSTITUTIONS[0]);
  const [isLinking, setIsLinking] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  const handleSyncInstitution = async (instName: string) => {
    setSyncFeedback(null);
    const count = await triggerBankSync(instName.split(' ')[0]);
    if (count > 0) {
      setSyncFeedback(`Successfully synced ${count} transactions from ${instName} with Gemini AI classification.`);
    }
  };

  const handleConnectInstitution = async () => {
    setIsLinking(true);
    setTimeout(() => {
      setIsLinking(false);
      setIsLinkModalOpen(false);
      addNotification({
        title: 'New Financial Institution Linked',
        message: `${selectedInst.name} has been securely connected via Plaid Link (read-only OAuth token established).`,
        type: 'success',
      });
      handleSyncInstitution(selectedInst.name);
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            <Building className="w-5 h-5 text-emerald-400" />
            <span>Automated Bank Sync &amp; Financial API Hub</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time Plaid / MX / Yodlee transaction ingestion &bull; Gemini 3.8 Flash smart auto-categorization &bull; SOC-2 Type II secure
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSyncInstitution('All Connected')}
            disabled={isSyncingBank}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncingBank ? 'animate-spin' : ''}`} />
            <span>{isSyncingBank ? 'Syncing Feeds...' : 'Sync All Feeds'}</span>
          </button>

          <button
            onClick={() => setIsLinkModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-semibold transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Connect Bank</span>
          </button>
        </div>
      </div>

      {/* Sync Feedback Banner */}
      {syncFeedback && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{syncFeedback}</span>
        </div>
      )}

      {/* Connected Bank Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {bankConnections.map((bc) => (
          <div
            key={bc.id}
            className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-xl">
                  🏛️
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Live Synced
                </span>
              </div>

              <div className="mt-3">
                <h4 className="font-bold text-sm text-zinc-100">{bc.institutionName}</h4>
                <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono mt-1">
                  <span>{bc.accountMask}</span>
                  <span>&bull;</span>
                  <span>{bc.accountType || 'Commercial'}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs">
              <span className="text-[11px] text-zinc-500">Last sync: {bc.lastSyncedAt || 'Today'}</span>
              <button
                onClick={() => handleSyncInstitution(bc.institutionName)}
                disabled={isSyncingBank}
                className="text-emerald-400 hover:underline font-medium text-[11px] flex items-center gap-1"
              >
                <RefreshCw className={`w-3 h-3 ${isSyncingBank ? 'animate-spin' : ''}`} />
                <span>Sync Now</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Architecture & Security Pipeline Card */}
      <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-zinc-100 font-bold text-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Automated Bank Ingestion &amp; Gemini AI Categorization Architecture</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/60 space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <Lock className="w-3.5 h-3.5" />
              <span>1. Plaid OAuth Link</span>
            </div>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Zero credential storage. Encrypted ephemeral tokens exchanged with Federal Reserve-regulated banking APIs.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/60 space-y-1.5">
            <div className="flex items-center gap-2 text-teal-400 font-bold">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>2. Real-Time Webhook</span>
            </div>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Sub-second webhook notifications ingest cleared transactions, card swipes, and direct deposits.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/60 space-y-1.5">
            <div className="flex items-center gap-2 text-violet-400 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>3. Gemini AI Pipeline</span>
            </div>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              `gemini-3.8-flash` normalizes messy merchant strings, predicts tax categories, and calculates deduction percentages.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/60 space-y-1.5">
            <div className="flex items-center gap-2 text-cyan-400 font-bold">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>4. Firestore ABAC Vault</span>
            </div>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Ingested transactions committed to user tenant with AES-256 cloud encryption and mathematical ABAC security rules.
            </p>
          </div>
        </div>
      </div>

      {/* Connect Bank Modal Simulator */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                <h3 className="text-base font-bold text-zinc-100">Connect Institution (Plaid Sandbox)</h3>
              </div>
              <button
                onClick={() => setIsLinkModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <p className="text-xs text-zinc-400">
                Select your financial institution to initiate secure, end-to-end encrypted read-only bank transaction synchronization.
              </p>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {SUPPORTED_INSTITUTIONS.map((inst) => (
                  <button
                    key={inst.id}
                    onClick={() => setSelectedInst(inst)}
                    className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                      selectedInst.id === inst.id
                        ? 'bg-emerald-500/10 border-emerald-500 text-zinc-100'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-850'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{inst.logo}</span>
                      <div>
                        <p className="font-bold text-xs">{inst.name}</p>
                        <p className="text-[10px] text-zinc-400">{inst.type}</p>
                      </div>
                    </div>
                    {selectedInst.id === inst.id && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                  </button>
                ))}
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-zinc-900">
                <button
                  type="button"
                  onClick={() => setIsLinkModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-zinc-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConnectInstitution}
                  disabled={isLinking}
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold shadow-md shadow-emerald-500/20 cursor-pointer flex items-center gap-2"
                >
                  {isLinking ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Authorizing Token...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Authorize with {selectedInst.name}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
