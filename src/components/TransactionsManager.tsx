import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Filter,
  Download,
  Trash2,
  Receipt,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  Tag,
  Calendar,
  X,
  CreditCard,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext.tsx';
import { Transaction, TransactionType } from '../types/finance.ts';
import { SUPPORTED_CURRENCIES } from '../data/initialData.ts';

const CATEGORIES = [
  'Software & SaaS',
  'Food & Dining',
  'Office & Equipment',
  'Travel & Transit',
  'Utilities & Bills',
  'Advertising & Marketing',
  'Professional Services',
  'Healthcare',
  'Shopping & Retail',
  'Client Retainer',
  'Consulting',
  'Miscellaneous',
];

const TAX_CATEGORIES = [
  'Software & Online Services',
  'Office Supplies & Tech',
  'Travel & Lodging',
  'Business Meals (50%)',
  'Advertising',
  'Legal & Professional',
  'Home Office Utilities',
  'Vehicle & Transit',
  'Business Income',
  'Non-Deductible Personal',
];

export const TransactionsManager: React.FC = () => {
  const {
    transactions,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    baseCurrency,
    formatCurrency,
    convertAmount,
  } = useFinance();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [taxOnlyFilter, setTaxOnlyFilter] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [formType, setFormType] = useState<TransactionType>('expense');
  const [formAmount, setFormAmount] = useState<string>('');
  const [formCurrency, setFormCurrency] = useState<string>(baseCurrency);
  const [formMerchant, setFormMerchant] = useState<string>('');
  const [formDescription, setFormDescription] = useState<string>('');
  const [formCategory, setFormCategory] = useState<string>('Software & SaaS');
  const [formTaxDeductible, setFormTaxDeductible] = useState<boolean>(true);
  const [formTaxCategory, setFormTaxCategory] = useState<string>('Software & Online Services');
  const [formTags, setFormTags] = useState<string>('');
  const [formDate, setFormDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isAiClassifying, setIsAiClassifying] = useState<boolean>(false);
  const [aiNote, setAiNote] = useState<string | null>(null);

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (typeFilter !== 'all' && t.type !== typeFilter) return false;
      if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;
      if (taxOnlyFilter && !t.taxDeductible) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesDesc = t.description?.toLowerCase().includes(query);
        const matchesCat = t.category.toLowerCase().includes(query);
        const matchesTags = t.tags?.toLowerCase().includes(query);
        const matchesSource = t.source?.toLowerCase().includes(query);
        if (!matchesDesc && !matchesCat && !matchesTags && !matchesSource) return false;
      }
      return true;
    });
  }, [transactions, typeFilter, categoryFilter, taxOnlyFilter, searchQuery]);

  // AI Categorization Trigger
  const handleAiCategorize = async () => {
    if (!formMerchant.trim() && !formDescription.trim()) return;
    setIsAiClassifying(true);
    try {
      const res = await fetch('/api/gemini/categorize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          merchant: formMerchant,
          description: formDescription || formMerchant,
          amount: parseFloat(formAmount) || 25,
          currency: formCurrency,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setFormCategory(data.data.category);
        setFormTaxCategory(data.data.taxCategory);
        setFormTaxDeductible(data.data.isTaxDeductible);
        if (data.data.suggestedTags?.length) {
          setFormTags(data.data.suggestedTags.join(', '));
        }
        setAiNote(`Gemini Classified (${Math.round((data.data.confidence || 0.9) * 100)}% confidence): ${data.data.notes}`);
      }
    } catch (err) {
      console.warn('AI error:', err);
    } finally {
      setIsAiClassifying(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(formAmount);
    if (!parsedAmount || isNaN(parsedAmount)) return;

    await addTransaction({
      type: formType,
      amount: parsedAmount,
      currency: formCurrency,
      originalAmount: formCurrency !== baseCurrency ? parsedAmount : undefined,
      originalCurrency: formCurrency !== baseCurrency ? formCurrency : undefined,
      category: formCategory,
      description: formMerchant ? `${formMerchant} - ${formDescription}` : formDescription,
      date: formDate,
      taxDeductible: formTaxDeductible,
      taxCategory: formTaxCategory,
      tags: formTags,
      source: 'Manual Entry',
    });

    setIsModalOpen(false);
    // Reset form
    setFormAmount('');
    setFormMerchant('');
    setFormDescription('');
    setFormTags('');
    setAiNote(null);
  };

  // CSV Export for Small Business & Tax Accounting
  const exportToCSV = () => {
    const headers = [
      'ID',
      'Date',
      'Type',
      'Description',
      'Category',
      'Amount',
      'Currency',
      'Amount_In_Base',
      'Base_Currency',
      'Tax_Deductible',
      'Schedule_C_Category',
      'Tags',
      'Source',
    ];
    const rows = filteredTransactions.map((t) => [
      t.id,
      t.date,
      t.type,
      `"${(t.description || '').replace(/"/g, '""')}"`,
      `"${t.category}"`,
      t.amount,
      t.currency,
      convertAmount(t.amount, t.currency, baseCurrency).toFixed(2),
      baseCurrency,
      t.taxDeductible ? 'YES' : 'NO',
      `"${t.taxCategory || ''}"`,
      `"${t.tags || ''}"`,
      `"${t.source || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `apex_ledger_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Search / Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-zinc-100">Daily Income &amp; Expense Ledger</h2>
          <p className="text-xs text-zinc-400 mt-1">
            Tracking {transactions.length} total entries &bull; Real-time multi-currency conversions &bull; Schedule C tags
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Transaction</span>
          </button>

          <button
            onClick={exportToCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-semibold transition-all cursor-pointer"
            title="Export filtered transactions as CSV for tax filing or CPA review"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by vendor, description, category, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Type Toggle */}
        <div className="flex items-center rounded-lg bg-zinc-950 p-1 border border-zinc-800">
          {(['all', 'income', 'expense'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1 rounded text-xs font-medium capitalize transition-colors ${
                typeFilter === t
                  ? 'bg-zinc-800 text-emerald-400 font-bold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Category Filter */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-emerald-500"
        >
          <option value="all">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Tax Deductible Toggle */}
        <button
          onClick={() => setTaxOnlyFilter(!taxOnlyFilter)}
          className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors ${
            taxOnlyFilter
              ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
              : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Receipt className="w-3.5 h-3.5" />
          <span>Tax Deductible Only</span>
        </button>
      </div>

      {/* Transactions Table / Stream */}
      <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950/80 text-zinc-400 uppercase text-[10px] tracking-wider border-b border-zinc-800">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Description &amp; Tags</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Tax Deductible</th>
                <th className="py-3 px-4 text-right">Amount (Original)</th>
                <th className="py-3 px-4 text-right">Base ({baseCurrency})</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-zinc-500 text-xs">
                    No transactions match your current filters.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => {
                  const inBase = convertAmount(tx.amount, tx.currency, baseCurrency);
                  const isDiffCurrency = tx.currency !== baseCurrency;
                  return (
                    <tr
                      key={tx.id}
                      className="hover:bg-zinc-800/40 transition-colors group"
                    >
                      {/* Date */}
                      <td className="py-3 px-4 text-zinc-400 whitespace-nowrap font-mono">
                        {tx.date}
                      </td>

                      {/* Description & Tags */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                              tx.type === 'income'
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : 'bg-rose-500/10 text-rose-400'
                            }`}
                          >
                            {tx.type === 'income' ? (
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            ) : (
                              <ArrowDownRight className="w-3.5 h-3.5" />
                            )}
                          </div>
                          <div>
                            <span className="font-semibold text-zinc-100 block">
                              {tx.description}
                            </span>
                            <div className="flex items-center gap-2 mt-0.5">
                              {tx.source && (
                                <span className="text-[10px] text-zinc-500 font-mono">
                                  {tx.source}
                                </span>
                              )}
                              {tx.tags && (
                                <span className="text-[10px] text-zinc-400 bg-zinc-800/80 px-1.5 py-0.2 rounded border border-zinc-700/50">
                                  {tx.tags}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 text-zinc-300">
                        <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700 text-[11px]">
                          {tx.category}
                        </span>
                      </td>

                      {/* Tax Deductible Status */}
                      <td className="py-3 px-4">
                        {tx.taxDeductible ? (
                          <div className="flex items-center gap-1.5 text-amber-300 text-[11px]">
                            <Receipt className="w-3.5 h-3.5 text-amber-400" />
                            <span>{tx.taxCategory || 'Schedule C'}</span>
                          </div>
                        ) : (
                          <span className="text-zinc-600 text-[11px]">&mdash;</span>
                        )}
                      </td>

                      {/* Amount in Original Currency */}
                      <td className="py-3 px-4 text-right font-mono font-medium text-zinc-200">
                        <span className={tx.type === 'income' ? 'text-emerald-400' : 'text-zinc-100'}>
                          {tx.type === 'income' ? '+' : '-'}
                          {formatCurrency(tx.amount, tx.currency)}
                        </span>
                        {isDiffCurrency && (
                          <span className="block text-[10px] text-zinc-500">
                            {tx.currency} original
                          </span>
                        )}
                      </td>

                      {/* Converted in Active Base Currency */}
                      <td className="py-3 px-4 text-right font-mono font-bold">
                        <span className={tx.type === 'income' ? 'text-emerald-400' : 'text-zinc-300'}>
                          {formatCurrency(inBase, baseCurrency)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => deleteTransaction(tx.id)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-zinc-800 transition-all"
                          title="Delete Transaction"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Transaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <h3 className="text-base font-bold text-zinc-100">Log New Transaction</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {/* Type Switcher */}
              <div className="flex rounded-xl bg-zinc-900 p-1 border border-zinc-800">
                <button
                  type="button"
                  onClick={() => setFormType('expense')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                    formType === 'expense'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Expense Outflow
                </button>
                <button
                  type="button"
                  onClick={() => setFormType('income')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                    formType === 'income'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Income Inflow
                </button>
              </div>

              {/* Amount and Currency */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                    Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    required
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-sm font-bold text-zinc-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                    Currency
                  </label>
                  <select
                    value={formCurrency}
                    onChange={(e) => setFormCurrency(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-2.5 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
                  >
                    {SUPPORTED_CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code} ({c.symbol})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Merchant & Description */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                    Merchant / Payee
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. AWS, Figma, Uber, Client..."
                    value={formMerchant}
                    onChange={(e) => setFormMerchant(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    required
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-medium text-zinc-400">
                    Memo / Notes
                  </label>
                  <button
                    type="button"
                    onClick={handleAiCategorize}
                    disabled={isAiClassifying || (!formMerchant && !formDescription)}
                    className="text-[10px] text-violet-400 hover:text-violet-300 flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-violet-400" />
                    <span>{isAiClassifying ? 'Analyzing...' : 'Auto-Categorize with Gemini'}</span>
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="e.g. Q4 compute invoice, client dinner, equipment purchase..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* AI Classification Note */}
              {aiNote && (
                <div className="p-2.5 rounded-xl bg-violet-950/40 border border-violet-500/30 text-[11px] text-violet-300 flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-violet-400 shrink-0 mt-0.5" />
                  <span>{aiNote}</span>
                </div>
              )}

              {/* Category & Tax Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-2.5 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                    Schedule C Tax Category
                  </label>
                  <select
                    value={formTaxCategory}
                    onChange={(e) => setFormTaxCategory(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-2.5 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
                  >
                    {TAX_CATEGORIES.map((tc) => (
                      <option key={tc} value={tc}>
                        {tc}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tax Deductible Toggle */}
              <div className="flex items-center gap-2 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <input
                  type="checkbox"
                  id="taxDeductibleCheck"
                  checked={formTaxDeductible}
                  onChange={(e) => setFormTaxDeductible(e.target.checked)}
                  className="rounded text-emerald-500 focus:ring-0 bg-zinc-950 border-zinc-700"
                />
                <label
                  htmlFor="taxDeductibleCheck"
                  className="text-xs font-medium text-zinc-200 cursor-pointer"
                >
                  Mark as Small Business / Freelancer Tax Deductible
                </label>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Schedule C, Hardware, Retainer, Client A"
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
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
                  Save Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
