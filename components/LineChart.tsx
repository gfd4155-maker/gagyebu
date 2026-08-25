import { formatCurrency } from "@/lib/format";
import { isSameMonth, monthLabel, type YearMonth } from "@/lib/month";

export interface LineChartSeries {
  key: string;
  label: string;
  color: string;
  values: number[]; // aligned with `months` by index
}

interface LineChartProps {
  months: YearMonth[];
  series: LineChartSeries[];
  selected: YearMonth;
  height?: number;
}

const WIDTH = 600;
const PAD_LEFT = 12;
const PAD_RIGHT = 12;
const PAD_TOP = 16;
const PAD_BOTTOM = 32;

export default function LineChart({ months, series, selected, height = 220 }: LineChartProps) {
  const innerWidth = WIDTH - PAD_LEFT - PAD_RIGHT;
  const innerHeight = height - PAD_TOP - PAD_BOTTOM;

  const allValues = series.flatMap((s) => s.values);
  const maxValue = Math.max(1, ...allValues, 0);
  const minValue = Math.min(0, ...allValues);
  const range = maxValue - minValue || 1;

  const xFor = (i: number) =>
    PAD_LEFT + (months.length === 1 ? innerWidth / 2 : (innerWidth * i) / (months.length - 1));
  const yFor = (value: number) =>
    PAD_TOP + innerHeight - ((value - minValue) / range) * innerHeight;
  const zeroY = yFor(0);

  const linePath = (values: number[]) =>
    values.map((v, i) => `${i === 0 ? "M" : "L"} ${xFor(i)} ${yFor(v)}`).join(" ");

  const hasData = allValues.some((v) => v !== 0);
  const showZeroLine = minValue < 0;

  return (
    <div className="w-full overflow-hidden">
      {!hasData ? (
        <p className="mt-2 text-sm text-slate-400">데이터가 없습니다.</p>
      ) : (
        <svg viewBox={`0 0 ${WIDTH} ${height}`} className="w-full" role="img" aria-label="추이 그래프">
          {[0, 0.5, 1].map((g) => (
            <line
              key={g}
              x1={PAD_LEFT}
              x2={WIDTH - PAD_RIGHT}
              y1={PAD_TOP + innerHeight * (1 - g)}
              y2={PAD_TOP + innerHeight * (1 - g)}
              stroke="#e1e0d9"
              strokeWidth={1}
            />
          ))}

          {showZeroLine && (
            <line x1={PAD_LEFT} x2={WIDTH - PAD_RIGHT} y1={zeroY} y2={zeroY} stroke="#c3c2b7" strokeWidth={1} />
          )}

          {series.map((s) => (
            <path
              key={s.key}
              d={linePath(s.values)}
              fill="none"
              stroke={s.color}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}

          {months.map((ym, i) => {
            const isSelected = isSameMonth(ym, selected);
            return (
              <g key={`${ym.year}-${ym.month}`}>
                {isSelected && (
                  <line
                    x1={xFor(i)}
                    x2={xFor(i)}
                    y1={PAD_TOP}
                    y2={PAD_TOP + innerHeight}
                    stroke="#c3c2b7"
                    strokeWidth={1}
                    strokeDasharray="3 3"
                  />
                )}
                {series.map((s) => (
                  <circle
                    key={s.key}
                    cx={xFor(i)}
                    cy={yFor(s.values[i])}
                    r={isSelected ? 4.5 : 3}
                    fill={s.color}
                  >
                    <title>{`${monthLabel(ym)} ${s.label} ${formatCurrency(s.values[i])}`}</title>
                  </circle>
                ))}
                <text
                  x={xFor(i)}
                  y={height - 8}
                  textAnchor="middle"
                  fontSize={11}
                  fill={isSelected ? "#0b0b0b" : "#898781"}
                  fontWeight={isSelected ? 700 : 400}
                >
                  {ym.month}월
                </text>
              </g>
            );
          })}
        </svg>
      )}

      {series.length > 1 && (
        <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
          {series.map((s) => (
            <span key={s.key} className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
              {s.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
