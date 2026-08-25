import type { Category, RecurringRule, Transaction } from "./types";
import type { YearMonth } from "./month";
import { getMonthTransactions } from "./recurring";
import { expenseByCategory, fixedVariableSplit, savingsRate, sumByType } from "./stats";

export interface MonthAggregate {
  ym: YearMonth;
  transactions: Transaction[];
  income: number;
  expense: number;
  balance: number;
  fixed: number;
  variable: number;
  savingsRate: number | null;
  categoryTotals: Map<Category, number>;
}

export function buildMonthlyAggregates(
  manualTransactions: Transaction[],
  rules: RecurringRule[],
  months: YearMonth[]
): MonthAggregate[] {
  return months.map((ym) => {
    const transactions = getMonthTransactions(manualTransactions, rules, ym);
    const income = sumByType(transactions, "income");
    const expense = sumByType(transactions, "expense");
    const { fixed, variable } = fixedVariableSplit(transactions);
    const categoryTotals = new Map(
      expenseByCategory(transactions).map((c) => [c.category, c.amount])
    );

    return {
      ym,
      transactions,
      income,
      expense,
      balance: income - expense,
      fixed,
      variable,
      savingsRate: savingsRate(income, expense),
      categoryTotals,
    };
  });
}
