import React, { useState } from 'react';
import {
  Plus,
  AlertTriangle,
  CheckCircle,
  ShieldCheck,
  TrendingUp,
  X,
  Trash2,
  BellRing,
  PieChart,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext.tsx';
import { Budget } from '../types/finance.ts';

const DEFAULT_CATEGORIES = [
  'Software & SaaS',
  'Food & Dining',
  'Office & Equipment',
  'Travel & Transit',
  'Utilities & Bills',
  'Advertising & Marketing',
  'Professional Services',
  'Healthcare',
  'Shopping & Retail',
  'Entertainment',
  'Miscellaneous',
];

export const BudgetsManager: React.FC = () => {
  const {
    budgets,
    addBudget,
    updateBudget,
    deleteBudget,
    getCategorySpent,
    formatCurrency,
    baseCurrency,
    addNotification,
  } = useFinance();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(DEFAULT_CATEGORIES[0]);
  const [limitAmount, setLimitAmount] = useState('');
  const [alertThreshold, setAlertThreshold] = useState(80);

  // Aggregate stats
  const totalBudgeted = budgets.reduce((sum, b) => sum + b.monthlyLimit, 0);
  const totalSpentAcrossBudgets = budgets.reduce((sum, b) => sum + getCategorySpent(b.category), 0);
  const overallPercent = totalBudgeted > 0 ? Math.round((totalSpentAcrossBudgets / totalBudgeted) * 100) : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(limitAmount);
    if (!parsed || isNaN(parsed)) return;

    // Check if category already has a budget
    const existing = budgets.find((b) => b.category === selectedCategory);
    if (existing) {
      await updateBudget(existing.id, {
        monthlyLimit: parsed,
        alertThreshold,
      });
    } else {
      await addBudget({
        category: selectedCategory,
        monthlyLimit: parsed,
        currency: baseCurrency,
        alertThreshold,
      });
    }

    setIsModalOpen(false);
    setLimitAmount('');
  };

  const handleTestAlert = (b: Budget) => {
    addNotification({
      title: `Threshold Breach Alert: ${b.category}`,
      message: `Simulated threshold alert for ${b.category} triggered at ${b.alertThreshold}% limit.`,
      type: 'warning',
      category: b.category,
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-zinc-100">Category Monthly Budget Limits</h2>
          <p className="text-xs text-zinc-400 mt-1">
            Dynamic threshold tracking &bull; Instant push alert triggers &bull; Real-time burn controls
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/20 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Set Category Limit</span>
        </button>
      </div>

      {/* Aggregate Overview Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-950 border border-zinc-800 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <span className="text-xs text-zinc-400 font-medium">Total Monthly Budget</span>
            <div className="text-xl font-bold text-zinc-100 font-mono mt-1">
              {formatCurrency(totalBudgeted)}
            </div>
          </div>
          <div>
            <span className="text-xs text-zinc-400 font-medium">Total Spent in Active Budgets</span>
            <div className="text-xl font-bold text-emerald-400 font-mono mt-1">
              {formatCurrency(totalSpentAcrossBudgets)}
            </div>
          </div>
          <div>
            <span className="text-xs text-zinc-400 font-medium">Remaining Safety Cushion</span>
            <div
              className={`text-xl font-bold font-mono mt-1 ${
                totalBudgeted - totalSpentAcrossBudgets >= 0 ? 'text-zinc-100' : 'text-rose-400'
              }`}
            >
              {formatCurrency(totalBudgeted - totalSpentAcrossBudgets)}
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div>
          <div className="flex justify-between text-xs font-semibold mb-1.5">
            <span className="text-zinc-300">Overall Budget Burn Progress</span>
            <span className="text-emerald-400 font-mono">{overallPercent}% Utilized</span>
          </div>
          <div className="w-full bg-zinc-950 rounded-full h-3 overflow-hidden p-0.5 border border-zinc-800">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                overallPercent >= 100
                  ? 'bg-rose-500'
                  : overallPercent >= 80
                  ? 'bg-amber-400'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-400'
              }`}
              style={{ width: `${Math.min(100, overallPercent)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Category Budgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {budgets.map((b) => {
          const spent = getCategorySpent(b.category);
          const percent = b.monthlyLimit > 0 ? Math.round((spent / b.monthlyLimit) * 100) : 0;
          const isOver = percent >= 100;
          const isWarning = percent >= b.alertThreshold && !isOver;

          return (
            <div
              key={b.id}
              className={`p-5 rounded-2xl border transition-all ${
                isOver
                  ? 'bg-rose-950/20 border-rose-500/40'
                  : isWarning
                  ? 'bg-amber-950/20 border-amber-500/40'
                  : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-sm text-zinc-100">{b.category}</span>
                <div className="flex items-center gap-2">
                  {isOver ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Over Budget
                    </span>
                  ) : isWarning ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                      <BellRing className="w-3 h-3" /> Alert ({percent}%)
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> On Track
                    </span>
                  )}

                  <button
                    onClick={() => deleteBudget(b.id)}
                    className="p-1 text-zinc-500 hover:text-rose-400 transition-colors"
                    title="Delete Category Budget"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5 my-3">
                <div className="w-full bg-zinc-950 rounded-full h-2.5 overflow-hidden border border-zinc-800/80">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isOver ? 'bg-rose-500' : isWarning ? 'bg-amber-400' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, percent)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] font-mono text-zinc-400">
                  <span>Spent: {formatCurrency(spent)}</span>
                  <span>Limit: {formatCurrency(b.monthlyLimit)}</span>
                </div>
              </div>

              {/* Threshold & Notification Status */}
              <div className="pt-3 border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-400">
                <span>Alert triggers at {b.alertThreshold}%</span>
                <button
                  onClick={() => handleTestAlert(b)}
                  className="text-[10px] text-emerald-400 hover:underline"
                >
                  Test Push Alert
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Set Category Limit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <h3 className="text-base font-bold text-zinc-100">Set Category Monthly Limit</h3>
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
                  Spending Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500"
                >
                  {DEFAULT_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">
                  Monthly Limit ({baseCurrency})
                </label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  placeholder="e.g. 500"
                  value={limitAmount}
                  onChange={(e) => setLimitAmount(e.target.value)}
                  required
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-sm font-bold text-zinc-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-zinc-400 mb-1">
                  <span>Threshold Alert Trigger</span>
                  <span className="font-mono text-emerald-400 font-bold">{alertThreshold}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  step="5"
                  value={alertThreshold}
                  onChange={(e) => setAlertThreshold(parseInt(e.target.value))}
                  className="w-full accent-emerald-500"
                />
                <span className="block text-[10px] text-zinc-500 mt-1">
                  Push notification dispatched when category reaches {alertThreshold}% of monthly cap.
                </span>
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
                  Save Budget Limit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
