package com.apexledger.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.apexledger.app.data.model.Budget
import com.apexledger.app.data.model.FinancialHealth
import com.apexledger.app.data.model.Subscription
import com.apexledger.app.data.model.Transaction
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import java.util.UUID

class FinanceViewModel : ViewModel() {

    private val _transactions = MutableStateFlow<List<Transaction>>(
        listOf(
            Transaction("1", "income", 5400.00, "USD", "Income", "Principal Client Retainer", "2026-10-01", false),
            Transaction("2", "expense", 120.00, "USD", "Software & SaaS", "AWS Cloud Infrastructure", "2026-10-03", true, "Software & Online Services", "Cloud, Dev"),
            Transaction("3", "expense", 4.50, "USD", "Food & Dining", "Espresso", "2026-10-15", true, "Business Meals (50%)", "1-Tap Widget"),
            Transaction("4", "expense", 15.00, "USD", "Food & Dining", "Lunch with Client", "2026-10-16", true, "Business Meals (50%)", "Meeting"),
            Transaction("5", "expense", 24.00, "USD", "Travel & Transit", "Uber Airport Transfer", "2026-10-16", true, "Vehicle & Transit", "Travel")
        )
    )
    val transactions: StateFlow<List<Transaction>> = _transactions.asStateFlow()

    private val _budgets = MutableStateFlow<List<Budget>>(
        listOf(
            Budget("b1", "Food & Dining", 600.0, "USD", 80),
            Budget("b2", "Software & SaaS", 450.0, "USD", 85),
            Budget("b3", "Travel & Transit", 350.0, "USD", 75),
            Budget("b4", "Office & Equipment", 500.0, "USD", 90)
        )
    )
    val budgets: StateFlow<List<Budget>> = _budgets.asStateFlow()

    private val _subscriptions = MutableStateFlow<List<Subscription>>(
        listOf(
            Subscription("s1", "Google Cloud / Workspace", 30.0, "USD", "monthly", "2026-11-01", "Software & SaaS"),
            Subscription("s2", "GitHub Copilot Enterprise", 39.0, "USD", "monthly", "2026-11-05", "Developer Tools"),
            Subscription("s3", "Figma Professional", 15.0, "USD", "monthly", "2026-11-12", "Design")
        )
    )
    val subscriptions: StateFlow<List<Subscription>> = _subscriptions.asStateFlow()

    private val _financialHealth = MutableStateFlow(FinancialHealth())
    val financialHealth: StateFlow<FinancialHealth> = _financialHealth.asStateFlow()

    fun logExpense(description: String, amount: Double, category: String, source: String = "Android Widget") {
        viewModelScope.launch {
            val newTx = Transaction(
                id = UUID.randomUUID().toString(),
                type = "expense",
                amount = amount,
                currency = "USD",
                category = category,
                description = description,
                date = "2026-10-17",
                taxDeductible = true,
                taxCategory = if (category == "Food & Dining") "Business Meals (50%)" else "Vehicle & Transit",
                tags = "Android 1-Tap",
                source = source
            )
            _transactions.value = listOf(newTx) + _transactions.value
        }
    }

    fun getTotalIncome(): Double = _transactions.value.filter { it.type == "income" }.sumOf { it.amount }
    fun getTotalExpenses(): Double = _transactions.value.filter { it.type == "expense" }.sumOf { it.amount }
    fun getNetBalance(): Double = getTotalIncome() - getTotalExpenses()

    fun getCategorySpent(cat: String): Double =
        _transactions.value.filter { it.category == cat && it.type == "expense" }.sumOf { it.amount }
}
