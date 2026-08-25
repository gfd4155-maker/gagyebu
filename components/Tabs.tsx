export type TabKey = "write" | "summary" | "recurring";

interface TabsProps {
  active: TabKey;
  onChange: (tab: TabKey) => void;
}

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: "write", label: "가계부 작성", icon: "✍️" },
  { key: "summary", label: "Summary", icon: "◐" },
  { key: "recurring", label: "반복 항목", icon: "🗓️" },
];

export default function Tabs({ active, onChange }: TabsProps) {
  return (
    <>
      {/* Desktop sidebar navigation */}
      <aside className="hidden w-64 shrink-0 flex-col gap-8 border-r border-[#e2e8f0] bg-[#eff4ff] px-4 py-8 md:flex">
        <div>
          <h1 className="font-display text-xl font-bold text-[#0b1c30]">가계부</h1>
          <p className="mt-0.5 text-xs text-[#45474c]">Financial Clarity</p>
        </div>
        <nav className="flex flex-col gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChange(tab.key)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                active === tab.key
                  ? "bg-white text-[#0b1c30] shadow-[0_4px_20px_rgba(30,41,59,0.05)]"
                  : "text-[#45474c] hover:bg-white/60"
              }`}
            >
              <span aria-hidden>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Mobile bottom navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-10 flex items-stretch gap-1 border-t border-[#e2e8f0] bg-white/95 px-2 py-2 backdrop-blur md:hidden">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={`flex flex-1 flex-col items-center gap-0.5 rounded-xl py-1.5 text-[11px] font-semibold transition-colors ${
              active === tab.key
                ? "bg-[#091426] text-white"
                : "text-[#45474c] hover:bg-[#eff4ff]"
            }`}
          >
            <span aria-hidden className="text-base leading-none">
              {tab.icon}
            </span>
            {tab.label}
          </button>
        ))}
      </nav>
    </>
  );
}
