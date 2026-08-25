"use client";

import { useMemo, useState } from "react";
import LineChart from "./LineChart";
import { buildMonthlyAggregates } from "@/lib/aggregates";
import { monthsBetween, recentMonths, type YearMonth } from "@/lib/month";
import { EXPENSE_CATEGORIES, EXPENSE_CATEGORY_COLORS, type ExpenseCategory, type RecurringRule, type Transaction } from "@/lib/types";

interface TrendSectionProps {
  manualTransactions: Transaction[];
  rules: RecurringRule[];
  selected: YearMonth;
}

const PERIODS = [
  { key: "3", label: "3개월" },
  { key: "6", label: "6개월" },
  { key: "12", label: "1년" },
  { key: "all", label: "전체" },
] as const;

type PeriodKey = (typeof PERIODS)[number]["key"];

function earliestDataMonth(
  manualTransactions: Transaction[],
  rules: RecurringRule[],
  fallback: YearMonth
): YearMonth {
  let earliest: YearMonth | null = null;
  for (const t of manualTransactions) {
    const [year, month] = t.date.split("-").map(Number);
    const ym = { year, month };
    if (!earliest || monthsBetween(ym, earliest) > 0) earliest = ym;
  }
  for (const r of rules) {
    for (const entry of r.amountHistory) {
      if (!earliest || monthsBetween(entry.effectiveFrom, earliest) > 0) {
        earliest = entry.effectiveFrom;
      }
    }
  }
  return earliest ?? fallback;
}

export default function TrendSection({ manualTransactions, rules, selected }: TrendSectionProps) {
  const [period, setPeriod] = useState<PeriodKey>("6");
  const [category, setCategory] = useState<ExpenseCategory>(EXPENSE_CATEGORIES[0]);

  const months = useMemo(() => {
    if (period === "all") {
      const earliest = earliestDataMonth(manualTransactions, rules, selected);
      const count = Math.max(1, monthsBetween(earliest, selected) + 1);
      return recentMonths(selected, Math.min(count, 60));
    }
    return recentMonths(selected, Number(period));
  }, [period, manualTransactions, rules, selected]);

  const aggregates = useMemo(
    () => buildMonthlyAggregates(manualTransactions, rules, months),
    [manualTransactions, rules, months]
  );

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-base font-semibold text-slate-800">소비 추이</h3>
        <div className="flex gap-1 rounded-full bg-slate-100 p-1">
          {PERIODS.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => setPeriod(p.key)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                period === p.key ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-6">
        <section>
          <h4 className="text-sm font-medium text-slate-600">수입 / 지출</h4>
          <LineChart
            months={months}
            selected={selected}
            series={[
              { key: "income", label: "수입", color: "#2563eb", values: aggregates.map((a) => a.income) },
              { key: "expense", label: "지출", color: "#dc2626", values: aggregates.map((a) => a.expense) },
            ]}
          />
        </section>

        <section>
          <h4 className="text-sm font-medium text-slate-600">잔액(저축 가능 금액)</h4>
          <LineChart
            months={months}
            selected={selected}
            series={[
              { key: "balance", label: "잔액", color: "#0b0b0b", values: aggregates.map((a) => a.balance) },
            ]}
          />
        </section>

        <section>
          <h4 className="text-sm font-medium text-slate-600">고정비 / 변동비</h4>
          <LineChart
            months={months}
            selected={selected}
            series={[
              { key: "fixed", label: "고정비", color: "#4a3aa7", values: aggregates.map((a) => a.fixed) },
              { key: "variable", label: "변동비", color: "#94a3b8", values: aggregates.map((a) => a.variable) },
            ]}
          />
        </section>

        <section>
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-slate-600">카테고리별 소비</h4>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
              className="rounded-lg border border-slate-200 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
            >
              {EXPENSE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <LineChart
            months={months}
            selected={selected}
            series={[
              {
                key: category,
                label: category,
                color: EXPENSE_CATEGORY_COLORS[category],
                values: aggregates.map((a) => a.categoryTotals.get(category) ?? 0),
              },
            ]}
          />
        </section>
      </div>
    </div>
  );
}
