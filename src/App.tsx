import React, { useState } from 'react';
import { FinanceProvider } from './context/FinanceContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { DashboardOverview } from './components/DashboardOverview.tsx';
import { AndroidAppHub } from './components/AndroidAppHub.tsx';
import { TransactionsManager } from './components/TransactionsManager.tsx';
import { BudgetsManager } from './components/BudgetsManager.tsx';
import { SubscriptionsManager } from './components/SubscriptionsManager.tsx';
import { TaxFreelancerHub } from './components/TaxFreelancerHub.tsx';
import { BankSyncHub } from './components/BankSyncHub.tsx';
import { CrossPlatformSyncHub } from './components/CrossPlatformSyncHub.tsx';
import { SecurityBackupCenter } from './components/SecurityBackupCenter.tsx';
import { QuickLogWidget } from './components/QuickLogWidget.tsx';
import { AiInsightsModal } from './components/AiInsightsModal.tsx';
import { ProductSpecificationModal } from './components/ProductSpecificationModal.tsx';

function MainLayout() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isQuickLogOpen, setIsQuickLogOpen] = useState<boolean>(false);
  const [isAiInsightsOpen, setIsAiInsightsOpen] = useState<boolean>(false);
  const [isProductSpecOpen, setIsProductSpecOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-emerald-500 selection:text-zinc-950 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenQuickLog={() => setIsQuickLogOpen(true)}
        onOpenAiInsights={() => setIsAiInsightsOpen(true)}
        onOpenProductSpec={() => setIsProductSpecOpen(true)}
      />

      {/* Main Content View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'dashboard' && (
          <DashboardOverview
            onOpenAddTransaction={() => setActiveTab('transactions')}
            onOpenQuickLog={() => setIsQuickLogOpen(true)}
            onOpenAiInsights={() => setIsAiInsightsOpen(true)}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'android' && <AndroidAppHub />}

        {activeTab === 'transactions' && <TransactionsManager />}

        {activeTab === 'budgets' && <BudgetsManager />}

        {activeTab === 'subscriptions' && <SubscriptionsManager />}

        {activeTab === 'tax' && <TaxFreelancerHub />}

        {activeTab === 'banks' && <BankSyncHub />}

        {activeTab === 'sync' && <CrossPlatformSyncHub />}

        {activeTab === 'security' && <SecurityBackupCenter />}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950/80 py-6 text-zinc-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-zinc-300">ApexLedger</span>
            <span>&bull;</span>
            <span>Cross-Platform Financial Intelligence &amp; Multi-Currency Suite</span>
          </div>

          <div className="flex items-center gap-4 text-zinc-400">
            <button
              onClick={() => setIsProductSpecOpen(true)}
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              PRD &amp; Technical Architecture Spec
            </button>
            <span>&bull;</span>
            <button
              onClick={() => setIsQuickLogOpen(true)}
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Mobile Widget Preview
            </button>
            <span>&bull;</span>
            <span>AES-256 Encrypted</span>
          </div>
        </div>
      </footer>

      {/* Interactive Modals */}
      <QuickLogWidget isOpen={isQuickLogOpen} onClose={() => setIsQuickLogOpen(false)} />

      <AiInsightsModal isOpen={isAiInsightsOpen} onClose={() => setIsAiInsightsOpen(false)} />

      <ProductSpecificationModal
        isOpen={isProductSpecOpen}
        onClose={() => setIsProductSpecOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <FinanceProvider>
      <MainLayout />
    </FinanceProvider>
  );
}
