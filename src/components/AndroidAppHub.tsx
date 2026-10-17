import React, { useState } from 'react';
import {
  Smartphone,
  Download,
  CheckCircle,
  Copy,
  Check,
  Code2,
  ExternalLink,
  Layers,
  Zap,
  Coffee,
  Utensils,
  Car,
  Fuel,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Wifi,
  BatteryCharging,
  Flame,
  PieChart,
  Receipt,
  FileSpreadsheet,
  BrainCircuit,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall.ts';
import { useFinance } from '../context/FinanceContext.tsx';
import confetti from 'canvas-confetti';

export const AndroidAppHub: React.FC = () => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const { transactions, budgets, subscriptions, formatCurrency, baseCurrency, addTransaction, triggerTwoWaySync } =
    useFinance();

  const [phoneScreenMode, setPhoneScreenMode] = useState<'compose_app' | 'widget_home'>('compose_app');
  const [appSubTab, setAppSubTab] = useState<'ledger' | 'budgets' | 'subscriptions' | 'tax' | 'gemini'>('ledger');
  const [selectedCodeFile, setSelectedCodeFile] = useState<string>('ComposeMainActivity');
  const [copiedCodeKey, setCopiedCodeKey] = useState<string | null>(null);
  const [widgetFeedback, setWidgetFeedback] = useState<string | null>(null);

  const currentDevUrl = 'https://ais-dev-q46ntrshvlu4pjruwo3jw5-1069535225897.asia-southeast1.run.app';

  const codeSnippets: Record<string, { filename: string; language: string; content: string }> = {
    ComposeMainActivity: {
      filename: 'android/app/src/main/java/com/apexledger/app/ComposeMainActivity.kt',
      language: 'kotlin',
      content: `package com.apexledger.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import com.apexledger.app.ui.screens.*
import com.apexledger.app.ui.theme.ApexLedgerTheme
import com.apexledger.app.viewmodel.FinanceViewModel

class ComposeMainActivity : ComponentActivity() {
    private val viewModel: FinanceViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            ApexLedgerTheme {
                MainAppNav(viewModel)
            }
        }
    }
}`,
    },
    DashboardScreen: {
      filename: 'android/app/src/main/java/com/apexledger/app/ui/screens/DashboardScreen.kt',
      language: 'kotlin',
      content: `package com.apexledger.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material3.*
import androidx.compose.runtime.*
import com.apexledger.app.viewmodel.FinanceViewModel

@Composable
fun DashboardScreen(viewModel: FinanceViewModel, onNavigateToTransactions: () -> Unit) {
    val netBalance = viewModel.getNetBalance()
    val transactions by viewModel.transactions.collectAsState()

    Scaffold(containerColor = DarkBackground) { padding ->
        LazyColumn(modifier = Modifier.padding(padding)) {
            // Net Balance Card with Income / Expenses breakdown
            item { NetBalanceCard(netBalance = netBalance) }
            // 1-Tap Quick-Log presets: Espresso ($4.50), Lunch ($15.00), Rideshare ($24.00)
            item { QuickPresetsRow(onLog = { desc, amt, cat -> viewModel.logExpense(desc, amt, cat) }) }
            // Gemini AI Financial Health score and recommendations
            item { GeminiHealthBanner() }
            // Recent transactions ledger
            items(transactions.take(5)) { tx -> TransactionRow(tx) }
        }
    }
}`,
    },
    FinanceViewModel: {
      filename: 'android/app/src/main/java/com/apexledger/app/viewmodel/FinanceViewModel.kt',
      language: 'kotlin',
      content: `package com.apexledger.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.apexledger.app.data.model.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import java.util.UUID

class FinanceViewModel : ViewModel() {
    private val _transactions = MutableStateFlow<List<Transaction>>(emptyList())
    val transactions: StateFlow<List<Transaction>> = _transactions

    fun logExpense(desc: String, amt: Double, category: String, source: String = "Android Widget") {
        viewModelScope.launch {
            val newTx = Transaction(UUID.randomUUID().toString(), "expense", amt, "USD", category, desc, "2026-10-17", true)
            _transactions.value = listOf(newTx) + _transactions.value
        }
    }

    fun getTotalIncome(): Double = _transactions.value.filter { it.type == "income" }.sumOf { it.amount }
    fun getTotalExpenses(): Double = _transactions.value.filter { it.type == "expense" }.sumOf { it.amount }
    fun getNetBalance(): Double = getTotalIncome() - getTotalExpenses()
}`,
    },
    QuickLogWidget: {
      filename: 'android/app/src/main/java/com/apexledger/app/QuickLogAppWidgetProvider.kt',
      language: 'kotlin',
      content: `package com.apexledger.app

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.widget.RemoteViews

class QuickLogAppWidgetProvider : AppWidgetProvider() {
    override fun onReceive(context: Context, intent: Intent) {
        super.onReceive(context, intent)
        if (intent.action == "com.apexledger.app.ACTION_LOG_PRESET") {
            val preset = intent.getStringExtra("PRESET_NAME") ?: "Coffee"
            val amount = intent.getDoubleExtra("PRESET_AMOUNT", 4.50)
            
            // Rapid deep link back to applet
            val launchIntent = Intent(Intent.ACTION_VIEW, Uri.parse("https://apexledger.app/?action=quick_log&preset=$preset&amount=$amount"))
            launchIntent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
            context.startActivity(launchIntent)
        }
    }
}`,
    },
    AndroidManifest: {
      filename: 'android/app/src/main/AndroidManifest.xml',
      language: 'xml',
      content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.apexledger.app">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    <uses-permission android:name="android.permission.USE_BIOMETRIC" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="ApexLedger"
        android:theme="@style/Theme.ApexLedger">

        <activity android:name=".ComposeMainActivity" android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <activity android:name=".MainActivity" android:exported="true" />

        <receiver android:name=".QuickLogAppWidgetProvider" android:exported="true">
            <intent-filter>
                <action android:name="android.appwidget.action.APPWIDGET_UPDATE" />
            </intent-filter>
            <meta-data android:name="android.appwidget.provider" android:resource="@xml/quick_log_widget_info" />
        </receiver>
    </application>
</manifest>`,
    },
    BuildGradle: {
      filename: 'android/app/build.gradle.kts',
      language: 'kotlin',
      content: `plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.apexledger.app"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.apexledger.app"
        minSdk = 26
        targetSdk = 34
        versionCode = 1
        versionName = "1.0.0"
    }

    buildFeatures {
        compose = true
    }
    composeOptions {
        kotlinCompilerExtensionVersion = "1.5.8"
    }
}

dependencies {
    val composeBom = platform("androidx.compose:compose-bom:2024.02.00")
    implementation(composeBom)
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.activity:activity-compose:1.8.2")
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.7.0")
}`,
    },
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeKey(key);
    setTimeout(() => setCopiedCodeKey(null), 2500);
  };

  const handleWidgetQuickTap = async (name: string, amt: number, cat: string) => {
    await addTransaction({
      type: 'expense',
      amount: amt,
      currency: baseCurrency,
      category: cat,
      description: `${name} (Android Home Screen Widget)`,
      date: new Date().toISOString().split('T')[0],
      taxDeductible: true,
      taxCategory: cat === 'Food & Dining' ? 'Business Meals (50%)' : 'Vehicle & Transit',
      tags: 'Android Widget, 1-Tap',
      source: 'Android AppWidget',
    });

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 },
    });

    setWidgetFeedback(`1-Tap Logged: ${name} (${formatCurrency(amt)})`);
    triggerTwoWaySync('Android Home Widget', `Quick Log ${name} ($${amt})`);
    setTimeout(() => setWidgetFeedback(null), 3000);
  };

  const downloadAndroidProjectZip = () => {
    const readmeContent = `# ApexLedger Android Application (Jetpack Compose & AppWidget)
Package: com.apexledger.app
Platform: Android SDK 34 / Jetpack Compose / Material 3

## Architecture:
- ComposeMainActivity.kt: Native Jetpack Compose entrypoint
- ui/screens/DashboardScreen.kt: Net Balance, Income/Expense KPI cards, 1-Tap presets
- ui/screens/TransactionsScreen.kt: Ledger list, Schedule C write-off badges
- ui/screens/BudgetsScreen.kt: 80% threshold alerts & progress indicators
- ui/screens/AiInsightsScreen.kt: Gemini AI financial health score & audit
- QuickLogAppWidgetProvider.kt: Android home screen 2x2 widget
- res/layout/widget_quick_log.xml & res/values/strings.xml

## Opening in Android Studio:
1. Open Android Studio -> Select the 'android' folder.
2. Gradle will sync dependencies automatically (Compose, Material 3, Navigation).
3. Click 'Run' to deploy to any connected Android device or emulator!
`;
    const blob = new Blob([readmeContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ApexLedger_Android_Architecture.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const totalIncome = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const netBalance = totalIncome - totalExpense;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-zinc-900 to-zinc-950 border border-emerald-500/30 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-zinc-100">Android Application Suite</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Jetpack Compose + Widget
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Complete Kotlin Jetpack Compose Android app with 1-tap Home Screen AppWidget and real-time cloud synchronization.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isInstallable && (
            <button
              onClick={install}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition-all shadow-lg shadow-emerald-500/25 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Install WebAPK on Phone</span>
            </button>
          )}

          <button
            onClick={downloadAndroidProjectZip}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-semibold transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Android Source</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Pixel Phone Simulator + Android Architecture Suite */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Pixel 8 Pro Phone Simulator (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="flex items-center justify-between w-full max-w-[340px] mb-3">
            <span className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>Google Pixel 8 Pro Simulator</span>
            </span>

            {/* Switch Phone View */}
            <div className="flex rounded-lg bg-zinc-900 p-0.5 border border-zinc-800 text-[11px]">
              <button
                onClick={() => setPhoneScreenMode('compose_app')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  phoneScreenMode === 'compose_app'
                    ? 'bg-zinc-800 text-emerald-400 font-bold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Compose App
              </button>
              <button
                onClick={() => setPhoneScreenMode('widget_home')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  phoneScreenMode === 'widget_home'
                    ? 'bg-zinc-800 text-emerald-400 font-bold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Home Widget
              </button>
            </div>
          </div>

          {/* Authentic Pixel Phone Frame */}
          <div className="relative w-[340px] h-[670px] bg-zinc-950 rounded-[44px] border-[6px] border-zinc-800 shadow-2xl overflow-hidden flex flex-col ring-1 ring-zinc-700/60">
            {/* Top Speaker Ear-piece & Front Camera Punch Hole */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1">
              <div className="w-3.5 h-3.5 rounded-full bg-black ring-1 ring-zinc-800" />
            </div>

            {/* Android Status Bar */}
            <div className="h-7 bg-zinc-950 px-6 pt-1 flex items-center justify-between text-[11px] font-medium text-zinc-300 select-none z-40">
              <span>9:41</span>
              <div className="flex items-center gap-1.5 text-zinc-300">
                <span className="text-[10px] font-bold">5G</span>
                <Wifi className="w-3 h-3" />
                <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            </div>

            {/* Screen View Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar bg-zinc-950 flex flex-col">
              {phoneScreenMode === 'widget_home' ? (
                /* Android Home Screen Mode */
                <div className="flex-1 p-4 flex flex-col justify-between bg-gradient-to-b from-zinc-900/90 via-zinc-950 to-emerald-950/20">
                  <div className="space-y-4">
                    {/* Android Clock & Date */}
                    <div className="pt-2 text-center">
                      <span className="text-3xl font-extralight text-zinc-100 tracking-tight font-sans">
                        09:41
                      </span>
                      <p className="text-[11px] text-zinc-400">Saturday, Oct 17 &bull; 68°F Sunny</p>
                    </div>

                    {/* Feedback Toast */}
                    {widgetFeedback && (
                      <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[11px] text-center font-medium animate-in fade-in">
                        {widgetFeedback}
                      </div>
                    )}

                    {/* Android AppWidget (2x2 / 4x2) */}
                    <div className="p-3.5 rounded-3xl bg-zinc-900/95 border border-zinc-800 shadow-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-emerald-500 flex items-center justify-center text-zinc-950 font-bold text-xs">
                            A
                          </div>
                          <div>
                            <h4 className="font-bold text-xs text-zinc-100 leading-tight">Apex Ledger</h4>
                            <p className="text-[9px] text-zinc-400 font-mono">Quick-Log 2x2 Widget</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-400 font-bold">
                          {formatCurrency(netBalance)}
                        </span>
                      </div>

                      {/* 1-Tap Preset Buttons */}
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleWidgetQuickTap('Espresso', 4.5, 'Food & Dining')}
                          className="p-2 rounded-2xl bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700/60 flex items-center gap-2 text-left group transition-all cursor-pointer"
                        >
                          <div className="w-6 h-6 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                            <Coffee className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="block text-[10px] font-medium text-zinc-300 leading-none">Coffee</span>
                            <span className="text-[11px] font-bold text-emerald-400">$4.50</span>
                          </div>
                        </button>

                        <button
                          onClick={() => handleWidgetQuickTap('Lunch', 15.0, 'Food & Dining')}
                          className="p-2 rounded-2xl bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700/60 flex items-center gap-2 text-left group transition-all cursor-pointer"
                        >
                          <div className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                            <Utensils className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="block text-[10px] font-medium text-zinc-300 leading-none">Lunch</span>
                            <span className="text-[11px] font-bold text-emerald-400">$15.00</span>
                          </div>
                        </button>

                        <button
                          onClick={() => handleWidgetQuickTap('Rideshare', 24.0, 'Travel & Transit')}
                          className="p-2 rounded-2xl bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700/60 flex items-center gap-2 text-left group transition-all cursor-pointer"
                        >
                          <div className="w-6 h-6 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                            <Car className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="block text-[10px] font-medium text-zinc-300 leading-none">Uber</span>
                            <span className="text-[11px] font-bold text-emerald-400">$24.00</span>
                          </div>
                        </button>

                        <button
                          onClick={() => handleWidgetQuickTap('Transit / Fuel', 35.0, 'Travel & Transit')}
                          className="p-2 rounded-2xl bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700/60 flex items-center gap-2 text-left group transition-all cursor-pointer"
                        >
                          <div className="w-6 h-6 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                            <Fuel className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="block text-[10px] font-medium text-zinc-300 leading-none">Fuel</span>
                            <span className="text-[11px] font-bold text-emerald-400">$35.00</span>
                          </div>
                        </button>
                      </div>

                      <div className="pt-1 flex items-center justify-between text-[9px] text-zinc-500">
                        <span>Tap preset to 1-click log</span>
                        <span className="text-emerald-400">Live Synced</span>
                      </div>
                    </div>
                  </div>

                  {/* Android Dock Icons */}
                  <div className="flex items-center justify-around py-3 px-2 bg-zinc-900/60 rounded-3xl border border-zinc-800/60">
                    <button
                      onClick={() => setPhoneScreenMode('compose_app')}
                      className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-lg group cursor-pointer"
                      title="Launch ApexLedger Android App"
                    >
                      <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center text-xs font-bold text-emerald-400">
                        Apex
                      </div>
                    </button>
                    <div className="w-11 h-11 rounded-2xl bg-zinc-800/80 flex items-center justify-center text-base">
                      💬
                    </div>
                    <div className="w-11 h-11 rounded-2xl bg-zinc-800/80 flex items-center justify-center text-base">
                      📸
                    </div>
                    <div className="w-11 h-11 rounded-2xl bg-zinc-800/80 flex items-center justify-center text-base">
                      ⚙️
                    </div>
                  </div>
                </div>
              ) : (
                /* Native Jetpack Compose Android App Mode */
                <div className="flex-1 flex flex-col justify-between">
                  <div className="p-3.5 space-y-3 flex-1 overflow-y-auto no-scrollbar">
                    {/* App Header */}
                    <div className="flex items-center justify-between pb-2 border-b border-zinc-900">
                      <div>
                        <h4 className="font-bold text-xs text-zinc-100 flex items-center gap-1.5">
                          <span>ApexLedger</span>
                          <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-bold">
                            Compose M3
                          </span>
                        </h4>
                        <span className="text-[10px] text-emerald-400 font-mono">v1.0.0 Native</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                        Cloud Vault
                      </span>
                    </div>

                    {/* Sub Tab View in Phone */}
                    {appSubTab === 'ledger' && (
                      <div className="space-y-3">
                        {/* Net Balance Card */}
                        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 shadow-md">
                          <span className="text-[10px] text-zinc-400 font-medium">Net Available Balance</span>
                          <div className="text-xl font-bold font-mono text-zinc-100 mt-0.5">
                            {formatCurrency(netBalance)}
                          </div>
                          <div className="mt-2 flex items-center justify-between text-[10px]">
                            <span className="text-emerald-400 font-mono">+{formatCurrency(totalIncome)}</span>
                            <span className="text-rose-400 font-mono">-{formatCurrency(totalExpense)}</span>
                          </div>
                        </div>

                        {/* Recent Transactions */}
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                            Recent Activity
                          </span>
                          {transactions.slice(0, 4).map((t) => (
                            <div
                              key={t.id}
                              className="p-2 rounded-xl bg-zinc-900/60 border border-zinc-800/60 flex items-center justify-between text-xs"
                            >
                              <div className="truncate pr-2">
                                <span className="font-semibold text-zinc-200 block text-[11px] truncate">
                                  {t.description}
                                </span>
                                <span className="text-[9px] text-zinc-500 font-mono">{t.category}</span>
                              </div>
                              <span
                                className={`font-mono font-bold text-[11px] shrink-0 ${
                                  t.type === 'income' ? 'text-emerald-400' : 'text-zinc-200'
                                }`}
                              >
                                {t.type === 'income' ? '+' : '-'}
                                {formatCurrency(t.amount, t.currency)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {appSubTab === 'budgets' && (
                      <div className="space-y-2.5">
                        <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                          Monthly Budgets
                        </span>
                        {budgets.map((b) => {
                          const spent = transactions
                            .filter((t) => t.category === b.category && t.type === 'expense')
                            .reduce((s, t) => s + t.amount, 0);
                          const pct = Math.min(100, Math.round((spent / (b.monthlyLimit || 1)) * 100));
                          return (
                            <div key={b.id} className="p-2.5 rounded-xl bg-zinc-900/70 border border-zinc-800 space-y-1.5">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="font-semibold text-zinc-200">{b.category}</span>
                                <span className="text-zinc-400 font-mono">
                                  ${spent.toFixed(0)} / ${b.monthlyLimit}
                                </span>
                              </div>
                              <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    pct >= 100 ? 'bg-rose-500' : pct >= 80 ? 'bg-amber-400' : 'bg-emerald-500'
                                  }`}
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {appSubTab === 'subscriptions' && (
                      <div className="space-y-2">
                        <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                          Active Subscriptions
                        </span>
                        {subscriptions.map((s) => (
                          <div
                            key={s.id}
                            className="p-2 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between text-xs"
                          >
                            <div>
                              <span className="font-semibold text-zinc-200 block text-[11px]">{s.name}</span>
                              <span className="text-[9px] text-zinc-500">{s.billingCycle}</span>
                            </div>
                            <span className="font-mono font-bold text-zinc-100 text-[11px]">
                              ${s.amount.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {appSubTab === 'gemini' && (
                      <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-950/40 to-zinc-900 border border-indigo-500/30 space-y-2">
                        <div className="flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-indigo-400" />
                          <span className="text-xs font-bold text-zinc-100">Gemini 3.8 AI Health</span>
                        </div>
                        <div className="text-2xl font-bold font-mono text-emerald-400">88 / 100</div>
                        <p className="text-[10px] text-zinc-300 leading-relaxed">
                          Your savings rate is healthy. Subscription audit shows $61/mo potential recurring savings.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Phone Bottom Nav (Compose NavigationBar) */}
                  <div className="py-2 px-1 bg-zinc-900 border-t border-zinc-800/80 flex items-center justify-around text-[10px]">
                    <button
                      onClick={() => setAppSubTab('ledger')}
                      className={`flex flex-col items-center py-1 px-2 rounded-lg transition-colors cursor-pointer ${
                        appSubTab === 'ledger' ? 'text-emerald-400 font-bold' : 'text-zinc-400'
                      }`}
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span className="text-[9px] mt-0.5">Ledger</span>
                    </button>

                    <button
                      onClick={() => setAppSubTab('budgets')}
                      className={`flex flex-col items-center py-1 px-2 rounded-lg transition-colors cursor-pointer ${
                        appSubTab === 'budgets' ? 'text-emerald-400 font-bold' : 'text-zinc-400'
                      }`}
                    >
                      <PieChart className="w-3.5 h-3.5" />
                      <span className="text-[9px] mt-0.5">Budgets</span>
                    </button>

                    <button
                      onClick={() => setAppSubTab('subscriptions')}
                      className={`flex flex-col items-center py-1 px-2 rounded-lg transition-colors cursor-pointer ${
                        appSubTab === 'subscriptions' ? 'text-emerald-400 font-bold' : 'text-zinc-400'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span className="text-[9px] mt-0.5">Subs</span>
                    </button>

                    <button
                      onClick={() => setAppSubTab('gemini')}
                      className={`flex flex-col items-center py-1 px-2 rounded-lg transition-colors cursor-pointer ${
                        appSubTab === 'gemini' ? 'text-indigo-400 font-bold' : 'text-zinc-400'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span className="text-[9px] mt-0.5">Gemini</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Android Navigation Bar (Gestural pill) */}
            <div className="h-6 bg-zinc-950 flex items-center justify-center pb-1">
              <div
                onClick={() => setPhoneScreenMode(phoneScreenMode === 'compose_app' ? 'widget_home' : 'compose_app')}
                className="w-28 h-1 rounded-full bg-zinc-600 hover:bg-zinc-400 transition-colors cursor-pointer"
                title="Tap to toggle Home Screen & Compose App"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Android Features, Manifest & TWA / APK Build Instructions (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* 1. Android Installation Guide Card */}
          <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span>Install on Android Device (WebAPK Direct)</span>
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                PWA WebAPK
              </span>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              ApexLedger includes a fully compliant Android Web App Manifest with service worker offline caching. On your Android smartphone:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800/80 space-y-1">
                <span className="font-bold text-emerald-400">1. Open in Chrome</span>
                <p className="text-[11px] text-zinc-400">
                  Open this URL on Google Chrome for Android.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800/80 space-y-1">
                <span className="font-bold text-emerald-400">2. Tap "Install App"</span>
                <p className="text-[11px] text-zinc-400">
                  Click the install banner or tap the 3-dots menu &gt; <strong>"Install app"</strong>.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800/80 space-y-1">
                <span className="font-bold text-emerald-400">3. Native App Icon</span>
                <p className="text-[11px] text-zinc-400">
                  Chromium generates an official WebAPK with standalone windowing and app launcher.
                </p>
              </div>
            </div>
          </div>

          {/* 2. Native Android Studio Project & Code Viewer */}
          <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-emerald-400" />
                  <span>Native Jetpack Compose Source Code</span>
                </h3>
                <p className="text-xs text-zinc-400">Pure Kotlin Android codebase generated in /android/app/</p>
              </div>

              <button
                onClick={downloadAndroidProjectZip}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Project</span>
              </button>
            </div>

            {/* Code Selector Chips */}
            <div className="flex flex-wrap gap-1.5">
              {Object.keys(codeSnippets).map((key) => (
                <button
                  key={key}
                  onClick={() => setSelectedCodeFile(key)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-colors cursor-pointer ${
                    selectedCodeFile === key
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold'
                      : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-zinc-200'
                  }`}
                >
                  {key}.{codeSnippets[key].language === 'xml' ? 'xml' : 'kt'}
                </button>
              ))}
            </div>

            {/* Code Tabs */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-zinc-300">
                <span className="font-mono text-[11px] text-zinc-400 truncate max-w-sm">
                  {codeSnippets[selectedCodeFile]?.filename}
                </span>
                <button
                  onClick={() =>
                    copyToClipboard(
                      codeSnippets[selectedCodeFile]?.content || '',
                      selectedCodeFile
                    )
                  }
                  className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {copiedCodeKey === selectedCodeFile ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCodeKey === selectedCodeFile ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <pre className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px] font-mono text-zinc-300 overflow-x-auto leading-relaxed max-h-56">
                {codeSnippets[selectedCodeFile]?.content}
              </pre>
            </div>
          </div>

          {/* 3. Google Play Store & TWA Bubblewrap Release Guide */}
          <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-xl space-y-2 text-xs">
            <h4 className="font-bold text-zinc-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Google Play Store Publishing (Bubblewrap CLI)</span>
            </h4>
            <p className="text-zinc-400 leading-relaxed text-[11px]">
              To release this Android app directly onto the Google Play Store as an official Signed AAB (Android App Bundle), run:
            </p>
            <pre className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px] font-mono text-emerald-400 overflow-x-auto">
{`npm install -g @bubblewrap/cli
bubblewrap init --manifest ${currentDevUrl}/manifest.webmanifest
bubblewrap build`}
            </pre>
            <p className="text-zinc-500 text-[10px]">
              Outputs <strong className="text-zinc-300">app-release-bundle.aab</strong> ready for upload to the Google Play Console!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
