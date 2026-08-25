"use client";

import { useState } from "react";
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  type Category,
  type RecurringRule,
  type RuleStatus,
  type TransactionType,
} from "@/lib/types";
import { formatCurrency } from "@/lib/format";
import { monthLabel, nextMonth, type YearMonth } from "@/lib/month";
import { currentAmount, currentStatus } from "@/lib/recurring";
import YearMonthPicker from "./YearMonthPicker";

interface RecurringManagerProps {
  rules: RecurringRule[];
  selected: YearMonth;
  onAdd: (input: {
    name: string;
    type: TransactionType;
    category: Category;
    dayOfMonth: number;
    amount: number;
    effectiveFrom: YearMonth;
  }) => void;
  onChangeAmount: (ruleId: string, amount: number, effectiveFrom: YearMonth) => void;
  onSetStatus: (ruleId: string, status: RuleStatus, effectiveFrom: YearMonth) => void;
  onRemove: (ruleId: string) => void;
}

const STATUS_LABEL: Record<RuleStatus, string> = {
  active: "활성",
  paused: "일시중지",
  ended: "종료",
};

const STATUS_STYLE: Record<RuleStatus, string> = {
  active: "bg-[#006a61]/10 text-[#006a61]",
  paused: "bg-amber-50 text-amber-600",
  ended: "bg-slate-100 text-slate-500",
};

export default function RecurringManager({
  rules,
  selected,
  onAdd,
  onChangeAmount,
  onSetStatus,
  onRemove,
}: RecurringManagerProps) {
  const [showCreate, setShowCreate] = useState(false);
  const income = rules.filter((r) => r.type === "income");
  const expense = rules.filter((r) => r.type === "expense");

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl bg-white p-4 shadow-[0_4px_20px_rgba(30,41,59,0.05)] sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">반복 항목</h2>
            <p className="mt-1 text-sm text-slate-500">
              한 번 등록하면 매달 자동으로 가계부에 반영돼요.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowCreate((v) => !v)}
            className="shrink-0 rounded-xl bg-[#091426] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1e293b]"
          >
            {showCreate ? "닫기" : "+ 추가"}
          </button>
        </div>

        {showCreate && (
          <CreateForm
            defaultMonth={selected}
            onSubmit={(input) => {
              onAdd(input);
              setShowCreate(false);
            }}
          />
        )}
      </div>

      <RuleGroup
        title="반복 수입"
        rules={income}
        selected={selected}
        onChangeAmount={onChangeAmount}
        onSetStatus={onSetStatus}
        onRemove={onRemove}
      />
      <RuleGroup
        title="반복 지출(고정비)"
        rules={expense}
        selected={selected}
        onChangeAmount={onChangeAmount}
        onSetStatus={onSetStatus}
        onRemove={onRemove}
      />
    </div>
  );
}

