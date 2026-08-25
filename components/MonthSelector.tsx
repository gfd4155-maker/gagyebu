"use client";

import { currentYearMonth, type YearMonth } from "@/lib/month";

interface MonthSelectorProps {
  value: YearMonth;
  onChange: (value: YearMonth) => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function MonthSelector({
  value,
  onChange,
  onPrev,
  onNext,
}: MonthSelectorProps) {
  const thisYear = currentYearMonth().year;
  const years = Array.from({ length: 11 }, (_, i) => thisYear - 5 + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 rounded-2xl bg-white p-2 shadow-sm ring-1 ring-black/5 sm:justify-start">
      <button
        type="button"
        onClick={onPrev}
        aria-label="이전 달"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100"
      >
        ◀
      </button>

      <select
        value={value.year}
        onChange={(e) => onChange({ ...value, year: Number(e.target.value) })}
        aria-label="연도 선택"
        className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm font-medium focus:border-blue-500 focus:outline-none"
      >
        {years.map((y) => (
          <option key={y} value={y}>
            {y}년
          </option>
        ))}
      </select>

      <select
        value={value.month}
        onChange={(e) => onChange({ ...value, month: Number(e.target.value) })}
        aria-label="월 선택"
        className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm font-medium focus:border-blue-500 focus:outline-none"
      >
        {months.map((m) => (
          <option key={m} value={m}>
            {m}월
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={onNext}
        aria-label="다음 달"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100"
      >
        ▶
      </button>
    </div>
  );
}
