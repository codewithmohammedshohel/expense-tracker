package com.apexledger.app.data.model

data class Transaction(
    val id: String,
    val type: String, // "income" or "expense"
    val amount: Double,
    val currency: String = "USD",
    val category: String,
    val description: String,
    val date: String,
    val taxDeductible: Boolean = false,
    val taxCategory: String = "",
    val tags: String = "",
    val source: String = "Mobile"
)

data class Budget(
    val id: String,
    val category: String,
    val monthlyLimit: Double,
    val currency: String = "USD",
    val alertThreshold: Int = 80
)

data class Subscription(
    val id: String,
    val name: String,
    val amount: Double,
    val currency: String = "USD",
    val billingCycle: String = "monthly",
    val nextBillingDate: String,
    val category: String,
    val status: String = "active"
)

data class FinancialHealth(
    val score: Int = 88,
    val summary: String = "Strong cash flow margin. 2 recurring SaaS overlaps detected for optimization.",
    val monthlyBurn: Double = 3450.00,
    val monthlyIncome: Double = 6500.00,
    val taxDeductionsTotal: Double = 1420.00
)

data class SyncNode(
    val id: String,
    val platform: String,
    val status: String,
    val lastSync: String
)