function RuleGroup({
  title,
  rules,
  selected,
  onChangeAmount,
  onSetStatus,
  onRemove,
}: {
  title: string;
  rules: RecurringRule[];
  selected: YearMonth;
  onChangeAmount: RecurringManagerProps["onChangeAmount"];
  onSetStatus: RecurringManagerProps["onSetStatus"];
  onRemove: RecurringManagerProps["onRemove"];
}) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-[0_4px_20px_rgba(30,41,59,0.05)] sm:p-6">
      <h3 className="text-base font-semibold text-slate-800">{title}</h3>
      {rules.length === 0 ? (
        <p className="mt-3 text-sm text-slate-400">등록된 항목이 없어요.</p>
      ) : (
        <ul className="mt-3 flex flex-col gap-3">
          {rules.map((rule) => (
            <RuleRow
              key={rule.id}
              rule={rule}
              selected={selected}
              onChangeAmount={onChangeAmount}
              onSetStatus={onSetStatus}
              onRemove={onRemove}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function RuleRow({
  rule,
  selected,
  onChangeAmount,
  onSetStatus,
  onRemove,
}: {
  rule: RecurringRule;
  selected: YearMonth;
  onChangeAmount: RecurringManagerProps["onChangeAmount"];
  onSetStatus: RecurringManagerProps["onSetStatus"];
  onRemove: RecurringManagerProps["onRemove"];
}) {
  const [mode, setMode] = useState<"none" | "amount" | "pause" | "end" | "resume">("none");
  const status = currentStatus(rule);
  const amount = currentAmount(rule);

  return (
    <li className="rounded-xl border border-slate-100 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="flex items-center gap-2">
            <span className="font-medium text-slate-800">{rule.name}</span>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_STYLE[status]}`}>
              {STATUS_LABEL[status]}
            </span>
          </span>
          <p className="mt-0.5 text-xs text-slate-400">
            {rule.category} · 매월 {rule.dayOfMonth}일
          </p>
        </div>
        <span
          className={`text-base font-display font-bold tabular-nums ${rule.type === "income" ? "text-[#006a61]" : "text-[#ff4e67]"}`}
        >
          {amount === null ? "—" : formatCurrency(amount)}
        </span>
      </div>

      <div className="mt-2 flex flex-wrap gap-2 text-xs">
        <button
          type="button"
          onClick={() => setMode(mode === "amount" ? "none" : "amount")}
          className="rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-600 hover:bg-slate-200"
        >
          금액 변경
        </button>
        {status !== "paused" && status !== "ended" && (
          <button
            type="button"
            onClick={() => setMode(mode === "pause" ? "none" : "pause")}
            className="rounded-full bg-amber-50 px-2.5 py-1 font-medium text-amber-600 hover:bg-amber-100"
          >
            일시중지
          </button>
        )}
        {status !== "ended" && (
          <button
            type="button"
            onClick={() => setMode(mode === "end" ? "none" : "end")}
            className="rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-600 hover:bg-slate-200"
          >
            종료
          </button>
        )}
        {status !== "active" && (
          <button
            type="button"
            onClick={() => setMode(mode === "resume" ? "none" : "resume")}
            className="rounded-full bg-[#006a61]/10 px-2.5 py-1 font-medium text-[#006a61] hover:bg-[#006a61]/20"
          >
            다시 활성화
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            if (window.confirm(`"${rule.name}" 반복 항목을 완전히 삭제할까요? 지금까지 반영된 과거 내역은 사라지지 않아요.`)) {
              onRemove(rule.id);
            }
          }}
          className="rounded-full px-2.5 py-1 font-medium text-slate-400 hover:bg-[#ff4e67]/10 hover:text-[#ff4e67]"
        >
          삭제
        </button>
      </div>

      {mode === "amount" && (
        <AmountChangeForm
          defaultAmount={amount ?? 0}
          defaultMonth={selected}
          onCancel={() => setMode("none")}
          onConfirm={(amt, ym) => {
            onChangeAmount(rule.id, amt, ym);
            setMode("none");
          }}
        />
      )}

      {mode === "pause" && (
        <StatusChangeForm
          description="일시중지되면 선택한 달부터 자동 반영이 멈춰요. 다시 활성화하면 그 시점부터 재개돼요."
          defaultMonth={nextMonth(selected)}
          confirmLabel="일시중지 적용"
          onCancel={() => setMode("none")}
          onConfirm={(ym) => {
            onSetStatus(rule.id, "paused", ym);
            setMode("none");
          }}
        />
      )}

      {mode === "resume" && (
        <StatusChangeForm
          description="선택한 달부터 다시 자동으로 반영돼요."
          defaultMonth={nextMonth(selected)}
          confirmLabel="다시 활성화"
          onCancel={() => setMode("none")}
          onConfirm={(ym) => {
            onSetStatus(rule.id, "active", ym);
            setMode("none");
          }}
        />
      )}

      {mode === "end" && (
        <StatusChangeForm
          description="선택한 달까지만 반영되고, 다음 달부터는 자동으로 반영되지 않아요."
          label="마지막으로 반영할 달"
          defaultMonth={selected}
          confirmLabel="종료"
          onCancel={() => setMode("none")}
          onConfirm={(lastActiveMonth) => {
            onSetStatus(rule.id, "ended", nextMonth(lastActiveMonth));
            setMode("none");
          }}
        />
      )}
    </li>
  );
}

function AmountChangeForm({
  defaultAmount,
  defaultMonth,
  onCancel,
  onConfirm,
}: {
  defaultAmount: number;
  defaultMonth: YearMonth;
  onCancel: () => void;
  onConfirm: (amount: number, effectiveFrom: YearMonth) => void;
}) {
  const [amount, setAmount] = useState(String(defaultAmount));
  const [effectiveFrom, setEffectiveFrom] = useState<YearMonth>(nextMonth(defaultMonth));

  return (
    <div className="mt-3 rounded-lg bg-slate-50 p-3">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <label className="flex items-center gap-1.5">
          변경 금액
          <input
            type="number"
            min={0}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-32 rounded-lg border border-slate-200 px-2 py-1 text-right focus:border-[#091426] focus:outline-none focus:ring-2 focus:ring-[#091426]/15"
          />
          원
        </label>
        <label className="flex items-center gap-1.5">
          적용 시점
          <YearMonthPicker value={effectiveFrom} onChange={setEffectiveFrom} />
          부터
        </label>
      </div>
      <p className="mt-2 text-xs text-slate-500">
        이 변경은 {monthLabel(effectiveFrom)} 이후 거래에 적용되며 이전 기록에는 영향을 주지 않습니다.
      </p>
      <div className="mt-2 flex gap-2">
        <button
          type="button"
          onClick={() => {
            const parsed = Number(amount);
            if (!amount || Number.isNaN(parsed) || parsed <= 0) return;
            onConfirm(parsed, effectiveFrom);
          }}
          className="rounded-lg bg-[#091426] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#1e293b]"
        >
          변경 적용
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100"
        >
          취소
        </button>
      </div>
    </div>
  );
}

function StatusChangeForm({
  description,
  label = "적용 시점",
  defaultMonth,
  confirmLabel,
  onCancel,
  onConfirm,
}: {
  description: string;
  label?: string;
  defaultMonth: YearMonth;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: (ym: YearMonth) => void;
}) {
  const [ym, setYm] = useState<YearMonth>(defaultMonth);

  return (
    <div className="mt-3 rounded-lg bg-slate-50 p-3">
      <label className="flex flex-wrap items-center gap-1.5 text-sm">
        {label}
        <YearMonthPicker value={ym} onChange={setYm} />
      </label>
      <p className="mt-2 text-xs text-slate-500">{description}</p>
      <div className="mt-2 flex gap-2">
        <button
          type="button"
          onClick={() => onConfirm(ym)}
          className="rounded-lg bg-[#091426] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#1e293b]"
        >
          {confirmLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100"
        >
          취소
        </button>
      </div>
    </div>
  );
}

function CreateForm({
  defaultMonth,
  onSubmit,
}: {
  defaultMonth: YearMonth;
  onSubmit: (input: {
    name: string;
    type: TransactionType;
    category: Category;
    dayOfMonth: number;
    amount: number;
    effectiveFrom: YearMonth;
  }) => void;
}) {
  const [type, setType] = useState<TransactionType>("expense");
  const [name, setName] = useState("");
  const [category, setCategory] = useState<Category>(EXPENSE_CATEGORIES[0]);
  const [amount, setAmount] = useState("");
  const [dayOfMonth, setDayOfMonth] = useState(25);
  const [effectiveFrom, setEffectiveFrom] = useState<YearMonth>(defaultMonth);
  const [error, setError] = useState("");

  const categories = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  function handleTypeChange(next: TransactionType) {
    setType(next);
    setCategory(next === "income" ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsedAmount = Number(amount);
    if (!name.trim()) {
      setError("항목명을 입력해주세요.");
      return;
    }
    if (!amount || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("올바른 금액을 입력해주세요.");
      return;
    }
    onSubmit({ name: name.trim(), type, category, dayOfMonth, amount: parsedAmount, effectiveFrom });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 rounded-xl bg-slate-50 p-3">
      <div className="mb-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => handleTypeChange("income")}
          className={`rounded-lg py-1.5 text-sm font-semibold transition-colors ${
            type === "income" ? "bg-[#006a61] text-white" : "bg-white text-slate-500"
          }`}
        >
          반복 수입
        </button>
        <button
          type="button"
          onClick={() => handleTypeChange("expense")}
          className={`rounded-lg py-1.5 text-sm font-semibold transition-colors ${
            type === "expense" ? "bg-[#ff4e67] text-white" : "bg-white text-slate-500"
          }`}
        >
          반복 지출
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm text-slate-600">
          항목명
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="예: 월급, 넷플릭스"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#091426] focus:outline-none focus:ring-2 focus:ring-[#091426]/15"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-slate-600">
          금액
          <input
            type="number"
            min={0}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#091426] focus:outline-none focus:ring-2 focus:ring-[#091426]/15"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-slate-600">
          카테고리
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#091426] focus:outline-none focus:ring-2 focus:ring-[#091426]/15"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm text-slate-600">
          {type === "income" ? "입금 예정일" : "결제 예정일"}
          <select
            value={dayOfMonth}
            onChange={(e) => setDayOfMonth(Number(e.target.value))}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#091426] focus:outline-none focus:ring-2 focus:ring-[#091426]/15"
          >
            {Array.from({ length: 28 }, (_, i) => i + 1).map((d) => (
              <option key={d} value={d}>
                매월 {d}일
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm text-slate-600 sm:col-span-2">
          적용 시작
          <YearMonthPicker value={effectiveFrom} onChange={setEffectiveFrom} />
        </label>
      </div>

      {error && <p className="mt-2 text-sm text-[#ff4e67]">{error}</p>}

      <button
        type="submit"
        className="mt-3 w-full rounded-xl bg-[#091426] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1e293b]"
      >
        반복 항목 등록
      </button>
    </form>
  );
}
