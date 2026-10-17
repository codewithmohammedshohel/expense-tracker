import React, { useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PiggyBank,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  RefreshCw,
  Plus,
  Receipt,
  CheckCircle,
  AlertTriangle,
  CreditCard,
  Building,
  Smartphone,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext.tsx';

interface DashboardOverviewProps {
  onOpenAddTransaction: () => void;
  onOpenQuickLog: () => void;
  onOpenAiInsights: () => void;
  setActiveTab: (tab: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  onOpenAddTransaction,
  onOpenQuickLog,
  onOpenAiInsights,
  setActiveTab,
}) => {
  const {
    transactions,
    budgets,
    subscriptions,
    formatCurrency,
    convertAmount,
    baseCurrency,
    triggerBankSync,
    isSyncingBank,
  } = useFinance();

  // Aggregate monthly stats in current active baseCurrency
  const { totalIncome, totalExpenses, netBalance, savingsRate, taxDeductibleTotal, categoryTotals } =
    useMemo(() => {
      let income = 0;
      let expenses = 0;
      let taxDeductible = 0;
      const catMap: Record<string, number> = {};

      transactions.forEach((tx) => {
        const val = convertAmount(tx.amount, tx.currency, baseCurrency);
        if (tx.type === 'income') {
          income += val;
        } else {
          expenses += val;
          catMap[tx.category] = (catMap[tx.category] || 0) + val;
          if (tx.taxDeductible) {
            taxDeductible += val;
          }
        }
      });

      const net = income - expenses;
      const rate = income > 0 ? Math.max(0, Math.round((net / income) * 100)) : 0;

      // Sort categories by spend
      const sortedCats = Object.entries(catMap)
        .map(([category, amount]) => ({ category, amount }))
        .sort((a, b) => b.amount - a.amount);

      return {
        totalIncome: income,
        totalExpenses: expenses,
        netBalance: net,
        savingsRate: rate,
        taxDeductibleTotal: taxDeductible,
        categoryTotals: sortedCats,
      };
    }, [transactions, convertAmount, baseCurrency]);

  // Subscriptions monthly burn
  const monthlySubscriptionBurn = useMemo(() => {
    return subscriptions
      .filter((s) => s.status === 'active')
      .reduce((sum, s) => {
        let monthly = s.amount;
        if (s.billingCycle === 'annual') monthly = s.amount / 12;
        if (s.billingCycle === 'quarterly') monthly = s.amount / 3;
        if (s.billingCycle === 'weekly') monthly = s.amount * 4.33;
        return sum + convertAmount(monthly, s.currency, baseCurrency);
      }, 0);
  }, [subscriptions, convertAmount, baseCurrency]);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner / Welcome & Quick Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-950 border border-zinc-800 shadow-xl">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-100 tracking-tight">
            Financial Health &amp; Expense Command
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Real-time multi-currency tracking, automated bank syncing, and tax deduction intelligence.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenAddTransaction}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Transaction</span>
          </button>

          <button
            onClick={() => triggerBankSync('Chase')}
            disabled={isSyncingBank}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-semibold transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncingBank ? 'animate-spin text-emerald-400' : ''}`} />
            <span>{isSyncingBank ? 'Syncing Bank...' : 'Sync Bank Feed'}</span>
          </button>

          <button
            onClick={onOpenAiInsights}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 text-xs font-semibold transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span>AI Savings Audit</span>
          </button>

          <button
            onClick={onOpenQuickLog}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs font-semibold transition-all cursor-pointer"
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span>Mobile Widget</span>
          </button>
        </div>
      </div>

      {/* KPI Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Inflow */}
        <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800/80 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Total Income</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xl sm:text-2xl font-bold text-zinc-100 font-mono">
              {formatCurrency(totalIncome)}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-400">
            <ArrowUpRight className="w-3 h-3" />
            <span>Active cycle revenue</span>
          </div>
        </div>

        {/* Total Outflow */}
        <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800/80 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Total Expenses</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xl sm:text-2xl font-bold text-zinc-100 font-mono">
              {formatCurrency(totalExpenses)}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-rose-400">
            <ArrowDownRight className="w-3 h-3" />
            <span>Burn rate across all accounts</span>
          </div>
        </div>

        {/* Net Cash Flow */}
        <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800/80 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Net Surplus</span>
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span
              className={`text-xl sm:text-2xl font-bold font-mono ${
                netBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {formatCurrency(netBalance)}
            </span>
          </div>
          <div className="mt-1 text-[11px] text-zinc-400">
            {netBalance >= 0 ? 'Positive cash generation' : 'Deficit burn warning'}
          </div>
        </div>

        {/* Savings Rate */}
        <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800/80 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Savings Rate</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <PiggyBank className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-bold text-zinc-100 font-mono">
              {savingsRate}%
            </span>
            <span className="text-[10px] text-zinc-400 font-medium">target: 30%+</span>
          </div>
          <div className="mt-1.5 w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                savingsRate >= 30 ? 'bg-emerald-400' : savingsRate >= 15 ? 'bg-amber-400' : 'bg-rose-400'
              }`}
              style={{ width: `${Math.min(100, savingsRate)}%` }}
            />
          </div>
        </div>

        {/* Tax Deductible Total */}
        <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800/80 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Tax Deductions</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xl sm:text-2xl font-bold text-amber-300 font-mono">
              {formatCurrency(taxDeductibleTotal)}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-400">
            <span>Est. ~{formatCurrency(taxDeductibleTotal * 0.3)} tax saved</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Charts & Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Cash Flow & Spending Distribution */}
        <div className="lg:col-span-2 space-y-6">
          {/* Income vs Expense Cash Flow Comparison Chart */}
          <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-zinc-100">Monthly Cash Flow Dynamic Chart</h3>
                <p className="text-xs text-zinc-400">Income vs Operating Burn breakdown</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5 text-zinc-300">
                  <span className="w-3 h-3 rounded bg-emerald-500" /> Income
                </span>
                <span className="flex items-center gap-1.5 text-zinc-300">
                  <span className="w-3 h-3 rounded bg-rose-500" /> Expenses
                </span>
              </div>
            </div>

            {/* Custom Interactive SVG/HTML Bar Flow */}
            <div className="space-y-4 pt-2">
              <div>
                <div className="flex justify-between text-xs font-medium mb-1.5">
                  <span className="text-zinc-300">Monthly Inflow</span>
                  <span className="font-mono font-bold text-emerald-400">{formatCurrency(totalIncome)}</span>
                </div>
                <div className="h-6 w-full bg-zinc-950 rounded-lg p-0.5 border border-zinc-800">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-md transition-all duration-700"
                    style={{ width: `${totalIncome > 0 ? 100 : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1.5">
                  <span className="text-zinc-300">Monthly Outflow (Burn)</span>
                  <span className="font-mono font-bold text-rose-400">{formatCurrency(totalExpenses)}</span>
                </div>
                <div className="h-6 w-full bg-zinc-950 rounded-lg p-0.5 border border-zinc-800">
                  <div
                    className="h-full bg-gradient-to-r from-rose-600 to-rose-400 rounded-md transition-all duration-700"
                    style={{
                      width: `${totalIncome > 0 ? Math.min(100, Math.round((totalExpenses / totalIncome) * 100)) : 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* 6-Month Momentum Trend Indicators */}
              <div className="pt-4 border-t border-zinc-800/80">
                <h4 className="text-xs font-semibold text-zinc-400 mb-3">6-Month Financial Momentum</h4>
                <div className="grid grid-cols-6 gap-2 text-center">
                  {[
                    { month: 'May', inc: 4800, exp: 3100 },
                    { month: 'Jun', inc: 5200, exp: 3400 },
                    { month: 'Jul', inc: 6100, exp: 3200 },
                    { month: 'Aug', inc: 5800, exp: 3600 },
                    { month: 'Sep', inc: 6700, exp: 3500 },
                    { month: 'Oct (Now)', inc: totalIncome, exp: totalExpenses },
                  ].map((m, idx) => {
                    const ratio = Math.round(((m.inc - m.exp) / m.inc) * 100);
                    return (
                      <div key={idx} className="p-2 rounded-xl bg-zinc-950/60 border border-zinc-800/50">
                        <div className="text-[11px] font-medium text-zinc-400">{m.month}</div>
                        <div className="mt-1 text-xs font-bold text-zinc-200 font-mono">
                          {formatCurrency(m.inc - m.exp).split('.')[0]}
                        </div>
                        <div className="mt-1 text-[10px] text-emerald-400 font-semibold">{ratio}% saved</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Top Spending Categories Breakdown */}
          <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-zinc-100">Category Spending Distribution</h3>
                <p className="text-xs text-zinc-400">Ranked by total monthly consumption</p>
              </div>
              <button
                onClick={() => setActiveTab('transactions')}
                className="text-xs text-emerald-400 hover:underline font-medium"
              >
                View all ledger
              </button>
            </div>

            <div className="space-y-3">
              {categoryTotals.slice(0, 5).map((cat, idx) => {
                const percentOfTotal = totalExpenses > 0 ? Math.round((cat.amount / totalExpenses) * 100) : 0;
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-zinc-200">{cat.category}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-zinc-400">{percentOfTotal}%</span>
                        <span className="font-mono font-bold text-zinc-100">{formatCurrency(cat.amount)}</span>
                      </div>
                    </div>
                    <div className="w-full bg-zinc-950 rounded-full h-2 overflow-hidden border border-zinc-800/60">
                      <div
                        className="h-full bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full transition-all duration-500"
                        style={{ width: `${percentOfTotal}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar: Category Budgets Progress & Subscriptions */}
        <div className="space-y-6">
          {/* Monthly Budgets Limits & Real-Time Progress Bars */}
          <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-zinc-100">Monthly Budget Limits</h3>
                <p className="text-xs text-zinc-400">Real-time progress bars &amp; alerts</p>
              </div>
              <button
                onClick={() => setActiveTab('budgets')}
                className="text-xs text-emerald-400 hover:underline font-medium"
              >
                Manage
              </button>
            </div>

            <div className="space-y-4">
              {budgets.slice(0, 4).map((b) => {
                const spent = transactions
                  .filter((t) => t.category === b.category && t.type === 'expense')
                  .reduce((sum, t) => sum + convertAmount(t.amount, t.currency, baseCurrency), 0);

                const percent = Math.round((spent / b.monthlyLimit) * 100);
                const isBreached = percent >= 100;
                const isWarning = percent >= b.alertThreshold && !isBreached;

                return (
                  <div key={b.id} className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/60 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-zinc-200">{b.category}</span>
                      <div className="flex items-center gap-1.5">
                        {isBreached ? (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                            <AlertTriangle className="w-2.5 h-2.5" /> Exceeded
                          </span>
                        ) : isWarning ? (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                            Warning ({b.alertThreshold}%)
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                            Safe
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isBreached ? 'bg-rose-500' : isWarning ? 'bg-amber-400' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, percent)}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[11px] text-zinc-400 font-mono">
                      <span>Spent: {formatCurrency(spent)}</span>
                      <span>Limit: {formatCurrency(b.monthlyLimit)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Subscriptions Card Snapshot */}
          <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-zinc-100">Recurring Subscriptions</h3>
                <p className="text-xs text-zinc-400">
                  Monthly burn: <span className="font-mono text-emerald-400 font-bold">{formatCurrency(monthlySubscriptionBurn)}</span>
                </p>
              </div>
              <button
                onClick={() => setActiveTab('subscriptions')}
                className="text-xs text-emerald-400 hover:underline font-medium"
              >
                View all ({subscriptions.length})
              </button>
            </div>

            <div className="space-y-2.5">
              {subscriptions.slice(0, 3).map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/60 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-300">
                      <CreditCard className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="font-medium text-zinc-200">{sub.name}</p>
                      <p className="text-[10px] text-zinc-500">Renews on {sub.nextBillingDate}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-zinc-100">
                      {formatCurrency(sub.amount, sub.currency)}
                    </span>
                    <span className="block text-[10px] text-zinc-500 capitalize">{sub.billingCycle}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Connected Banks Mini Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 text-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Building className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-zinc-200">Bank Feeds Linked</p>
                <p className="text-[10px] text-zinc-400">Chase &bull; Amex &bull; SVB</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('banks')}
              className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg font-medium text-[11px] transition-colors"
            >
              Manage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
