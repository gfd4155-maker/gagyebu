interface InsightsProps {
  insights: string[];
}

export default function Insights({ insights }: InsightsProps) {
  if (insights.length === 0) return null;

  return (
    <div className="rounded-2xl bg-slate-900 p-4 shadow-sm sm:p-6">
      <h3 className="text-base font-semibold text-white">이번 달 소비 인사이트</h3>
      <ul className="mt-3 flex flex-col gap-2">
        {insights.map((text) => (
          <li key={text} className="flex items-start gap-2 text-sm text-slate-200">
            <span className="mt-0.5 text-slate-500">•</span>
            {text}
          </li>
        ))}
      </ul>
    </div>
  );
}
