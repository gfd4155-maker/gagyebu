"use client";

import { useMemo, useState } from "react";
import SummaryCards from "@/components/SummaryCards";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import MonthSelector from "@/components/MonthSelector";
import Tabs, { type TabKey } from "@/components/Tabs";
import CategoryBreakdown from "@/components/CategoryBreakdown";
import TrendSection from "@/components/TrendSection";
import BudgetProgress from "@/components/BudgetProgress";
import FixedVariableSplit from "@/components/FixedVariableSplit";
import Insights from "@/components/Insights";
import RecurringManager from "@/components/RecurringManager";
import { useTransactions } from "@/lib/useTransactions";
import { useBudget } from "@/lib/useBudget";
import { useRecurringRules } from "@/lib/useRecurringRules";
import { currentYearMonth, monthKey, nextMonth, prevMonth, recentMonths, type YearMonth } from "@/lib/month";
import { sumByType } from "@/lib/stats";
import { getMonthTransactions } from "@/lib/recurring";
import { buildMonthlyAggregates } from "@/lib/aggregates";
import { buildInsights } from "@/lib/insights";
import { todayISO } from "@/lib/format";

export default function Home() {
  const { transactions, addTransaction, removeTransaction, loaded } = useTransactions();
  const { budget, setTotalBudget, setCategoryBudget } = useBudget();
  const { rules, addRule, changeAmount, setStatus, removeRule } = useRecurringRules();

  const [tab, setTab] = useState<TabKey>("write");
  const [selected, setSelected] = useState<YearMonth>(currentYearMonth());

  const currentMonthTx = useMemo(
    () => getMonthTransactions(transactions, rules, selected),
    [transactions, rules, selected]
  );
  const previousMonthTx = useMemo(
    () => getMonthTransactions(transactions, rules, prevMonth(selected)),
    [transactions, rules, selected]
  );

  const totalIncome = useMemo(() => sumByType(currentMonthTx, "income"), [currentMonthTx]);
  const totalExpense = useMemo(() => sumByType(currentMonthTx, "expense"), [currentMonthTx]);
  const previousExpense = useMemo(() => sumByType(previousMonthTx, "expense"), [previousMonthTx]);

  const sixMonthAggregates = useMemo(
    () => buildMonthlyAggregates(transactions, rules, recentMonths(selected, 6)),
    [transactions, rules, selected]
  );
  const insights = useMemo(
    () => buildInsights(sixMonthAggregates, budget),
    [sixMonthAggregates, budget]
  );

  const today = currentYearMonth();
  const isCurrentRealMonth = today.year === selected.year && today.month === selected.month;
  const defaultDate = isCurrentRealMonth
    ? todayISO()
    : `${selected.year}-${String(selected.month).padStart(2, "0")}-01`;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">가계부</h1>
        <p className="mt-1 text-sm text-slate-500">
          수입과 지출을 기록하고 월별 소비 흐름을 한눈에 확인하세요.
        </p>
      </header>

      <Tabs active={tab} onChange={setTab} />

      <MonthSelector
        value={selected}
        onChange={setSelected}
        onPrev={() => setSelected((prev) => prevMonth(prev))}
        onNext={() => setSelected((prev) => nextMonth(prev))}
      />

      {tab === "write" && (
        <>
          <TransactionForm
            key={monthKey(selected)}
            defaultDate={defaultDate}
            onAdd={addTransaction}
          />

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold text-slate-800">내역</h2>
            {loaded && (
              <TransactionList
                transactions={currentMonthTx}
                onRemove={removeTransaction}
              />
            )}
          </section>
        </>
      )}

      {tab === "summary" && (
        <div className="flex flex-col gap-4">
          <SummaryCards
            totalIncome={totalIncome}
            totalExpense={totalExpense}
            previousExpense={previousExpense}
          />

          <BudgetProgress
            current={currentMonthTx}
            totalExpense={totalExpense}
            budget={budget}
            onSetTotalBudget={setTotalBudget}
            onSetCategoryBudget={setCategoryBudget}
          />

          <FixedVariableSplit current={currentMonthTx} />

          <CategoryBreakdown current={currentMonthTx} previous={previousMonthTx} />

          <TrendSection manualTransactions={transactions} rules={rules} selected={selected} />

          <Insights insights={insights} />
        </div>
      )}

      {tab === "recurring" && (
        <RecurringManager
          rules={rules}
          selected={selected}
          onAdd={addRule}
          onChangeAmount={changeAmount}
          onSetStatus={setStatus}
          onRemove={removeRule}
        />
      )}
    </div>
  );
}
