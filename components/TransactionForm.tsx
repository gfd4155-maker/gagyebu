"use client";

import { useState } from "react";
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  type Category,
  type CostType,
  type Transaction,
  type TransactionType,
} from "@/lib/types";

interface TransactionFormProps {
  onAdd: (transaction: Omit<Transaction, "id">) => void;
  defaultDate: string;
}

export default function TransactionForm({ onAdd, defaultDate }: TransactionFormProps) {
  const [date, setDate] = useState(defaultDate);
  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<Category>(EXPENSE_CATEGORIES[0]);
  const [memo, setMemo] = useState("");
  const [costType, setCostType] = useState<CostType>("variable");
  const [error, setError] = useState("");

  const categories = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  function handleTypeChange(nextType: TransactionType) {
    setType(nextType);
    setCategory(
      nextType === "income" ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsedAmount = Number(amount);

    if (!date) {
      setError("날짜를 입력해주세요.");
      return;
    }
    if (!amount || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("올바른 금액을 입력해주세요.");
      return;
    }

    onAdd({
      date,
      type,
      amount: parsedAmount,
      category,
      memo: memo.trim(),
      ...(type === "expense" ? { costType } : {}),
    });
    setAmount("");
    setMemo("");
    setError("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 sm:p-6"
    >
      <div className="mb-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => handleTypeChange("income")}
          className={`rounded-xl py-2 text-sm font-semibold transition-colors ${
            type === "income"
              ? "bg-blue-600 text-white"
              : "bg-slate-100 text-slate-500 hover:bg-slate-200"
          }`}
        >
          수입
        </button>
        <button
          type="button"
          onClick={() => handleTypeChange("expense")}
          className={`rounded-xl py-2 text-sm font-semibold transition-colors ${
            type === "expense"
              ? "bg-red-600 text-white"
              : "bg-slate-100 text-slate-500 hover:bg-slate-200"
          }`}
        >
          지출
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="date" className="text-sm font-medium text-slate-600">
            날짜
          </label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="amount" className="text-sm font-medium text-slate-600">
            금액
          </label>
          <input
            id="amount"
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="category"
            className="text-sm font-medium text-slate-600"
          >
            카테고리
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="memo" className="text-sm font-medium text-slate-600">
            메모
          </label>
          <input
            id="memo"
            type="text"
            placeholder="메모 (선택)"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>

        {type === "expense" && (
          <div className="flex flex-col gap-1 sm:col-span-2">
            <span className="text-sm font-medium text-slate-600">지출 유형</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setCostType("fixed")}
                className={`rounded-lg py-1.5 text-sm font-medium transition-colors ${
                  costType === "fixed"
                    ? "bg-violet-600 text-white"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                고정비
              </button>
              <button
                type="button"
                onClick={() => setCostType("variable")}
                className={`rounded-lg py-1.5 text-sm font-medium transition-colors ${
                  costType === "variable"
                    ? "bg-slate-700 text-white"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                변동비
              </button>
            </div>
          </div>
        )}
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        className="mt-4 w-full rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
      >
        추가하기
      </button>
    </form>
  );
}
