package com.apexledger.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.Dashboard
import androidx.compose.material.icons.filled.PieChart
import androidx.compose.material.icons.filled.ReceiptLong
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import com.apexledger.app.ui.screens.*
import com.apexledger.app.ui.theme.ApexLedgerTheme
import com.apexledger.app.ui.theme.DarkBackground
import com.apexledger.app.ui.theme.DarkSurface
import com.apexledger.app.ui.theme.EmeraldPrimary
import com.apexledger.app.ui.theme.TextMuted
import com.apexledger.app.ui.theme.TextSecondary
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
}

@Composable
fun MainAppNav(viewModel: FinanceViewModel) {
    var currentTab by remember { mutableStateOf("dashboard") }

    Scaffold(
        bottomBar = {
            NavigationBar(
                containerColor = DarkSurface
            ) {
                NavigationBarItem(
                    selected = currentTab == "dashboard",
                    onClick = { currentTab = "dashboard" },
                    icon = { Icon(Icons.Default.Dashboard, contentDescription = "Dashboard") },
                    label = { Text("Dashboard") },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = EmeraldPrimary,
                        selectedTextColor = EmeraldPrimary,
                        indicatorColor = EmeraldPrimary.copy(alpha = 0.15f),
                        unselectedIconColor = TextMuted,
                        unselectedTextColor = TextSecondary
                    )
                )

                NavigationBarItem(
                    selected = currentTab == "transactions",
                    onClick = { currentTab = "transactions" },
                    icon = { Icon(Icons.Default.ReceiptLong, contentDescription = "Ledger") },
                    label = { Text("Ledger") },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = EmeraldPrimary,
                        selectedTextColor = EmeraldPrimary,
                        indicatorColor = EmeraldPrimary.copy(alpha = 0.15f),
                        unselectedIconColor = TextMuted,
                        unselectedTextColor = TextSecondary
                    )
                )

                NavigationBarItem(
                    selected = currentTab == "budgets",
                    onClick = { currentTab = "budgets" },
                    icon = { Icon(Icons.Default.PieChart, contentDescription = "Budgets") },
                    label = { Text("Budgets") },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = EmeraldPrimary,
                        selectedTextColor = EmeraldPrimary,
                        indicatorColor = EmeraldPrimary.copy(alpha = 0.15f),
                        unselectedIconColor = TextMuted,
                        unselectedTextColor = TextSecondary
                    )
                )

                NavigationBarItem(
                    selected = currentTab == "ai",
                    onClick = { currentTab = "ai" },
                    icon = { Icon(Icons.Default.AutoAwesome, contentDescription = "Gemini") },
                    label = { Text("Gemini") },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = EmeraldPrimary,
                        selectedTextColor = EmeraldPrimary,
                        indicatorColor = EmeraldPrimary.copy(alpha = 0.15f),
                        unselectedIconColor = TextMuted,
                        unselectedTextColor = TextSecondary
                    )
                )
            }
        },
        containerColor = DarkBackground
    ) { padding ->
        Surface(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding),
            color = DarkBackground
        ) {
            when (currentTab) {
                "dashboard" -> DashboardScreen(
                    viewModel = viewModel,
                    onNavigateToTransactions = { currentTab = "transactions" },
                    onNavigateToBudgets = { currentTab = "budgets" }
                )
                "transactions" -> TransactionsScreen(
                    viewModel = viewModel,
                    onBack = { currentTab = "dashboard" }
                )
                "budgets" -> BudgetsScreen(
                    viewModel = viewModel,
                    onBack = { currentTab = "dashboard" }
                )
                "ai" -> AiInsightsScreen(
                    viewModel = viewModel,
                    onBack = { currentTab = "dashboard" }
                )
            }
        }
    }
}
