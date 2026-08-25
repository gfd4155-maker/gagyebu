import type { Transaction } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/format";

interface TransactionListProps {
  transactions: Transaction[];
  onRemove: (id: string) => void;
}

export default function TransactionList({
  transactions,
  onRemove,
}: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center text-sm text-slate-400 shadow-sm ring-1 ring-black/5">
        이 달에 등록된 내역이 없어요. 위에서 내역을 추가해보세요.
      </div>
    );
  }

  const sorted = [...transactions].sort((a, b) =>
    b.date === a.date ? 0 : b.date.localeCompare(a.date)
  );

  return (
    <ul className="flex flex-col gap-2">
      {sorted.map((t) => (
        <li
          key={t.id}
          className="flex items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5"
        >
          <div className="flex min-w-0 items-center gap-3">
            <span
              className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                t.type === "income"
                  ? "bg-blue-50 text-blue-600"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {t.category}
            </span>
            {t.isRecurring ? (
              <span
                className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-500"
                title="반복 항목에서 자동으로 반영된 내역이에요"
              >
                🔁 반복
              </span>
            ) : (
              t.type === "expense" &&
              t.costType === "fixed" && (
                <span className="shrink-0 rounded-full bg-violet-50 px-2 py-1 text-[10px] font-semibold text-violet-600">
                  고정비
                </span>
              )
            )}
            <div className="min-w-0">
              <p className="truncate text-sm text-slate-800">
                {t.memo || "메모 없음"}
              </p>
              <p className="text-xs text-slate-400">{formatDate(t.date)}</p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <span
              className={`text-base font-bold ${
                t.type === "income" ? "text-blue-600" : "text-red-600"
              }`}
            >
              {t.type === "income" ? "+" : "-"}
              {formatCurrency(t.amount)}
            </span>
            {!t.isRecurring && (
              <button
                type="button"
                onClick={() => onRemove(t.id)}
                aria-label="삭제"
                className="rounded-full p-1.5 text-slate-300 transition-colors hover:bg-slate-100 hover:text-slate-500"
              >
                ✕
              </button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
