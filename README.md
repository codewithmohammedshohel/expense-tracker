# ApexLedger - Cross-Platform Financial Intelligence & Android Application Suite

ApexLedger is a financial intelligence and budget suite rewritten with a **Native Android (Kotlin / Jetpack Compose / AppWidget)** architecture alongside cloud synchronization and Gemini AI insights.

## Android Architecture (`/android`)

- **Jetpack Compose UI (Material 3)**:
  - `ComposeMainActivity.kt`: Native Jetpack Compose entrypoint with M3 Navigation Bar.
  - `ui/screens/DashboardScreen.kt`: Net Available Balance, Income vs. Expense KPI metric cards, 1-Tap Quick-Log presets, and recent transaction feeds.
  - `ui/screens/TransactionsScreen.kt`: Filterable transactions ledger with IRS Schedule C tax deductibility categorization.
  - `ui/screens/BudgetsScreen.kt`: Category monthly budgets with 80% threshold warnings and real-time linear progress bars.
  - `ui/screens/AiInsightsScreen.kt`: Gemini AI financial health hygiene score (88/100) and automated spending leak optimizations.
- **Home Screen AppWidget**:
  - `QuickLogAppWidgetProvider.kt`: 2x2 home screen widget providing 1-tap rapid micro-expense logging (Coffee $4.50, Lunch $15.00, Rideshare $24.00, Fuel $35.00) without opening the app.
- **Theme & Styling**:
  - `ui/theme/Theme.kt`, `Color.kt`: Dark emerald aesthetic following M3 guidelines with dynamic contrast.
- **State Management**:
  - `viewmodel/FinanceViewModel.kt`: Coroutine StateFlow architecture managing reactive transaction logs, budgets, and balance calculations.
- **Android Manifest & Resources**:
  - `AndroidManifest.xml`: Configured with deep links, App Links, AppWidget receiver, and network permissions.
  - `res/values/strings.xml`, `colors.xml`, `themes.xml`, `res/layout/widget_quick_log.xml`.

## Web & Simulator Hub (`/src`)

- **Interactive Google Pixel 8 Pro Simulator**:
  - Test the Jetpack Compose app screens (Ledger, Budgets, Subscriptions, Gemini) and the Android Home Screen AppWidget in real-time.
- **WebAPK PWA Direct Installation**:
  - 1-click standalone installation on Android devices via Chrome.
- **Source Code Exporter**:
  - Export and download the complete native Android project bundle for Android Studio.
- **Cloud & AI Backend**:
  - Gemini 3.8 Flash automated expense categorization & financial audit.
  - Firebase Firestore cloud sync.
