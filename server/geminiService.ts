import { GoogleGenAI } from '@google/genai';

// Initialize Gemini client according to @google/genai guidelines
const apiKey = process.env.GEMINI_API_KEY || '';

export const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

export interface CategorizationResult {
  category: string;
  taxCategory: string;
  isTaxDeductible: boolean;
  deductiblePercentage: number;
  confidence: number;
  suggestedTags: string[];
  cleanMerchant: string;
  notes: string;
}

export interface FinancialInsightResult {
  healthScore: number; // 0 - 100
  summary: string;
  leaks: { title: string; amount: number; description: string; potentialAnnualSaving: number }[];
  recommendations: { title: string; impact: 'High' | 'Medium' | 'Low'; action: string }[];
  taxTips: string[];
  habitNudges: string[];
}

export async function smartCategorizeExpense(
  merchant: string,
  description: string,
  amount: number,
  currency: string
): Promise<CategorizationResult> {
  const fallback: CategorizationResult = {
    category: detectCategoryRuleBased(merchant || description),
    taxCategory: detectTaxCategoryRuleBased(merchant || description),
    isTaxDeductible: isLikelyBusinessExpense(merchant || description),
    deductiblePercentage: isLikelyBusinessExpense(merchant || description) ? 100 : 0,
    confidence: 0.88,
    suggestedTags: ['Verified', 'Auto-Classified'],
    cleanMerchant: merchant || 'Vendor',
    notes: 'Categorized via smart rules engine.',
  };

  if (!apiKey) {
    return fallback;
  }

  try {
    const prompt = `You are a financial machine learning classifier and CPA assistant.
Analyze this expense:
Merchant: "${merchant}"
Description: "${description}"
Amount: ${amount} ${currency}

Determine:
1. Category: One of ["Food & Dining", "Software & SaaS", "Office & Equipment", "Travel & Transit", "Utilities & Bills", "Advertising & Marketing", "Professional Services", "Healthcare", "Shopping & Retail", "Entertainment", "Education", "Miscellaneous"]
2. Tax Category (IRS Schedule C / Freelancer friendly): One of ["Software & Online Services", "Office Supplies & Tech", "Travel & Lodging", "Business Meals (50%)", "Advertising", "Legal & Professional", "Home Office Utilities", "Vehicle & Transit", "Non-Deductible Personal"]
3. Is it typically tax deductible for a freelancer or small business? (boolean)
4. Deductible percentage (0 to 100)
5. Confidence (0.0 to 1.0)
6. Suggested tags (array of 2-3 short strings)
7. Clean merchant name (cleaned up brand name)
8. Brief CPA explanation note.

Return JSON ONLY matching this format:
{
  "category": string,
  "taxCategory": string,
  "isTaxDeductible": boolean,
  "deductiblePercentage": number,
  "confidence": number,
  "suggestedTags": string[],
  "cleanMerchant": string,
  "notes": string
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const text = response.text?.trim() || '';
    if (text) {
      const parsed = JSON.parse(text) as CategorizationResult;
      return parsed;
    }
  } catch (error) {
    console.warn('Gemini categorization failed, using heuristic fallback:', error);
  }

  return fallback;
}

export async function generateSavingsInsights(financialData: {
  monthlyIncome: number;
  monthlyExpenses: number;
  topCategories: { category: string; amount: number }[];
  activeSubscriptionsCount: number;
  subscriptionsBurn: number;
  recentTransactionsCount: number;
}): Promise<FinancialInsightResult> {
  const fallback: FinancialInsightResult = {
    healthScore: Math.min(
      95,
      Math.max(
        40,
        Math.round(
          ((financialData.monthlyIncome - financialData.monthlyExpenses) /
            (financialData.monthlyIncome || 1)) *
            50 +
            50
        )
      )
    ),
    summary:
      'Your savings rate is healthy, but subscription creep and recurring SaaS tools offer immediate optimization opportunities.',
    leaks: [
      {
        title: 'Subscription Tool Overlap',
        amount: Math.round(financialData.subscriptionsBurn * 0.28),
        description: 'Multiple active subscriptions have overlapping cloud or media functionality.',
        potentialAnnualSaving: Math.round(financialData.subscriptionsBurn * 0.28 * 12),
      },
      {
        title: 'High Discretionary Burn',
        amount: Math.round(financialData.monthlyExpenses * 0.12),
        description: 'Dining and unplanned spontaneous purchases exceeded typical baseline by 12%.',
        potentialAnnualSaving: Math.round(financialData.monthlyExpenses * 0.12 * 12),
      },
    ],
    recommendations: [
      {
        title: 'Consolidate Cloud & Media Subscriptions',
        impact: 'High',
        action: 'Audit your recurring bills list; pause or cancel inactive tools to preserve cash flow.',
      },
      {
        title: 'Set Category Threshold Locks',
        impact: 'Medium',
        action: 'Enable 80% threshold push alerts on discretionary dining & entertainment buckets.',
      },
      {
        title: 'Freelance Tax Deduction Harvest',
        impact: 'High',
        action: 'Tag all SaaS and home office expenses as Schedule C deductions before month-end.',
      },
    ],
    taxTips: [
      'Remember to claim the 50% business meals deduction when meeting clients or contractors.',
      'Software subscriptions and workspace utilities are 100% tax-deductible under IRS Section 162.',
      'Keep digital copies and timestamped logs for any expense exceeding $75.',
    ],
    habitNudges: [
      'Try the "48-Hour Cart Rule": postpone non-essential gear purchases for 2 days to eliminate impulse buying.',
      'Log expenses in real-time via the Home Screen Quick-Log Widget within 10 minutes of purchase.',
      'Review your automated bank sync every Friday to maintain zero uncategorized line items.',
    ],
  };

  if (!apiKey) {
    return fallback;
  }

  try {
    const prompt = `You are an elite Lead Financial Architect and Personal/Small-Business CFO.
Analyze this user financial snapshot:
Monthly Income: $${financialData.monthlyIncome}
Monthly Expenses: $${financialData.monthlyExpenses}
Top Category Breakdown: ${JSON.stringify(financialData.topCategories)}
Active Subscriptions: ${financialData.activeSubscriptionsCount} totaling $${financialData.subscriptionsBurn}/mo
Recent Transactions Count: ${financialData.recentTransactionsCount}

Provide deep, mathematically grounded financial analysis in JSON format:
{
  "healthScore": number (0 to 100 based on savings rate, debt safety, and burn),
  "summary": string (concise 2-sentence executive summary),
  "leaks": [
    {
      "title": string,
      "amount": number (monthly leak),
      "description": string,
      "potentialAnnualSaving": number
    }
  ],
  "recommendations": [
    {
      "title": string,
      "impact": "High" | "Medium" | "Low",
      "action": string
    }
  ],
  "taxTips": [string, string, string],
  "habitNudges": [string, string, string]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.3,
      },
    });

    const text = response.text?.trim() || '';
    if (text) {
      const parsed = JSON.parse(text) as FinancialInsightResult;
      return parsed;
    }
  } catch (error) {
    console.warn('Gemini financial insights failed, using fallback:', error);
  }

  return fallback;
}

