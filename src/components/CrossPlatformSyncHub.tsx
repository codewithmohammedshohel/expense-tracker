import React, { useState } from 'react';
import {
  Smartphone,
  Laptop,
  Globe,
  Share2,
  RefreshCw,
  Copy,
  Check,
  Code2,
  ExternalLink,
  ShieldCheck,
  Send,
  Zap,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext.tsx';

export const CrossPlatformSyncHub: React.FC = () => {
  const {
    syncDevices,
    recentSyncEvents,
    triggerTwoWaySync,
    isSyncingCrossPlatform,
    baseCurrency,
    formatCurrency,
    transactions,
    budgets,
  } = useFinance();

  const [copiedCode, setCopiedCode] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<string>('Android App');

  // Embeddable Google Sites HTML Code Snippet
  const googleSitesEmbedCode = `<!-- ApexLedger Two-Way Google Sites / Intranet Financial Gadget -->
<div id="apex-ledger-gadget" style="width:100%;max-width:540px;margin:auto;font-family:system-ui,sans-serif;">
  <iframe
    src="https://ais-dev-7jliqjtdhrr5q4l75kqkec-1069535225897.asia-southeast1.run.app?view=embed_gadget&currency=${baseCurrency}"
    width="100%"
    height="480"
    frameborder="0"
    style="border-radius:16px;box-shadow:0 10px 25px rgba(0,0,0,0.3);border:1px solid #27272a;background:#09090b;"
    allow="clipboard-write"
    title="ApexLedger Google Sites Embed"
  ></iframe>
</div>
<script>
  window.addEventListener("message", function(event) {
    if (event.data && event.data.type === "APEX_SYNC_UPDATE") {
      console.log("Two-way event received from Google Sites:", event.data);
    }
  });
</script>`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(googleSitesEmbedCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleSimulateAndroidSync = () => {
    triggerTwoWaySync('Android Pixel 8 Pro', 'Logged Expense ($12.50 Rideshare via Mobile Widget)', {
      amount: 12.5,
      merchant: 'Lyft Urban Transit',
    });
  };

  const handleSimulateWebSync = () => {
    triggerTwoWaySync('Web Dashboard Endpoint', 'Updated SaaS Monthly Budget to $400.00', {
      category: 'Software & SaaS',
      limit: 400,
    });
  };

  const handleSimulateGoogleSitesSync = () => {
    triggerTwoWaySync('Google Sites Intranet Gadget', 'Approved Monthly Small-Business Report', {
      status: 'Executive Signed',
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            <Share2 className="w-5 h-5 text-emerald-400" />
            <span>Cross-Platform Two-Way Sync &amp; Google Sites Gateway</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time state mesh connecting Android, iOS, Desktop, Web Dashboard, and Google Sites endpoints.
          </p>
        </div>

        <button
          onClick={() => triggerTwoWaySync('Manual Test', 'Global Mesh Broadcast')}
          disabled={isSyncingCrossPlatform}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/20 cursor-pointer self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncingCrossPlatform ? 'animate-spin' : ''}`} />
          <span>{isSyncingCrossPlatform ? 'Broadcasting Mesh...' : 'Broadcast Full Sync'}</span>
        </button>
      </div>

      {/* Connected Platform Mesh Topology */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {syncDevices.map((dev) => (
          <div
            key={dev.id}
            className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition-all space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-200">
                {dev.deviceType === 'android' ? (
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                ) : dev.deviceType === 'ios' ? (
                  <Smartphone className="w-4 h-4 text-zinc-300" />
                ) : dev.deviceType === 'google_sites_endpoint' ? (
                  <Globe className="w-4 h-4 text-cyan-400" />
                ) : (
                  <Laptop className="w-4 h-4 text-indigo-400" />
                )}
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                v{dev.syncVersion || 42}
              </span>
            </div>

            <div>
              <h4 className="font-bold text-xs text-zinc-200 truncate">{dev.deviceName}</h4>
              <p className="text-[10px] text-zinc-400 mt-0.5">{dev.status || 'Active'}</p>
            </div>

            <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[10px] text-zinc-500">
              <span>{dev.lastActiveAt || 'Online'}</span>
              <span className="text-emerald-400 font-medium">Synced</span>
            </div>
          </div>
        ))}
      </div>

      {/* Two-Way Interactive Simulator Controls */}
      <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-zinc-100">Simulate Two-Way Endpoint Updates</h3>
            <p className="text-xs text-zinc-400">Trigger live data mutation from any device to observe mesh replication</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={handleSimulateAndroidSync}
            disabled={isSyncingCrossPlatform}
            className="p-3.5 rounded-xl bg-zinc-950/70 hover:bg-zinc-950 border border-zinc-800 hover:border-emerald-500/50 text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
              <Smartphone className="w-4 h-4" />
              <span>Simulate Android App Entry</span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-1">
              Trigger Quick-Log widget expense &rarr; propagates to Web &amp; Google Sites
            </p>
          </button>

          <button
            onClick={handleSimulateWebSync}
            disabled={isSyncingCrossPlatform}
            className="p-3.5 rounded-xl bg-zinc-950/70 hover:bg-zinc-950 border border-zinc-800 hover:border-teal-500/50 text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-2 text-teal-400 font-bold text-xs">
              <Laptop className="w-4 h-4" />
              <span>Simulate Web Dashboard Edit</span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-1">
              Update monthly budget limit &rarr; pushes instant alert to Android &amp; iOS
            </p>
          </button>

          <button
            onClick={handleSimulateGoogleSitesSync}
            disabled={isSyncingCrossPlatform}
            className="p-3.5 rounded-xl bg-zinc-950/70 hover:bg-zinc-950 border border-zinc-800 hover:border-cyan-500/50 text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
              <Globe className="w-4 h-4" />
              <span>Simulate Google Sites Webhook</span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-1">
              Intranet gadget approval &rarr; commits two-way state update to cloud
            </p>
          </button>
        </div>

        {/* Live Event Stream Console */}
        <div className="mt-4 pt-4 border-t border-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-zinc-300">Live Two-Way Sync Audit Log</span>
            <span className="text-[10px] text-zinc-500 font-mono">TLS 1.3 End-to-End Stream</span>
          </div>

          <div className="space-y-1.5 max-h-48 overflow-y-auto font-mono text-[11px] bg-zinc-950 p-3 rounded-xl border border-zinc-800/80">
            {recentSyncEvents.map((evt) => (
              <div key={evt.id} className="flex items-start justify-between gap-3 text-zinc-300 py-0.5">
                <div className="flex items-center gap-2 truncate">
                  <span className="text-emerald-400">[{evt.origin}]</span>
                  <span className="text-zinc-200">{evt.action}</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-zinc-500 text-[10px]">{evt.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Google Sites Embeddable Gadget & Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Code Snippet Box */}
        <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-emerald-400" />
                <span>Google Sites Intranet Gadget Embed Code</span>
              </h3>
              <p className="text-xs text-zinc-400">Paste directly into your Google Sites "Embed" &gt; "Embed code" tab</p>
            </div>
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 transition-colors"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>

          <div className="relative">
            <pre className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-300 font-mono overflow-x-auto leading-relaxed">
              {googleSitesEmbedCode}
            </pre>
          </div>

          <div className="text-xs text-zinc-400 space-y-1">
            <p className="font-semibold text-zinc-300">How to embed in Google Sites:</p>
            <ol className="list-decimal list-inside space-y-1 text-zinc-400 text-[11px]">
              <li>Open your company or personal dashboard on <strong className="text-zinc-200">sites.google.com</strong>.</li>
              <li>Click <strong className="text-zinc-200">Insert</strong> on the right sidebar &rarr; select <strong className="text-zinc-200">Embed</strong>.</li>
              <li>Click the <strong className="text-zinc-200">Embed code</strong> tab, paste the code above, and click <strong className="text-zinc-200">Next &gt; Insert</strong>.</li>
            </ol>
          </div>
        </div>

        {/* Live Interactive Embed Preview */}
        <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-zinc-100">Live Google Sites Gadget Preview</h3>
              <p className="text-xs text-zinc-400">Interactive preview of how users interact inside the intranet iframe</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
              Interactive Preview
            </span>
          </div>

          {/* Rendered Gadget Simulation */}
          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-inner space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-zinc-100">Apex Intranet Summary</h4>
                  <p className="text-[10px] text-zinc-400">Base Currency: {baseCurrency}</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Connected
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800/80">
                <span className="text-[10px] text-zinc-400 uppercase font-semibold">Active Ledger</span>
                <span className="block text-sm font-bold font-mono text-zinc-100 mt-1">
                  {transactions.length} entries
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800/80">
                <span className="text-[10px] text-zinc-400 uppercase font-semibold">Active Budgets</span>
                <span className="block text-sm font-bold font-mono text-emerald-400 mt-1">
                  {budgets.length} configured
                </span>
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-semibold text-zinc-300">Recent Stream from Android &amp; Web</span>
              {transactions.slice(0, 2).map((t) => (
                <div
                  key={t.id}
                  className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/60 flex items-center justify-between text-xs"
                >
                  <span className="font-medium text-zinc-200 truncate">{t.description}</span>
                  <span className="font-mono font-bold text-zinc-100 shrink-0">
                    {formatCurrency(t.amount, t.currency)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
