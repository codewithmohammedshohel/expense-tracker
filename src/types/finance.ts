export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  currency: string;
  originalAmount?: number;
  originalCurrency?: string;
  exchangeRate?: number;
  category: string;
  description: string;
  date: string; // YYYY-MM-DD
  taxDeductible: boolean;
  taxCategory?: string;
  tags?: string;
  source?: string;
  receiptUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Budget {
  id: string;
  userId: string;
  category: string;
  monthlyLimit: number;
  currency: string;
  alertThreshold: number; // percentage (e.g. 80)
  createdAt?: string;
  updatedAt?: string;
}

export interface Subscription {
  id: string;
  userId: string;
  name: string;
  amount: number;
  currency: string;
  billingCycle: 'monthly' | 'annual' | 'quarterly' | 'weekly';
  nextBillingDate: string; // YYYY-MM-DD
  category: string;
  status: 'active' | 'paused' | 'cancelled';
  autoRenew: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface BankConnection {
  id: string;
  userId: string;
  institutionName: string;
  institutionId?: string;
  accountMask: string;
  accountType?: string;
  syncStatus: 'active' | 'syncing' | 'error' | 'paused';
  lastSyncedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SyncDevice {
  id: string;
  userId: string;
  deviceId: string;
  deviceType: 'android' | 'ios' | 'desktop' | 'web_dashboard' | 'google_sites_endpoint';
  deviceName: string;
  lastActiveAt?: string;
  syncVersion?: number;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CloudBackup {
  id: string;
  userId: string;
  backupName: string;
  encryptedPayload: string;
  checksum: string;
  recordCount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface FinancialHealthReport {
  healthScore: number;
  summary: string;
  leaks: {
    title: string;
    amount: number;
    description: string;
    potentialAnnualSaving: number;
  }[];
  recommendations: {
    title: string;
    impact: 'High' | 'Medium' | 'Low';
    action: string;
  }[];
  taxTips: string[];
  habitNudges: string[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'alert' | 'success';
  timestamp: string;
  read: boolean;
  category?: string;
}

export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
  flag: string;
}
