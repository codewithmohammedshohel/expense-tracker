import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  X,
  TrendingDown,
  ShieldAlert,
  Lightbulb,
  CheckCircle,
  RefreshCw,
  Award,
  Zap,
  ArrowRight,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext.tsx';
import { FinancialHealthReport } from '../types/finance.ts';

interface AiInsightsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiInsightsModal: React.FC<AiInsightsModalProps> = ({ isOpen, onClose }) => {
  const { transactions, budgets, subscriptions, formatCurrency, convertAmount, baseCurrency } = useFinance();

  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<FinancialHealthReport | null>(null);

  const fetchInsights = async () => {
    setIsLoading(true);
    try {
      // Calculate inputs for Gemini
      let income = 0;
      let expenses = 0;
      const catMap: Record<string, number> = {};

      transactions.forEach((tx) => {
        const val = convertAmount(tx.amount, tx.currency, baseCurrency);
        if (tx.type === 'income') income += val;
        else {
          expenses += val;
          catMap[tx.category] = (catMap[tx.category] || 0) + val;
        }
      });

      const topCats = Object.entries(catMap)
        .map(([category, amount]) => ({ category, amount }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5);

      const subBurn = subscriptions
        .filter((s) => s.status === 'active')
        .reduce((sum, s) => sum + convertAmount(s.amount, s.currency, baseCurrency), 0);

      const res = await fetch('/api/gemini/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          monthlyIncome: income,
          monthlyExpenses: expenses,
          topCategories: topCats,
          activeSubscriptionsCount: subscriptions.filter((s) => s.status === 'active').length,
          subscriptionsBurn: subBurn,
          recentTransactionsCount: transactions.length,
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setReport(data.data);
      }
    } catch (err) {
      console.warn('Failed to load insights:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && !report) {
      fetchInsights();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-950/60 via-zinc-900 to-zinc-950 px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-violet-500/20 text-violet-300 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-violet-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                <span>Gemini Financial Health &amp; Savings Audit</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  gemini-3.8-flash
                </span>
              </h3>
              <p className="text-xs text-zinc-400">Automated spending leak detection &bull; Habit nudges &bull; Tax optimization</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {isLoading ? (
            <div className="py-16 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-violet-400 animate-spin mx-auto" />
              <p className="text-sm font-semibold text-zinc-200">Gemini 3.8 Flash is analyzing your financial trends...</p>
              <p className="text-xs text-zinc-500">Auditing subscription redundancies, category burn rates, and Schedule C tax buckets.</p>
            </div>
          ) : report ? (
            <>
              {/* Score & Summary Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-violet-950/30 via-zinc-900 to-zinc-950 border border-violet-500/30 flex flex-col sm:flex-row items-center gap-5">
                <div className="flex flex-col items-center justify-center w-24 h-24 rounded-2xl bg-zinc-900 border border-violet-500/40 p-2 shrink-0 shadow-lg">
                  <span className="text-[10px] uppercase font-bold text-violet-400 tracking-wider">Health</span>
                  <span className="text-3xl font-extrabold text-zinc-100 font-mono mt-0.5">
                    {report.healthScore}
                  </span>
                  <span className="text-[10px] text-zinc-400">/ 100</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-100 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-emerald-400" />
                    <span>Executive Ledger Health Evaluation</span>
                  </h4>
                  <p className="text-xs text-zinc-300 mt-1 leading-relaxed">{report.summary}</p>
                </div>
              </div>

              {/* Identified Spending Leaks */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <TrendingDown className="w-4 h-4 text-rose-400" />
                  <span>Identified Spending Leaks &amp; Redundancies</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {report.leaks?.map((leak, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-zinc-900/80 border border-rose-500/20 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-zinc-200">{leak.title}</span>
                        <span className="text-xs font-mono font-bold text-rose-400">
                          -{formatCurrency(leak.amount)}/mo
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">{leak.description}</p>
                      <div className="pt-1 text-[10px] text-emerald-400 font-mono">
                        Potential annual saving: ~{formatCurrency(leak.potentialAnnualSaving)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actionable Recommendations */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <span>High-Impact Recommendations</span>
                </h4>
                <div className="space-y-2">
                  {report.recommendations?.map((rec, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-start justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-1.5 py-0.2 rounded text-[10px] font-bold uppercase ${
                              rec.impact === 'High'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            }`}
                          >
                            {rec.impact} Impact
                          </span>
                          <span className="font-bold text-xs text-zinc-200">{rec.title}</span>
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">{rec.action}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Behavioral Habit Nudges & Tax Tips */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                  <span className="font-bold text-xs text-zinc-200 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Behavioral Financial Nudges</span>
                  </span>
                  <ul className="space-y-1.5 text-[11px] text-zinc-400 list-disc list-inside">
                    {report.habitNudges?.map((nudge, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {nudge}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                  <span className="font-bold text-xs text-zinc-200 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                    <span>CPA Freelancer Tax Notes</span>
                  </span>
                  <ul className="space-y-1.5 text-[11px] text-zinc-400 list-disc list-inside">
                    {report.taxTips?.map((tip, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div className="bg-zinc-900/90 px-6 py-3 border-t border-zinc-800 flex items-center justify-between text-xs">
          <button
            onClick={fetchInsights}
            disabled={isLoading}
            className="text-violet-400 hover:text-violet-300 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Re-Audit with Gemini</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
