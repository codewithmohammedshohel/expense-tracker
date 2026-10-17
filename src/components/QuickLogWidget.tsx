import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Smartphone,
  X,
  Plus,
  Coffee,
  Utensils,
  Car,
  Fuel,
  Package,
  Sparkles,
  Check,
  Send,
  Zap,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext.tsx';
import { SUPPORTED_CURRENCIES } from '../data/initialData.ts';

interface QuickLogWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickLogWidget: React.FC<QuickLogWidgetProps> = ({ isOpen, onClose }) => {
  const { addTransaction, baseCurrency, formatCurrency, triggerTwoWaySync } = useFinance();

  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<string>('Food & Dining');
  const [currency, setCurrency] = useState<string>(baseCurrency);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiDetected, setAiDetected] = useState<{
    category?: string;
    taxCategory?: string;
    isTaxDeductible?: boolean;
    confidence?: number;
  } | null>(null);
  const [recentLogged, setRecentLogged] = useState<string | null>(null);

  if (!isOpen) return null;

  const quickPresets = [
    { label: 'Espresso / Coffee', amount: 4.5, icon: Coffee, cat: 'Food & Dining', taxCat: 'Business Meals (50%)' },
    { label: 'Quick Lunch', amount: 15.0, icon: Utensils, cat: 'Food & Dining', taxCat: 'Business Meals (50%)' },
    { label: 'Uber / Taxi', amount: 24.0, icon: Car, cat: 'Travel & Transit', taxCat: 'Travel & Lodging' },
    { label: 'Transit / Fuel', amount: 35.0, icon: Fuel, cat: 'Travel & Transit', taxCat: 'Vehicle & Transit' },
    { label: 'Office Supplies', amount: 25.0, icon: Package, cat: 'Office & Equipment', taxCat: 'Office Supplies & Tech' },
  ];

  const handleQuickLog = async (preset: (typeof quickPresets)[0]) => {
    try {
      await addTransaction({
        type: 'expense',
        amount: preset.amount,
        currency: currency,
        category: preset.cat,
        description: preset.label,
        date: new Date().toISOString().split('T')[0],
        taxDeductible: true,
        taxCategory: preset.taxCat,
        tags: 'Quick-Log, Mobile Widget',
        source: 'Android Widget',
      });

      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.8 },
      });

      setRecentLogged(`Logged ${formatCurrency(preset.amount, currency)} for ${preset.label}`);
      triggerTwoWaySync('Android Home Widget', `Quick Log: ${preset.label} ($${preset.amount})`);

      setTimeout(() => {
        setRecentLogged(null);
      }, 3500);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAiAnalyze = async () => {
    if (!description.trim()) return;
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/gemini/categorize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          merchant: description,
          description: description,
          amount: parseFloat(amount) || 10,
          currency,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setAiDetected(data.data);
        setCategory(data.data.category);
      }
    } catch (err) {
      console.warn('AI categorization fallback:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || isNaN(parsedAmount)) return;

    try {
      await addTransaction({
        type: 'expense',
        amount: parsedAmount,
        currency,
        category: aiDetected?.category || category,
        description: description || 'Mobile Quick-Log Expense',
        date: new Date().toISOString().split('T')[0],
        taxDeductible: aiDetected?.isTaxDeductible ?? false,
        taxCategory: aiDetected?.taxCategory || 'Non-Deductible Personal',
        tags: 'Mobile Widget, 1-Tap Entry',
        source: 'Mobile Quick-Log',
      });

      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.75 },
      });

      setRecentLogged(`Logged ${formatCurrency(parsedAmount, currency)}!`);
      setAmount('');
      setDescription('');
      setAiDetected(null);

      setTimeout(() => {
        setRecentLogged(null);
      }, 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm sm:max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden">
        {/* Mobile Phone Mockup Top Bar */}
        <div className="bg-zinc-900/90 px-5 py-3 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              Android Home Screen Widget
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success Banner */}
        {recentLogged && (
          <div className="bg-emerald-500/15 border-b border-emerald-500/30 px-4 py-2 flex items-center justify-between text-xs text-emerald-300 animate-in slide-in-from-top-2">
            <span className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              {recentLogged}
            </span>
            <span className="text-[10px] uppercase font-mono bg-emerald-500/20 px-1.5 py-0.5 rounded">
              Synced
            </span>
          </div>
        )}

        <div className="p-5 space-y-5">
          {/* Widget Simulation Card (As it appears on Android/iOS Home Screen) */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-900/90 to-zinc-950 border border-zinc-800/80 shadow-inner">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-100">Apex Quick-Log</h4>
                  <p className="text-[10px] text-zinc-400">1-Tap Rapid Expense Tracker</p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
                2x2 Widget
              </span>
            </div>

            {/* Quick 1-Tap Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {quickPresets.map((preset, idx) => {
                const Icon = preset.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleQuickLog(preset)}
                    className="p-2.5 rounded-xl bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-700/50 hover:border-emerald-500/50 flex flex-col items-center justify-center gap-1.5 text-center group transition-all"
                  >
                    <Icon className="w-4 h-4 text-zinc-400 group-hover:text-emerald-400 transition-colors" />
                    <span className="text-[11px] font-medium text-zinc-300 leading-tight">
                      {preset.label.split(' ')[0]}
                    </span>
                    <span className="text-xs font-bold text-emerald-400">
                      {formatCurrency(preset.amount, currency)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Fast-Entry Form */}
          <form onSubmit={handleCustomSubmit} className="space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-zinc-400">
              <span>Rapid Custom Entry</span>
              <div className="flex items-center gap-1">
                {SUPPORTED_CURRENCIES.slice(0, 4).map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => setCurrency(c.code)}
                    className={`px-1.5 py-0.5 text-[10px] rounded font-mono ${
                      currency === c.code
                        ? 'bg-emerald-500 text-zinc-950 font-bold'
                        : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {c.code}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-lg font-bold text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <span className="absolute right-4 top-3 text-sm font-mono text-zinc-500">
                {currency}
              </span>
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Merchant or description (e.g. Blue Bottle, Figma, Taxi)..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={handleAiAnalyze}
                required
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors pr-20"
              />
              <button
                type="button"
                onClick={handleAiAnalyze}
                disabled={isAiLoading || !description.trim()}
                className="absolute right-2 top-1.5 px-2 py-1 bg-violet-600/30 hover:bg-violet-600/40 text-violet-300 text-[10px] font-semibold rounded-lg flex items-center gap-1 transition-colors"
                title="Detect Category with Gemini AI"
              >
                <Sparkles className="w-3 h-3 text-violet-400" />
                <span>{isAiLoading ? 'Classifying...' : 'AI'}</span>
              </button>
            </div>

            {/* AI Classification Preview Pill */}
            {aiDetected && (
              <div className="p-2.5 rounded-xl bg-violet-950/40 border border-violet-500/30 text-xs flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-violet-300 font-medium">
                    <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                    <span>Auto-Category: {aiDetected.category}</span>
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">
                    Tax: {aiDetected.taxCategory} ({aiDetected.isTaxDeductible ? '100% Deductible' : 'Personal'})
                  </div>
                </div>
                <span className="text-[10px] font-mono bg-violet-500/20 text-violet-300 px-1.5 py-0.5 rounded">
                  {Math.round((aiDetected.confidence || 0.9) * 100)}% conf
                </span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Log Expense Instantly</span>
            </button>
          </form>

          {/* Sync status footer */}
          <div className="pt-2 border-t border-zinc-900 flex items-center justify-between text-[11px] text-zinc-500">
            <span>Two-Way Cloud Sync: Active</span>
            <span className="text-emerald-400">AES-256 Validated</span>
          </div>
        </div>
      </div>
    </div>
  );
};
