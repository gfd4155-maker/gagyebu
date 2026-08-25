import type { YearMonth } from "./month";

export type TransactionType = "income" | "expense";

export const INCOME_CATEGORIES = ["급여", "부수입", "임대수입", "용돈", "기타"] as const;
export const EXPENSE_CATEGORIES = [
  "식비",
  "카페/간식",
  "교통",
  "쇼핑",
  "주거",
  "통신",
  "보험",
  "건강",
  "여가",
  "구독",
  "기타",
] as const;

export type IncomeCategory = (typeof INCOME_CATEGORIES)[number];
export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];
export type Category = IncomeCategory | ExpenseCategory;

// Categorical color assigned in fixed order, one per expense category (never cycled).
// First 8 slots come from the validated categorical ramp; the rest are best-effort
// supplementary hues (every bar always carries a direct text label too).
export const EXPENSE_CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  식비: "#2a78d6",
  "카페/간식": "#eb6834",
  교통: "#1baf7a",
  쇼핑: "#eda100",
  주거: "#e87ba4",
  통신: "#008300",
  보험: "#4a3aa7",
  건강: "#e34948",
  여가: "#0891b2",
  구독: "#6366f1",
  기타: "#6b7280",
};

export type CostType = "fixed" | "variable";

export interface Transaction {
  id: string;
  date: string; // YYYY-MM-DD
  type: TransactionType;
  amount: number;
  category: Category;
  memo: string;
  costType?: CostType; // only meaningful when type === "expense"; defaults to "variable"
  isRecurring?: boolean; // true for transactions derived from a recurring rule (never persisted)
  ruleId?: string; // source recurring rule, when isRecurring is true
}

export interface Budget {
  total: number | null;
  byCategory: Partial<Record<ExpenseCategory, number>>;
}

export const EMPTY_BUDGET: Budget = { total: null, byCategory: {} };

// ---- Recurring rules (기준정보) -------------------------------------------------

export type RuleStatus = "active" | "paused" | "ended";

/** One amount that applied from a given month onward, until superseded by a later entry. */
export interface RecurringAmountEntry {
  id: string;
  amount: number;
  effectiveFrom: YearMonth;
}

/** One status that applied from a given month onward, until superseded by a later entry. */
export interface RecurringStatusEvent {
  id: string;
  status: RuleStatus;
  effectiveFrom: YearMonth;
}

export interface RecurringRule {
  id: string;
  name: string;
  type: TransactionType;
  category: Category;
  dayOfMonth: number; // 1-28, clamped to the last day of shorter months
  amountHistory: RecurringAmountEntry[]; // sorted by effectiveFrom ascending
  statusEvents: RecurringStatusEvent[]; // sorted by effectiveFrom ascending
}
