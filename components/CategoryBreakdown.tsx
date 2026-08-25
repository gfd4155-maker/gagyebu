import { EXPENSE_CATEGORY_COLORS, type Transaction } from "@/lib/types";
import { expenseByCategory, percentChange } from "@/lib/stats";
import { formatCurrency } from "@/lib/format";

interface CategoryBreakdownProps {
  current: Transaction[];
  previous: Transaction[];
}

export default function CategoryBreakdown({
  current,
  previous,
}: CategoryBreakdownProps) {
  const rows = expenseByCategory(current);
  const previousByCategory = new Map(
    expenseByCategory(previous).map((c) => [c.category, c.amount])
  );
  const total = rows.reduce((sum, r) => sum + r.amount, 0);
  const topCategory = rows[0]?.amount > 0 ? rows[0].category : null;

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 sm:p-6">
      <h3 className="text-base font-semibold text-slate-800">카테고리별 지출</h3>

      {total === 0 ? (
        <p className="mt-4 text-sm text-slate-400">데이터가 없습니다.</p>
      ) : (
        <ul className="mt-4 flex flex-col gap-3">
          {rows
            .filter((r) => r.amount > 0)
            .map((r) => {
              const pct = total === 0 ? 0 : (r.amount / total) * 100;
              const prevAmount = previousByCategory.get(r.category) ?? 0;
              const change = percentChange(r.amount, prevAmount);
              const color = EXPENSE_CATEGORY_COLORS[r.category as keyof typeof EXPENSE_CATEGORY_COLORS];
              const isTop = r.category === topCategory;

              return (
                <li key={r.category}>
                  <div className="flex items-center justify-between gap-2 text-sm">
                    <span className="flex min-w-0 items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: color }}
                        aria-hidden
                      />
                      <span
                        className={`truncate ${
                          isTop ? "font-bold text-slate-900" : "text-slate-700"
                        }`}
                      >
                        {r.category}
                        {isTop && (
                          <span className="ml-1.5 rounded-full bg-slate-900 px-1.5 py-0.5 text-[10px] font-semibold text-white align-middle">
                            최다 지출
                          </span>
                        )}
                      </span>
                    </span>
                    <span className="shrink-0 text-right text-slate-600">
                      <span className="font-semibold text-slate-900">
                        {formatCurrency(r.amount)}
                      </span>{" "}
                      <span className="text-slate-400">
                        ({pct.toFixed(0)}%)
                      </span>
                    </span>
                  </div>

                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${pct}%`, backgroundColor: color }}
                    />
                  </div>

                  <p className="mt-1 text-right text-xs text-slate-400">
                    {change === null ? (
                      "비교 데이터 없음"
                    ) : (
                      <span className={change >= 0 ? "text-red-500" : "text-blue-500"}>
                        지난달 대비 {change >= 0 ? "▲" : "▼"}{" "}
                        {Math.abs(change).toFixed(0)}%
                      </span>
                    )}
                  </p>
                </li>
              );
            })}
        </ul>
      )}
    </div>
  );
}
