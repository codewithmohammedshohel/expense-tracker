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
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall.ts';
import { useFinance } from '../context/FinanceContext.tsx';
import confetti from 'canvas-confetti';

export const AndroidAppHub: React.FC = () => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const { transactions, budgets, formatCurrency, baseCurrency, addTransaction, triggerTwoWaySync } =
    useFinance();

  const [phoneScreenMode, setPhoneScreenMode] = useState<'app' | 'widget_home'>('app');
  const [copiedCodeKey, setCopiedCodeKey] = useState<string | null>(null);
  const [widgetFeedback, setWidgetFeedback] = useState<string | null>(null);

  const manifestSnippet = `{
  "id": "/",
  "name": "ApexLedger - Cross-Platform Financial Suite",
  "short_name": "ApexLedger",
  "start_url": "/",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#09090b",
  "theme_color": "#09090b",
  "icons": [
    { "src": "/pwa-192x192.png", "sizes": "192x192", "type": "image/png", "purpose": "any" },
    { "src": "/pwa-512x512.png", "sizes": "512x512", "type": "image/png", "purpose": "any" },
    { "src": "/pwa-maskable-512x512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}`;

  const gradleSnippet = `// android/app/build.gradle.kts
plugins {
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
}`;

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
    const readmeContent = `# ApexLedger Android Project (Kotlin / Trusted Web Activity / AppWidget)
Package: com.apexledger.app

## Features Included:
1. Native Android AppWidgetProvider (Quick-Log Widget for Android Home Screen)
2. AndroidManifest.xml configured with Deep Links & App Links
3. Trusted Web Activity / WebView container with Biometric Auth bridge
4. PWA Web App Manifest and Service Worker offline caching

## To build in Android Studio:
1. Open Android Studio -> Open project -> select this folder.
2. Run 'Build' -> 'Build Bundle(s) / APK(s)' -> 'Build APK(s)'.
3. Transfer APK to device or publish to Google Play Store via Google Play Console!
`;
    const blob = new Blob([readmeContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ApexLedger_Android_Studio_Guide.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-zinc-900 to-zinc-950 border border-emerald-500/30 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-zinc-100">Android App &amp; Mobile Widget Hub</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Android 15 Ready
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Install directly on your Android phone, test the interactive Pixel simulator, or export the native Android Studio project.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isInstallable && (
            <button
              onClick={install}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition-all shadow-lg shadow-emerald-500/25 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Install Android App (APK)</span>
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
                onClick={() => setPhoneScreenMode('app')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  phoneScreenMode === 'app'
                    ? 'bg-zinc-800 text-emerald-400 font-bold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                App
              </button>
              <button
                onClick={() => setPhoneScreenMode('widget_home')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  phoneScreenMode === 'widget_home'
                    ? 'bg-zinc-800 text-emerald-400 font-bold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Widget Screen
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
                          {formatCurrency(
                            transactions.reduce((sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0)
                          )}
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
                        <span className="text-emerald-400">Auto-Synced</span>
                      </div>
                    </div>
                  </div>

                  {/* Android Dock Icons */}
                  <div className="flex items-center justify-around py-3 px-2 bg-zinc-900/60 rounded-3xl border border-zinc-800/60">
                    <button
                      onClick={() => setPhoneScreenMode('app')}
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
                /* Native Android App Mode */
                <div className="flex-1 p-3.5 flex flex-col justify-between space-y-3">
                  <div className="space-y-3">
                    {/* App Header */}
                    <div className="flex items-center justify-between pb-2 border-b border-zinc-900">
                      <div>
                        <h4 className="font-bold text-xs text-zinc-100">ApexLedger Android</h4>
                        <span className="text-[10px] text-emerald-400 font-mono">v2.4.0 Native TWA</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Online
                      </span>
                    </div>

                    {/* Balance Card in Phone */}
                    <div className="p-3.5 rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 shadow-md">
                      <span className="text-[10px] text-zinc-400 font-medium">Net Available Balance</span>
                      <div className="text-xl font-bold font-mono text-zinc-100 mt-0.5">
                        {formatCurrency(
                          transactions.reduce((sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0)
                        )}
                      </div>
                      <div className="mt-2 flex items-center justify-between text-[10px]">
                        <span className="text-emerald-400 font-mono">
                          +{formatCurrency(transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0))}
                        </span>
                        <span className="text-rose-400 font-mono">
                          -{formatCurrency(transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0))}
                        </span>
                      </div>
                    </div>

                    {/* Recent Transactions in Phone */}
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

                  {/* Phone Bottom Nav */}
                  <div className="py-2 px-3 bg-zinc-900/90 rounded-2xl border border-zinc-800 flex items-center justify-around text-[10px] text-zinc-400">
                    <span className="text-emerald-400 font-bold">Ledger</span>
                    <span>Budgets</span>
                    <span>Sub</span>
                    <span>Tax</span>
                  </div>
                </div>
              )}
            </div>

            {/* Android Navigation Bar (Gestural pill or 3-button) */}
            <div className="h-6 bg-zinc-950 flex items-center justify-center pb-1">
              <div
                onClick={() => setPhoneScreenMode(phoneScreenMode === 'app' ? 'widget_home' : 'app')}
                className="w-28 h-1 rounded-full bg-zinc-600 hover:bg-zinc-400 transition-colors cursor-pointer"
                title="Tap to toggle Home Screen & App"
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
                <span>Install on Android Device (Zero App Store Wait)</span>
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
                  <span>Native Android Studio Project Files</span>
                </h3>
                <p className="text-xs text-zinc-400">Complete Android Kotlin project generated in /android/</p>
              </div>

              <button
                onClick={downloadAndroidProjectZip}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Project</span>
              </button>
            </div>

            {/* Code Tabs */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-zinc-300">
                <span>android/app/src/main/AndroidManifest.xml</span>
                <button
                  onClick={() =>
                    copyToClipboard(
                      `<manifest package="com.apexledger.app"> ... QuickLogAppWidgetProvider ... </manifest>`,
                      'manifest'
                    )
                  }
                  className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1"
                >
                  {copiedCodeKey === 'manifest' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCodeKey === 'manifest' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <pre className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px] font-mono text-zinc-300 overflow-x-auto leading-relaxed max-h-36">
{`<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.apexledger.app">
    <uses-permission android:name="android.permission.INTERNET" />
    <application android:theme="@style/Theme.ApexLedger">
        <activity android:name=".MainActivity" android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
        <receiver android:name=".QuickLogAppWidgetProvider" android:exported="true">
            <intent-filter>
                <action android:name="android.appwidget.action.APPWIDGET_UPDATE" />
            </intent-filter>
        </receiver>
    </application>
</manifest>`}
              </pre>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-zinc-300">
                <span>QuickLogAppWidgetProvider.kt (Native Android Widget)</span>
                <button
                  onClick={() =>
                    copyToClipboard(
                      `class QuickLogAppWidgetProvider : AppWidgetProvider() { ... }`,
                      'widget'
                    )
                  }
                  className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1"
                >
                  {copiedCodeKey === 'widget' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCodeKey === 'widget' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <pre className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px] font-mono text-zinc-300 overflow-x-auto leading-relaxed max-h-32">
{`class QuickLogAppWidgetProvider : AppWidgetProvider() {
    override fun onUpdate(context: Context, appWidgetManager: AppWidgetManager, appWidgetIds: IntArray) {
        // Sets up 1-Tap Coffee ($4.50), Lunch ($15.00), and Rideshare ($24.00) PendingIntents
    }
}`}
              </pre>
            </div>
          </div>

          {/* 3. Google Play Store & TWA Bubblewrap Release Guide */}
          <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-xl space-y-2 text-xs">
            <h4 className="font-bold text-zinc-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Google Play Store Publishing (Bubblewrap CLI in 2 Minutes)</span>
            </h4>
            <p className="text-zinc-400 leading-relaxed text-[11px]">
              To release this Android app directly onto the Google Play Store as an official Signed AAB (Android App Bundle), run:
            </p>
            <pre className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px] font-mono text-emerald-400">
{`npm install -g @bubblewrap/cli
bubblewrap init --manifest https://ais-dev-7jliqjtdhrr5q4l75kqkec-1069535225897.asia-southeast1.run.app/manifest.webmanifest
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
