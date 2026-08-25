"use client";

import { currentYearMonth, type YearMonth } from "@/lib/month";

interface YearMonthPickerProps {
  value: YearMonth;
  onChange: (value: YearMonth) => void;
  yearsBack?: number;
  yearsForward?: number;
}

export default function YearMonthPicker({
  value,
  onChange,
  yearsBack = 3,
  yearsForward = 3,
}: YearMonthPickerProps) {
  const thisYear = currentYearMonth().year;
  const years = Array.from(
    { length: yearsBack + yearsForward + 1 },
    (_, i) => thisYear - yearsBack + i
  );
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <span className="inline-flex items-center gap-1.5">
      <select
        value={value.year}
        onChange={(e) => onChange({ ...value, year: Number(e.target.value) })}
        aria-label="연도 선택"
        className="rounded-lg border border-slate-200 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
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
        className="rounded-lg border border-slate-200 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
      >
        {months.map((m) => (
          <option key={m} value={m}>
            {m}월
          </option>
        ))}
      </select>
    </span>
  );
}
