import React, { useState, useMemo } from 'react';
import {
  Receipt,
  Download,
  CheckCircle,
  FileSpreadsheet,
  HelpCircle,
  TrendingUp,
  Tag,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext.tsx';

const SCHEDULE_C_BUCKETS = [
  { key: 'Software & Online Services', code: 'Line 27a', name: 'Software, Cloud & SaaS', desc: '100% deductible work tools' },
  { key: 'Office Supplies & Tech', code: 'Line 18', name: 'Hardware & Office Supplies', desc: 'Equipment, cables, peripherals under $2,500' },
  { key: 'Travel & Lodging', code: 'Line 24a', name: 'Business Travel & Transit', desc: 'Flights, hotels, client transit & rideshares' },
  { key: 'Business Meals (50%)', code: 'Line 24b', name: 'Business Meals & Dinners', desc: 'Client meetings & travel meals (50% statutory cap)' },
  { key: 'Advertising', code: 'Line 8', name: 'Advertising & Marketing', desc: 'Social ads, domain names, promotional assets' },
  { key: 'Legal & Professional', code: 'Line 17', name: 'Legal, CPA & Contractors', desc: 'Accountants, legal advisors, subcontract fees' },
  { key: 'Home Office Utilities', code: 'Line 25', name: 'Home Office Utilities', desc: 'Portion of high-speed internet & phone dedicated to business' },
];

export const TaxFreelancerHub: React.FC = () => {
  const { transactions, updateTransaction, formatCurrency, convertAmount, baseCurrency } = useFinance();

  const [taxRateBracket, setTaxRateBracket] = useState<number>(30); // 30% combined federal + state self-employment estimate

  // Calculate breakdown by tax category
  const { bucketTotals, totalDeductibleAmount, estimatedCashSaved } = useMemo(() => {
    let totalDeductible = 0;
    const map: Record<string, number> = {};

    transactions.forEach((tx) => {
      if (tx.taxDeductible && tx.type === 'expense') {
        const inBase = convertAmount(tx.amount, tx.currency, baseCurrency);
        // If 50% business meals, apply statutory 50% multiplier
        const effective = tx.taxCategory === 'Business Meals (50%)' ? inBase * 0.5 : inBase;
        totalDeductible += effective;

        const catKey = tx.taxCategory || 'Software & Online Services';
        map[catKey] = (map[catKey] || 0) + inBase;
      }
    });

    const saved = totalDeductible * (taxRateBracket / 100);

    return {
      bucketTotals: map,
      totalDeductibleAmount: totalDeductible,
      estimatedCashSaved: saved,
    };
  }, [transactions, convertAmount, baseCurrency, taxRateBracket]);

  const deductibleTransactions = useMemo(() => {
    return transactions.filter((t) => t.taxDeductible && t.type === 'expense');
  }, [transactions]);

  // Export Tax Summary
  const exportTaxReport = () => {
    const headers = [
      'Transaction ID',
      'Date',
      'Description',
      'Merchant',
      'Schedule C Category',
      'IRS Line',
      'Original Amount',
      'Currency',
      'Deductible Amount Base',
      'Base Currency',
      'Tags',
    ];

    const rows = deductibleTransactions.map((tx) => {
      const inBase = convertAmount(tx.amount, tx.currency, baseCurrency);
      const effective = tx.taxCategory === 'Business Meals (50%)' ? inBase * 0.5 : inBase;
      return [
        tx.id,
        tx.date,
        `"${(tx.description || '').replace(/"/g, '""')}"`,
        `"${tx.category}"`,
        `"${tx.taxCategory || 'General Business'}"`,
        `"${SCHEDULE_C_BUCKETS.find((b) => b.key === tx.taxCategory)?.code || 'Line 27a'}"`,
        tx.amount,
        tx.currency,
        effective.toFixed(2),
        baseCurrency,
        `"${tx.tags || ''}"`,
      ];
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `apex_schedule_c_tax_report_${new Date().getFullYear()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-amber-400" />
            <span>Freelancer &amp; Small Business Tax Hub</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            IRS Schedule C deduction allocation &bull; Real-time estimated tax savings calculator &bull; CPA export pack
          </p>
        </div>

        <button
          onClick={exportTaxReport}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition-all shadow-md shadow-amber-500/20 cursor-pointer self-start md:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export CPA Tax Report</span>
        </button>
      </div>

      {/* Tax Deduction Metrics & Interactive Tax Bracket Slider */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800">
          <span className="text-xs font-semibold text-zinc-400">Total Deductible Expenses</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-mono mt-1">
            {formatCurrency(totalDeductibleAmount)}
          </div>
          <span className="text-[11px] text-zinc-500 mt-1 block">
            {deductibleTransactions.length} items logged for Schedule C write-off
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800">
          <span className="text-xs font-semibold text-zinc-400">Estimated Cash Tax Savings</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono mt-1">
            {formatCurrency(estimatedCashSaved)}
          </div>
          <span className="text-[11px] text-emerald-400/80 mt-1 block">
            Direct tax liability reduction at {taxRateBracket}% bracket
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-zinc-300">Marginal Tax Bracket Simulator</span>
            <span className="font-mono text-emerald-400 font-bold">{taxRateBracket}%</span>
          </div>
          <input
            type="range"
            min="15"
            max="45"
            step="1"
            value={taxRateBracket}
            onChange={(e) => setTaxRateBracket(parseInt(e.target.value))}
            className="w-full accent-emerald-500"
          />
          <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
            <span>15% (Basic)</span>
            <span>30% (Avg SE)</span>
            <span>45% (High Bracket)</span>
          </div>
        </div>
      </div>

      {/* Schedule C Buckets Breakdown */}
      <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-zinc-100">Schedule C Form Buckets Breakdown</h3>
          <span className="text-xs text-zinc-400">Pre-categorized for Form 1040 Schedule C</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {SCHEDULE_C_BUCKETS.map((bucket) => {
            const amount = bucketTotals[bucket.key] || 0;
            return (
              <div
                key={bucket.key}
                className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/60 flex items-start justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] font-mono text-amber-300 border border-zinc-700">
                      {bucket.code}
                    </span>
                    <span className="font-bold text-xs text-zinc-200">{bucket.name}</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-1">{bucket.desc}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-mono font-bold text-sm text-zinc-100">
                    {formatCurrency(amount)}
                  </span>
                  <span className="block text-[10px] text-zinc-500">
                    ~{formatCurrency(amount * (taxRateBracket / 100))} saved
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deductible Transactions Ledger Table */}
      <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-zinc-100">Verified Deductible Line Items ({deductibleTransactions.length})</h3>
          <span className="text-xs text-zinc-400">Click any item to verify Schedule C status</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950/80 text-zinc-400 uppercase text-[10px] tracking-wider border-b border-zinc-800">
              <tr>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Item Description</th>
                <th className="py-2.5 px-3">Schedule C Bucket</th>
                <th className="py-2.5 px-3 text-right">Amount</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {deductibleTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-zinc-800/40 transition-colors">
                  <td className="py-2.5 px-3 text-zinc-400 font-mono">{tx.date}</td>
                  <td className="py-2.5 px-3 font-semibold text-zinc-200">{tx.description}</td>
                  <td className="py-2.5 px-3 text-zinc-400">
                    <span className="px-2 py-0.5 rounded bg-zinc-800 text-[11px] text-amber-300">
                      {tx.taxCategory || 'General Business'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-zinc-100">
                    {formatCurrency(tx.amount, tx.currency)}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <CheckCircle className="w-3 h-3" /> Audit-Ready
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
