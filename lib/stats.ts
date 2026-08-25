import { EXPENSE_CATEGORIES, type Category, type Transaction } from "./types";
import { monthKey, type YearMonth } from "./month";

export function filterByMonth(
  transactions: Transaction[],
  ym: YearMonth
): Transaction[] {
  const key = monthKey(ym);
  return transactions.filter((t) => t.date.startsWith(key));
}

export function sumByType(
  transactions: Transaction[],
  type: "income" | "expense"
): number {
  return transactions
    .filter((t) => t.type === type)
    .reduce((sum, t) => sum + t.amount, 0);
}

export interface CategoryAmount {
  category: Category;
  amount: number;
}

export function expenseByCategory(transactions: Transaction[]): CategoryAmount[] {
  const totals = new Map<Category, number>();
  for (const t of transactions) {
    if (t.type !== "expense") continue;
    totals.set(t.category, (totals.get(t.category) ?? 0) + t.amount);
  }
  // Fixed category order (never re-sorted by hue/color), but ranked by amount for display.
  return EXPENSE_CATEGORIES.map((category) => ({
    category,
    amount: totals.get(category) ?? 0,
  })).sort((a, b) => b.amount - a.amount);
}

/** Percent change from previous to current. Null when previous is 0 (no meaningful baseline). */
export function percentChange(current: number, previous: number): number | null {
  if (previous === 0) return null;
  return ((current - previous) / previous) * 100;
}

export function fixedVariableSplit(transactions: Transaction[]): {
  fixed: number;
  variable: number;
} {
  return transactions
    .filter((t) => t.type === "expense")
    .reduce(
      (acc, t) => {
        if (t.costType === "fixed") acc.fixed += t.amount;
        else acc.variable += t.amount;
        return acc;
      },
      { fixed: 0, variable: 0 }
    );
}

export function savingsRate(income: number, expense: number): number | null {
  if (income === 0) return null;
  return ((income - expense) / income) * 100;
}
