import { fixedVariableSplit } from "@/lib/stats";
import { formatCurrency } from "@/lib/format";
import type { Transaction } from "@/lib/types";

interface FixedVariableSplitProps {
  current: Transaction[];
}

export default function FixedVariableSplit({ current }: FixedVariableSplitProps) {
  const { fixed, variable } = fixedVariableSplit(current);
  const total = fixed + variable;
  const fixedPct = total === 0 ? 0 : (fixed / total) * 100;

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 sm:p-6">
      <h3 className="text-base font-semibold text-slate-800">고정비 vs 변동비</h3>

      {total === 0 ? (
        <p className="mt-4 text-sm text-slate-400">데이터가 없습니다.</p>
      ) : (
        <>
          <div className="mt-3 flex h-3 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full bg-violet-600" style={{ width: `${fixedPct}%` }} />
            <div className="h-full bg-slate-300" style={{ width: `${100 - fixedPct}%` }} />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="flex items-center gap-1.5 text-slate-500">
                <span className="h-2.5 w-2.5 rounded-full bg-violet-600" /> 고정비
              </span>
              <p className="mt-1 font-semibold text-slate-900">{formatCurrency(fixed)}</p>
              <p className="text-xs text-slate-400">{fixedPct.toFixed(0)}%</p>
            </div>
            <div>
              <span className="flex items-center gap-1.5 text-slate-500">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-300" /> 변동비
              </span>
              <p className="mt-1 font-semibold text-slate-900">{formatCurrency(variable)}</p>
              <p className="text-xs text-slate-400">{(100 - fixedPct).toFixed(0)}%</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
