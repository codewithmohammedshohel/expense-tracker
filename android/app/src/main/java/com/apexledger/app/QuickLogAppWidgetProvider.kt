package com.apexledger.app

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.widget.RemoteViews

/**
 * Android Native Home Screen AppWidget Provider
 * Provides 1-tap rapid expense entry buttons directly on the Android home screen!
 */
class QuickLogAppWidgetProvider : AppWidgetProvider() {

    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        for (appWidgetId in appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId)
        }
    }

    override fun onReceive(context: Context, intent: Intent) {
        super.onReceive(context, intent)
        if (intent.action == ACTION_LOG_PRESET || intent.action == ACTION_QUICK_LOG) {
            val preset = intent.getStringExtra("PRESET_NAME") ?: "Coffee"
            val amount = intent.getDoubleExtra("PRESET_AMOUNT", 4.50)

            // Trigger deep link into applet to log the micro-expense
            val launchIntent = Intent(Intent.ACTION_VIEW, Uri.parse("https://apexledger.app/?action=quick_log&preset=$preset&amount=$amount")).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
            }
            context.startActivity(launchIntent)

            // Force widget UI refresh
            val manager = AppWidgetManager.getInstance(context)
            val ids = manager.getAppWidgetIds(ComponentName(context, QuickLogAppWidgetProvider::class.java))
            onUpdate(context, manager, ids)
        }
    }

    companion object {
        const val ACTION_LOG_PRESET = "com.apexledger.app.ACTION_LOG_PRESET"
        const val ACTION_QUICK_LOG = "com.apexledger.app.ACTION_QUICK_LOG"

        fun updateAppWidget(
            context: Context,
            appWidgetManager: AppWidgetManager,
            appWidgetId: Int
        ) {
            val views = RemoteViews(context.packageName, R.layout.widget_quick_log)

            // Setup Coffee ($4.50) PendingIntent
            val coffeeIntent = Intent(context, QuickLogAppWidgetProvider::class.java).apply {
                action = ACTION_LOG_PRESET
                putExtra("PRESET_NAME", "Espresso")
                putExtra("PRESET_AMOUNT", 4.50)
            }
            val coffeePendingIntent = PendingIntent.getBroadcast(
                context, 101, coffeeIntent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
            views.setOnClickPendingIntent(R.id.btn_widget_coffee, coffeePendingIntent)

            // Setup Lunch ($15.00) PendingIntent
            val lunchIntent = Intent(context, QuickLogAppWidgetProvider::class.java).apply {
                action = ACTION_LOG_PRESET
                putExtra("PRESET_NAME", "Lunch")
                putExtra("PRESET_AMOUNT", 15.00)
            }
            val lunchPendingIntent = PendingIntent.getBroadcast(
                context, 102, lunchIntent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
            views.setOnClickPendingIntent(R.id.btn_widget_lunch, lunchPendingIntent)

            // Setup Rideshare ($24.00) PendingIntent
            val rideIntent = Intent(context, QuickLogAppWidgetProvider::class.java).apply {
                action = ACTION_LOG_PRESET
                putExtra("PRESET_NAME", "Rideshare")
                putExtra("PRESET_AMOUNT", 24.00)
            }
            val ridePendingIntent = PendingIntent.getBroadcast(
                context, 103, rideIntent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
            views.setOnClickPendingIntent(R.id.btn_widget_rideshare, ridePendingIntent)

            // Setup Launch Full App Intent
            val appIntent = Intent(context, MainActivity::class.java)
            val appPendingIntent = PendingIntent.getActivity(
                context, 0, appIntent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
            views.setOnClickPendingIntent(R.id.widget_header_container, appPendingIntent)

            appWidgetManager.updateAppWidget(appWidgetId, views)
        }
    }
}
