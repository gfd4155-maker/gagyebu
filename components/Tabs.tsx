export type TabKey = "write" | "summary" | "recurring";

interface TabsProps {
  active: TabKey;
  onChange: (tab: TabKey) => void;
}

const TABS: { key: TabKey; label: string }[] = [
  { key: "write", label: "가계부 작성" },
  { key: "summary", label: "Summary" },
  { key: "recurring", label: "반복 항목" },
];

export default function Tabs({ active, onChange }: TabsProps) {
  return (
    <div className="grid grid-cols-3 gap-2 rounded-2xl bg-white p-1.5 shadow-sm ring-1 ring-black/5">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          className={`rounded-xl py-2 text-sm font-semibold transition-colors ${
            active === tab.key
              ? "bg-slate-900 text-white"
              : "text-slate-500 hover:bg-slate-100"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
