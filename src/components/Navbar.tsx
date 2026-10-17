import React, { useState } from 'react';
import {
  Wallet,
  Bell,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  Sparkles,
  FileText,
  LogOut,
  LogIn,
  CheckCircle2,
  ChevronDown,
  Zap,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext.tsx';
import { usePWAInstall } from '../hooks/usePWAInstall.ts';
import { SUPPORTED_CURRENCIES } from '../data/initialData.ts';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenQuickLog: () => void;
  onOpenAiInsights: () => void;
  onOpenProductSpec: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenQuickLog,
  onOpenAiInsights,
  onOpenProductSpec,
}) => {
  const {
    user,
    isGuest,
    signInWithGoogle,
    signOutUser,
    baseCurrency,
    setBaseCurrency,
    notifications,
    unreadNotificationsCount,
    markNotificationRead,
    clearAllNotifications,
    isSyncingCrossPlatform,
    triggerTwoWaySync,
  } = useFinance();

  const { isInstallable, isInstalled, install } = usePWAInstall();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'android', label: 'Android App' },
    { id: 'transactions', label: 'Transactions' },
    { id: 'budgets', label: 'Budgets' },
    { id: 'subscriptions', label: 'Subscriptions' },
    { id: 'tax', label: 'Tax & Freelance' },
    { id: 'banks', label: 'Bank Sync' },
    { id: 'sync', label: 'Cross-Platform Sync' },
    { id: 'security', label: 'Security & Backup' },
  ];

  const currentCurrencyConfig = SUPPORTED_CURRENCIES.find((c) => c.code === baseCurrency) || SUPPORTED_CURRENCIES[0];

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800 text-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2.5 text-left focus:outline-none group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-zinc-100 via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                    ApexLedger
                  </span>
                  <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md">
                    PRO
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>AES-256 Cloud Vault</span>
                </div>
              </div>
            </button>
          </div>

          {/* Navigation Items (Desktop) */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-zinc-800 text-emerald-400 shadow-sm border border-zinc-700/60'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Currency Selector */}
            <div className="relative">
              <button
                onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs font-medium text-zinc-300 hover:text-zinc-100 transition-colors"
                title="Select Base Currency"
              >
                <span>{currentCurrencyConfig.flag}</span>
                <span className="font-semibold">{currentCurrencyConfig.code}</span>
                <ChevronDown className="w-3 h-3 text-zinc-500" />
              </button>

              {showCurrencyDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider border-b border-zinc-800">
                    Live FX Rates
                  </div>
                  {SUPPORTED_CURRENCIES.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => {
                        setBaseCurrency(c.code);
                        setShowCurrencyDropdown(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left hover:bg-zinc-800 transition-colors ${
                        baseCurrency === c.code ? 'text-emerald-400 font-semibold bg-emerald-500/5' : 'text-zinc-300'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{c.flag}</span>
                        <span>{c.name}</span>
                      </span>
                      <span className="text-zinc-500 font-mono text-[11px]">{c.code}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Android App Button */}
            <button
              onClick={() => {
                if (isInstallable) {
                  install();
                } else {
                  setActiveTab('android');
                }
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 text-xs font-semibold transition-all shadow-sm shadow-emerald-950"
              title={isInstallable ? 'Install Android App on device' : 'Open Android App & Widget Suite'}
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isInstallable ? 'Install Android' : 'Android App'}</span>
            </button>

            {/* Quick-Log Mobile Widget Button */}
            <button
              onClick={onOpenQuickLog}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-zinc-100 hover:border-zinc-700 text-xs font-medium transition-all"
              title="Home Screen Quick-Log Widget Simulator"
            >
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Widget</span>
            </button>

            {/* Gemini AI Advisor Button */}
            <button
              onClick={onOpenAiInsights}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-violet-600/20 to-indigo-600/20 border border-violet-500/30 text-violet-300 hover:text-white hover:border-violet-500/50 text-xs font-medium transition-all"
              title="Automated Savings & Habit Audit (Gemini 3.8 Flash)"
            >
              <Sparkles className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
              <span className="hidden md:inline">Gemini Audit</span>
            </button>

            {/* Lead PM Product Specification Document Button */}
            <button
              onClick={onOpenProductSpec}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-zinc-100 hover:border-zinc-700 text-xs font-medium transition-colors"
              title="Lead PM & Architect Technical Specification"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden lg:inline">PRD Spec</span>
            </button>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-zinc-100 transition-colors"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center animate-bounce">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                    <span className="text-xs font-bold text-zinc-200">Real-Time Alerts</span>
                    {unreadNotificationsCount > 0 && (
                      <button
                        onClick={clearAllNotifications}
                        className="text-[11px] text-emerald-400 hover:underline"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="mt-2 space-y-2 max-h-72 overflow-y-auto pr-1">
                    {notifications.length === 0 ? (
                      <div className="text-center py-6 text-xs text-zinc-500">
                        No active alerts. All spending within thresholds!
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationRead(n.id)}
                          className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                            n.read
                              ? 'bg-zinc-950/50 border-zinc-800/60 text-zinc-400'
                              : 'bg-zinc-800/80 border-emerald-500/30 text-zinc-200'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-semibold text-zinc-200">{n.title}</span>
                            <span className="text-[10px] text-zinc-500 shrink-0">{n.timestamp}</span>
                          </div>
                          <p className="mt-1 text-[11px] text-zinc-400 leading-relaxed">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Sync Pulse Badge */}
            <button
              onClick={() => triggerTwoWaySync('Web Dashboard', 'Manual Sync Pulse')}
              disabled={isSyncingCrossPlatform}
              className={`p-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-emerald-400 transition-colors ${
                isSyncingCrossPlatform ? 'animate-spin text-emerald-400' : ''
              }`}
              title="Trigger Cross-Platform Two-Way Sync Broadcast"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* User Profile / Google Auth */}
            <div className="relative">
              {user ? (
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1 pl-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors"
                >
                  <span className="text-xs font-medium text-zinc-200 hidden sm:inline">
                    {user.displayName || user.email?.split('@')[0]}
                  </span>
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      className="w-7 h-7 rounded-lg object-cover ring-1 ring-emerald-500/30"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                      {(user.displayName || user.email || 'U')[0].toUpperCase()}
                    </div>
                  )}
                </button>
              ) : (
                <button
                  onClick={signInWithGoogle}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-900 text-xs font-semibold shadow-sm transition-all"
                  title="Sign in with Google Account"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Google Sign In</span>
                </button>
              )}

              {showUserMenu && user && (
                <div className="absolute right-0 mt-2 w-56 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-2 border-b border-zinc-800">
                    <p className="text-xs font-semibold text-zinc-200">{user.displayName || 'Account'}</p>
                    <p className="text-[11px] text-zinc-400 truncate">{user.email}</p>
                    <div className="flex items-center gap-1 mt-1 text-[10px] text-emerald-400">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Firebase Cloud Connected</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      signOutUser();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-zinc-800 transition-colors text-left"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex xl:hidden overflow-x-auto py-2 gap-1 border-t border-zinc-800/60 no-scrollbar">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-zinc-800 text-emerald-400 border border-zinc-700'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
