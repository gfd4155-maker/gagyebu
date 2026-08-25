"use client";

import { EXPENSE_CATEGORIES, EXPENSE_CATEGORY_COLORS, type Budget, type ExpenseCategory } from "@/lib/types";
import { expenseByCategory } from "@/lib/stats";
import { formatCurrency } from "@/lib/format";
import type { Transaction } from "@/lib/types";

interface BudgetProgressProps {
  current: Transaction[];
  totalExpense: number;
  budget: Budget;
  onSetTotalBudget: (total: number | null) => void;
  onSetCategoryBudget: (category: ExpenseCategory, amount: number | null) => void;
}

function barColor(pct: number) {
  if (pct >= 100) return "bg-[#ff4e67]";
  if (pct >= 80) return "bg-amber-500";
  return "bg-[#006a61]";
}

export default function BudgetProgress({
  current,
  totalExpense,
  budget,
  onSetTotalBudget,
  onSetCategoryBudget,
}: BudgetProgressProps) {
  const categoryTotals = new Map(
    expenseByCategory(current).map((c) => [c.category, c.amount])
  );

  const totalPct = budget.total ? Math.round((totalExpense / budget.total) * 100) : null;

  return (
    <div className="rounded-2xl bg-white p-4 shadow-[0_4px_20px_rgba(30,41,59,0.05)] sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-base font-semibold text-slate-800">월 예산</h3>
        <label className="flex items-center gap-2 text-xs text-slate-500">
          전체 예산
          <input
            type="number"
            min={0}
            placeholder="설정 안 함"
            value={budget.total ?? ""}
            onChange={(e) =>
              onSetTotalBudget(e.target.value === "" ? null : Number(e.target.value))
            }
            className="w-28 rounded-lg border border-slate-200 px-2 py-1 text-right text-sm focus:border-[#091426] focus:outline-none focus:ring-2 focus:ring-[#091426]/15"
          />
          원
        </label>
      </div>

      {budget.total ? (
        <div className="mt-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">
              현재 지출 {formatCurrency(totalExpense)} / 예산 {formatCurrency(budget.total)}
            </span>
            <span
              className={`font-semibold ${
                (totalPct ?? 0) >= 100
                  ? "text-[#ff4e67]"
                  : (totalPct ?? 0) >= 80
                    ? "text-amber-600"
                    : "text-slate-700"
              }`}
            >
              {totalPct}% 사용
            </span>
          </div>
          <div className="mt-1.5 h-3 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full transition-all ${barColor(totalPct ?? 0)}`}
              style={{ width: `${Math.min(100, totalPct ?? 0)}%` }}
            />
          </div>
        </div>
      ) : (
        <p className="mt-3 text-sm text-slate-400">
          전체 예산을 설정하면 사용률을 확인할 수 있어요.
        </p>
      )}

      <details className="mt-4 group">
        <summary className="cursor-pointer text-sm font-medium text-slate-600 select-none">
          카테고리별 예산 설정
        </summary>
        <ul className="mt-3 flex flex-col gap-3">
          {EXPENSE_CATEGORIES.map((category) => {
            const spent = categoryTotals.get(category) ?? 0;
            const catBudget = budget.byCategory[category] ?? null;
            const pct = catBudget ? Math.round((spent / catBudget) * 100) : null;

            return (
              <li key={category}>
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                  <span className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: EXPENSE_CATEGORY_COLORS[category] }}
                      aria-hidden
                    />
                    {category}
                  </span>
                  <label className="flex items-center gap-1 text-xs text-slate-500">
                    <input
                      type="number"
                      min={0}
                      placeholder="미설정"
                      value={catBudget ?? ""}
                      onChange={(e) =>
                        onSetCategoryBudget(
                          category,
                          e.target.value === "" ? null : Number(e.target.value)
                        )
                      }
                      className="w-24 rounded-lg border border-slate-200 px-2 py-1 text-right text-sm focus:border-[#091426] focus:outline-none focus:ring-2 focus:ring-[#091426]/15"
                    />
                    원
                  </label>
                </div>
                {catBudget && (
                  <>
                    <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${barColor(pct ?? 0)}`}
                        style={{ width: `${Math.min(100, pct ?? 0)}%` }}
                      />
                    </div>
                    <p className="mt-0.5 text-right text-xs text-slate-400">
                      {formatCurrency(spent)} / {formatCurrency(catBudget)} ({pct}%)
                    </p>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      </details>
    </div>
  );
}