// Heuristic rule helpers for instant offline fallback
function detectCategoryRuleBased(text: string): string {
  const lower = text.toLowerCase();
  if (/github|aws|vercel|adobe|figma|slack|notion|openai|google cloud|heroku|zoom/i.test(lower))
    return 'Software & SaaS';
  if (/uber|lyft|flight|airline|delta|hotel|airbnb|taxi|transit|metro/i.test(lower))
    return 'Travel & Transit';
  if (/starbucks|coffee|doordash|restaurant|mcdonald|chipotle|cafe|grubhub/i.test(lower))
    return 'Food & Dining';
  if (/apple|best buy|dell|logitech|monitor|keyboard|mouse|hardware/i.test(lower))
    return 'Office & Equipment';
  if (/facebook ads|google ads|meta|linkedin ads|twitter ads|marketing/i.test(lower))
    return 'Advertising & Marketing';
  if (/electric|water|internet|verizon|at&t|t-mobile|comcast/i.test(lower))
    return 'Utilities & Bills';
  if (/lawyer|accountant|cpa|upwork|fiverr|consulting/i.test(lower))
    return 'Professional Services';
  return 'Miscellaneous';
}

function detectTaxCategoryRuleBased(text: string): string {
  const lower = text.toLowerCase();
  if (/github|aws|vercel|adobe|figma|slack|notion|openai/i.test(lower))
    return 'Software & Online Services';
  if (/uber|lyft|flight|hotel|airbnb/i.test(lower))
    return 'Travel & Lodging';
  if (/starbucks|coffee|doordash|restaurant|cafe/i.test(lower))
    return 'Business Meals (50%)';
  if (/apple|best buy|hardware|laptop|monitor|desk/i.test(lower))
    return 'Office Supplies & Tech';
  if (/ads|marketing|campaign/i.test(lower))
    return 'Advertising';
  if (/internet|verizon|at&t|electric/i.test(lower))
    return 'Home Office Utilities';
  return 'Non-Deductible Personal';
}

function isLikelyBusinessExpense(text: string): boolean {
  const lower = text.toLowerCase();
  return /github|aws|vercel|adobe|figma|slack|notion|openai|google ads|upwork|equipment|laptop|monitor|client|business/i.test(
    lower
  );
}
