package com.apexledger.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.FilterList
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.apexledger.app.ui.theme.*
import com.apexledger.app.viewmodel.FinanceViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TransactionsScreen(
    viewModel: FinanceViewModel,
    onBack: () -> Unit
) {
    val transactions by viewModel.transactions.collectAsState()
    var selectedFilter by remember { mutableStateOf("all") }
    var showAddDialog by remember { mutableStateOf(false) }

    var descInput by remember { mutableStateOf("") }
    var amountInput by remember { mutableStateOf("") }
    var catInput by remember { mutableStateOf("Food & Dining") }

    val filteredList = when (selectedFilter) {
        "income" -> transactions.filter { it.type == "income" }
        "expense" -> transactions.filter { it.type == "expense" }
        "tax" -> transactions.filter { it.taxDeductible }
        else -> transactions
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Transactions Ledger", color = TextPrimary, fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back", tint = TextPrimary)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = DarkBackground)
            )
        },
        floatingActionButton = {
            FloatingActionButton(
                onClick = { showAddDialog = true },
                containerColor = EmeraldPrimary,
                contentColor = DarkBackground
            ) {
                Icon(Icons.Default.Add, contentDescription = "Add Transaction")
            }
        },
        containerColor = DarkBackground
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 16.dp)
        ) {
            // Filter Chips
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 8.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                listOf(
                    "all" to "All",
                    "expense" to "Expenses",
                    "income" to "Income",
                    "tax" to "Tax Deductible"
                ).forEach { (key, label) ->
                    val isSelected = selectedFilter == key
                    FilterChip(
                        selected = isSelected,
                        onClick = { selectedFilter = key },
                        label = { Text(label, fontSize = 11.sp) },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = EmeraldPrimary,
                            selectedLabelColor = DarkBackground,
                            containerColor = DarkSurface,
                            labelColor = TextSecondary
                        )
                    )
                }
            }

            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                items(filteredList) { tx ->
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp),
                        colors = CardDefaults.cardColors(containerColor = DarkSurface)
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(14.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = tx.description,
                                    fontSize = 13.sp,
                                    fontWeight = FontWeight.SemiBold,
                                    color = TextPrimary
                                )
                                Spacer(modifier = Modifier.height(2.dp))
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Text(
                                        text = "${tx.category} • ${tx.date}",
                                        fontSize = 10.sp,
                                        color = TextMuted
                                    )
                                    if (tx.taxDeductible) {
                                        Spacer(modifier = Modifier.width(6.dp))
                                        Text(
                                            "Tax Deductible",
                                            fontSize = 10.sp,
                                            color = EmeraldPrimary,
                                            fontWeight = FontWeight.Medium
                                        )
                                    }
                                }
                            }

                            Text(
                                text = (if (tx.type == "income") "+" else "-") + String.format("$%,.2f", tx.amount),
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Bold,
                                color = if (tx.type == "income") EmeraldPrimary else RoseExpense
                            )
                        }
                    }
                }
            }
        }

        if (showAddDialog) {
            AlertDialog(
                onDismissRequest = { showAddDialog = false },
                title = { Text("Log New Expense", color = TextPrimary) },
                text = {
                    Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                        OutlinedTextField(
                            value = descInput,
                            onValueChange = { descInput = it },
                            label = { Text("Description") },
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = EmeraldPrimary,
                                focusedLabelColor = EmeraldPrimary
                            )
                        )
                        OutlinedTextField(
                            value = amountInput,
                            onValueChange = { amountInput = it },
                            label = { Text("Amount ($)") },
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = EmeraldPrimary,
                                focusedLabelColor = EmeraldPrimary
                            )
                        )
                    }
                },
                confirmButton = {
                    Button(
                        onClick = {
                            val amt = amountInput.toDoubleOrNull() ?: 0.0
                            if (amt > 0 && descInput.isNotBlank()) {
                                viewModel.logExpense(descInput, amt, catInput, "Android App")
                                showAddDialog = false
                                descInput = ""
                                amountInput = ""
                            }
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = EmeraldPrimary)
                    ) {
                        Text("Save", color = DarkBackground)
                    }
                },
                dismissButton = {
                    TextButton(onClick = { showAddDialog = false }) {
                        Text("Cancel", color = TextSecondary)
                    }
                },
                containerColor = DarkSurface
            )
        }
    }
}
