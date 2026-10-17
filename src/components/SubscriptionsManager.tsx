import React, { useState, useMemo } from 'react';
import {
  CreditCard,
  Plus,
  Calendar,
  AlertCircle,
  CheckCircle,
  PauseCircle,
  Trash2,
  X,
  Bell,
  RefreshCw,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext.tsx';
import { Subscription } from '../types/finance.ts';
import { SUPPORTED_CURRENCIES } from '../data/initialData.ts';

export const SubscriptionsManager: React.FC = () => {
  const {
    subscriptions,
    addSubscription,
    deleteSubscription,
    toggleSubscriptionStatus,
    formatCurrency,
    convertAmount,
    baseCurrency,
    addNotification,
  } = useFinance();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState(baseCurrency);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual' | 'quarterly' | 'weekly'>('monthly');
  const [nextBillingDate, setNextBillingDate] = useState(
    new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0]
  );
  const [category, setCategory] = useState('Software & SaaS');

  // Calculate monthly & annual subscription burn
  const { monthlyTotal, annualTotal, activeCount } = useMemo(() => {
    let monthly = 0;
    let count = 0;

    subscriptions.forEach((s) => {
      if (s.status === 'active') {
        count++;
        let m = s.amount;
        if (s.billingCycle === 'annual') m = s.amount / 12;
        if (s.billingCycle === 'quarterly') m = s.amount / 3;
        if (s.billingCycle === 'weekly') m = s.amount * 4.33;
        monthly += convertAmount(m, s.currency, baseCurrency);
      }
    });

    return {
      monthlyTotal: monthly,
      annualTotal: monthly * 12,
      activeCount: count,
    };
  }, [subscriptions, convertAmount, baseCurrency]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(amount);
    if (!parsed || isNaN(parsed)) return;

    await addSubscription({
      name,
      amount: parsed,
      currency,
      billingCycle,
      nextBillingDate,
      category,
      status: 'active',
      autoRenew: true,
    });

    setIsModalOpen(false);
    setName('');
    setAmount('');
  };

  const handleTestReminder = (sub: Subscription) => {
    addNotification({
      title: `Upcoming Renewal: ${sub.name}`,
      message: `${sub.name} (${formatCurrency(sub.amount, sub.currency)}) will renew on ${sub.nextBillingDate}. Auto-renew is currently active.`,
      type: 'info',
      category: sub.category,
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-zinc-100">Recurring Bills &amp; Subscriptions</h2>
          <p className="text-xs text-zinc-400 mt-1">
            Tracking {activeCount} active recurring services &bull; Billing cycle reminders &bull; Automatic cadence calculations
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/20 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Subscription</span>
        </button>
      </div>

      {/* Burn Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800">
          <span className="text-xs text-zinc-400 font-medium">Monthly Recurring Commitment</span>
          <div className="text-2xl font-bold text-zinc-100 font-mono mt-1">
            {formatCurrency(monthlyTotal)}
          </div>
          <span className="text-[11px] text-zinc-500 mt-1 block">
            Across {activeCount} active subscriptions
          </span>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800">
          <span className="text-xs text-zinc-400 font-medium">Annualized Subscription Overhead</span>
          <div className="text-2xl font-bold text-amber-300 font-mono mt-1">
            {formatCurrency(annualTotal)}
          </div>
          <span className="text-[11px] text-zinc-500 mt-1 block">
            Projected 12-month recurring cash outflow
          </span>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800">
          <span className="text-xs text-zinc-400 font-medium">Auto-Renew Status</span>
          <div className="text-2xl font-bold text-emerald-400 mt-1">
            All Monitored
          </div>
          <span className="text-[11px] text-emerald-400/80 mt-1 block">
            7-day prior push alerts enabled
          </span>
        </div>
      </div>

      {/* Subscriptions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subscriptions.map((sub) => {
          const daysUntil = Math.ceil(
            (new Date(sub.nextBillingDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24)
          );
          const isUrgent = daysUntil <= 3 && daysUntil >= 0;

          return (
            <div
              key={sub.id}
              className={`p-5 rounded-2xl border transition-all ${
                sub.status === 'paused'
                  ? 'bg-zinc-950/40 border-zinc-800/50 opacity-60'
                  : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-zinc-100">{sub.name}</h4>
                    <span className="text-[10px] text-zinc-500">{sub.category}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => toggleSubscriptionStatus(sub.id)}
                    className="p-1 text-zinc-400 hover:text-zinc-200"
                    title={sub.status === 'active' ? 'Pause Subscription' : 'Activate Subscription'}
                  >
                    {sub.status === 'active' ? (
                      <PauseCircle className="w-4 h-4" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    )}
                  </button>
                  <button
                    onClick={() => deleteSubscription(sub.id)}
                    className="p-1 text-zinc-500 hover:text-rose-400"
                    title="Delete Subscription"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Price & Cadence */}
              <div className="my-3 flex items-baseline justify-between">
                <div>
                  <span className="text-xl font-bold font-mono text-zinc-100">
                    {formatCurrency(sub.amount, sub.currency)}
                  </span>
                  <span className="text-xs text-zinc-400 ml-1">/ {sub.billingCycle}</span>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                  {sub.status}
                </span>
              </div>

              {/* Renewal Alert Box */}
              <div
                className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                  isUrgent
                    ? 'bg-rose-950/30 border-rose-500/30 text-rose-300'
                    : 'bg-zinc-950/60 border-zinc-800/60 text-zinc-400'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {daysUntil > 0
                      ? `Renews in ${daysUntil} days`
                      : daysUntil === 0
                      ? 'Renews Today'
                      : `Passed (${sub.nextBillingDate})`}
                  </span>
                </div>
                <button
                  onClick={() => handleTestReminder(sub)}
                  className="text-[10px] text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <Bell className="w-3 h-3" />
                  <span>Alert</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Subscription Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <h3 className="text-base font-bold text-zinc-100">Track New Subscription</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">
                  Service / Tool Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. AWS, Figma, Midjourney, Netflix..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">
                    Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-sm font-bold text-zinc-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">
                    Currency
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-2.5 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
                  >
                    {SUPPORTED_CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">
                    Billing Cycle
                  </label>
                  <select
                    value={billingCycle}
                    onChange={(e) => setBillingCycle(e.target.value as any)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-2.5 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="annual">Annual</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">
                    Next Billing Date
                  </label>
                  <input
                    type="date"
                    value={nextBillingDate}
                    onChange={(e) => setNextBillingDate(e.target.value)}
                    required
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-zinc-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold shadow-md shadow-emerald-500/20 cursor-pointer"
                >
                  Save Subscription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
