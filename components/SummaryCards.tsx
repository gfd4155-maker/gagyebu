import { formatCurrency } from "@/lib/format";
import { percentChange, savingsRate } from "@/lib/stats";

interface SummaryCardsProps {
  totalIncome: number;
  totalExpense: number;
  previousExpense: number;
}

export default function SummaryCards({
  totalIncome,
  totalExpense,
  previousExpense,
}: SummaryCardsProps) {
  const balance = totalIncome - totalExpense;
  const rate = savingsRate(totalIncome, totalExpense);
  const expenseChange = percentChange(totalExpense, previousExpense);

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-2xl bg-white p-4 shadow-[0_4px_20px_rgba(30,41,59,0.05)]">
        <p className="text-sm text-slate-500">총수입</p>
        <p className="mt-1 text-2xl font-display font-bold tabular-nums text-[#006a61]">
          {formatCurrency(totalIncome)}
        </p>
      </div>
      <div className="rounded-2xl bg-white p-4 shadow-[0_4px_20px_rgba(30,41,59,0.05)]">
        <p className="text-sm text-slate-500">총지출</p>
        <p className="mt-1 text-2xl font-display font-bold tabular-nums text-[#ff4e67]">
          {formatCurrency(totalExpense)}
        </p>
        <p className="mt-1 text-xs text-slate-400">
          {expenseChange === null ? (
            "지난달 비교 데이터 없음"
          ) : (
            <>
              지난달 대비{" "}
              <span
                className={expenseChange >= 0 ? "text-[#ff4e67]" : "text-[#006a61]"}
              >
                {expenseChange >= 0 ? "▲" : "▼"}{" "}
                {Math.abs(expenseChange).toFixed(1)}%
              </span>
            </>
          )}
        </p>
      </div>
      <div className="rounded-2xl bg-white p-4 shadow-[0_4px_20px_rgba(30,41,59,0.05)]">
        <p className="text-sm text-slate-500">잔액</p>
        <p
          className={`mt-1 text-2xl font-display font-bold tabular-nums ${
            balance >= 0 ? "text-slate-900" : "text-[#ff4e67]"
          }`}
        >
          {formatCurrency(balance)}
        </p>
      </div>
      <div className="rounded-2xl bg-white p-4 shadow-[0_4px_20px_rgba(30,41,59,0.05)]">
        <p className="text-sm text-slate-500">저축률</p>
        <p className="mt-1 text-2xl font-display font-bold tabular-nums text-slate-900">
          {rate === null ? "—" : `${rate.toFixed(1)}%`}
        </p>
      </div>
    </div>
  );
}
