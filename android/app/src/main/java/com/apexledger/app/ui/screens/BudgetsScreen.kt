package com.apexledger.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.apexledger.app.ui.theme.*
import com.apexledger.app.viewmodel.FinanceViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun BudgetsScreen(
    viewModel: FinanceViewModel,
    onBack: () -> Unit
) {
    val budgets by viewModel.budgets.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Budget Control", color = TextPrimary, fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back", tint = TextPrimary)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = DarkBackground)
            )
        },
        containerColor = DarkBackground
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            item {
                Text(
                    "Monthly Category Budgets & 80% Push Alert Locks",
                    fontSize = 12.sp,
                    color = TextSecondary
                )
            }

            items(budgets) { b ->
                val spent = viewModel.getCategorySpent(b.category)
                val progress = (spent / b.monthlyLimit).coerceIn(0.0, 1.0).toFloat()
                val isExceeded = spent >= b.monthlyLimit
                val isWarning = progress >= 0.8f && !isExceeded

                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = DarkSurface)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(b.category, fontWeight = FontWeight.Bold, color = TextPrimary, fontSize = 14.sp)
                            Text(
                                String.format("$%.0f / $%.0f", spent, b.monthlyLimit),
                                fontSize = 12.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = if (isExceeded) RoseExpense else if (isWarning) AmberWarning else EmeraldPrimary
                            )
                        }

                        Spacer(modifier = Modifier.height(10.dp))

                        LinearProgressIndicator(
                            progress = { progress },
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(8.dp)
                                .clip(RoundedCornerShape(4.dp)),
                            color = if (isExceeded) RoseExpense else if (isWarning) AmberWarning else EmeraldPrimary,
                            trackColor = DarkSurfaceVariant
                        )

                        Spacer(modifier = Modifier.height(8.dp))

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(
                                if (isExceeded) "⚠️ Budget Limit Exceeded" else if (isWarning) "⚡ 80% Alert Triggered" else "✓ On Track",
                                fontSize = 10.sp,
                                color = if (isExceeded) RoseExpense else if (isWarning) AmberWarning else EmeraldPrimary
                            )
                            Text(
                                String.format("%.0f%% Used", progress * 100),
                                fontSize = 10.sp,
                                color = TextMuted
                            )
                        }
                    }
                }
            }
        }
    }
}
