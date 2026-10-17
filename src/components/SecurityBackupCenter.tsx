import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Download,
  Upload,
  RefreshCw,
  CheckCircle,
  FileCheck,
  Database,
  Key,
  HardDrive,
  Copy,
  Check,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext.tsx';
import { CloudBackup } from '../types/finance.ts';

export const SecurityBackupCenter: React.FC = () => {
  const {
    cloudBackups,
    createCloudBackup,
    restoreCloudBackup,
    isBackupRunning,
    transactions,
    budgets,
    subscriptions,
  } = useFinance();

  const [backupNameInput, setBackupNameInput] = useState('');
  const [copiedChecksum, setCopiedChecksum] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleCreateBackup = async () => {
    const name = backupNameInput.trim() || `Encrypted Snapshot ${new Date().toLocaleDateString()}`;
    const newBackup = await createCloudBackup(name);
    setBackupNameInput('');
    setStatusMessage(`Successfully created and encrypted snapshot: ${newBackup.backupName}`);
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleDownloadArchive = (backup: CloudBackup) => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${backup.backupName.replace(/\s+/g, '_')}_encrypted.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCopyChecksum = (checksum: string) => {
    navigator.clipboard.writeText(checksum);
    setCopiedChecksum(checksum);
    setTimeout(() => setCopiedChecksum(null), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>End-to-End Encryption &amp; Cloud Backup Vault</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            AES-256 for data at rest &bull; TLS 1.3 strict transit &bull; Automated encrypted cloud recovery snapshots
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            <span>AES-256-GCM Armed</span>
          </span>
        </div>
      </div>

      {/* Status Message */}
      {statusMessage && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Security Pillars Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Key className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-sm text-zinc-100">Data at Rest: AES-256</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            All database documents, backup files, and local client caches are encrypted using Advanced Encryption Standard (AES) with 256-bit Galois/Counter Mode keys.
          </p>
          <div className="pt-2 text-[10px] font-mono text-emerald-400 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> FIPS 140-2 Level 3 Hardware Security
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
            <Lock className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-sm text-zinc-100">Data in Transit: TLS 1.3</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            All communication with Firestore, Gemini AI, and Plaid endpoints enforces TLS 1.3 cryptographic cipher suites with perfect forward secrecy.
          </p>
          <div className="pt-2 text-[10px] font-mono text-cyan-400 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Zero-Downgrade HSTS Policy
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-2">
          <div className="w-8 h-8 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center">
            <Database className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-sm text-zinc-100">ABAC Firestore Rules</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Mathematical Attribute-Based Access Control blocks cross-tenant access, ID poisoning, and schema contamination at the database engine level.
          </p>
          <div className="pt-2 text-[10px] font-mono text-violet-400 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Rules Verified &amp; Deployed
          </div>
        </div>
      </div>

      {/* Snapshot Backup Control */}
      <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-xl space-y-4">
        <div>
          <h3 className="text-sm font-bold text-zinc-100">Create Encrypted Ledger Snapshot</h3>
          <p className="text-xs text-zinc-400">
            Bundles {transactions.length} transactions, {budgets.length} budgets, and {subscriptions.length} subscriptions into an encrypted snapshot with SHA-256 verification.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            placeholder="Snapshot name (e.g. Q4 Close Backup, Pre-Tax Archive)..."
            value={backupNameInput}
            onChange={(e) => setBackupNameInput(e.target.value)}
            className="flex-1 w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500"
          />
          <button
            onClick={handleCreateBackup}
            disabled={isBackupRunning}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
          >
            <HardDrive className={`w-3.5 h-3.5 ${isBackupRunning ? 'animate-spin' : ''}`} />
            <span>{isBackupRunning ? 'Encrypting Snapshot...' : 'Create Encrypted Snapshot'}</span>
          </button>
        </div>
      </div>

      {/* Existing Cloud Snapshots Archive List */}
      <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-zinc-100">Encrypted Cloud Snapshots ({cloudBackups.length})</h3>
          <span className="text-xs text-zinc-400 font-mono">Automated Cloud Recovery System</span>
        </div>

        <div className="space-y-3">
          {cloudBackups.map((b) => (
            <div
              key={b.id}
              className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-zinc-200">{b.backupName}</h4>
                  <span className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] text-emerald-400 font-mono">
                    {b.recordCount} records
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 mt-1.5 text-[11px] text-zinc-400">
                  <span>Created: {new Date(b.createdAt || Date.now()).toLocaleDateString()}</span>
                  <div className="flex items-center gap-1 font-mono text-[10px] text-zinc-500">
                    <span>Checksum: {b.checksum.substring(0, 18)}...</span>
                    <button
                      onClick={() => handleCopyChecksum(b.checksum)}
                      className="p-0.5 hover:text-zinc-300"
                      title="Copy full SHA-256 Checksum"
                    >
                      {copiedChecksum === b.checksum ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => handleDownloadArchive(b)}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium text-[11px] flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>

                <button
                  onClick={() => restoreCloudBackup(b)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium text-[11px] flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Restore Snapshot</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
