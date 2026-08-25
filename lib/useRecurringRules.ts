"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  Category,
  RecurringRule,
  RuleStatus,
  TransactionType,
} from "./types";
import type { YearMonth } from "./month";

const STORAGE_KEY = "budget-app:recurring-rules";

interface CreateRuleInput {
  name: string;
  type: TransactionType;
  category: Category;
  dayOfMonth: number;
  amount: number;
  effectiveFrom: YearMonth;
}

export function useRecurringRules() {
  const [rules, setRules] = useState<RecurringRule[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setRules(JSON.parse(raw) as RecurringRule[]);
    } catch {
      // ignore malformed storage
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rules));
  }, [rules, loaded]);

  const addRule = useCallback((input: CreateRuleInput) => {
    const ruleId = crypto.randomUUID();
    const rule: RecurringRule = {
      id: ruleId,
      name: input.name,
      type: input.type,
      category: input.category,
      dayOfMonth: input.dayOfMonth,
      amountHistory: [
        { id: crypto.randomUUID(), amount: input.amount, effectiveFrom: input.effectiveFrom },
      ],
      statusEvents: [
        { id: crypto.randomUUID(), status: "active", effectiveFrom: input.effectiveFrom },
      ],
    };
    setRules((prev) => [rule, ...prev]);
  }, []);

  const changeAmount = useCallback(
    (ruleId: string, amount: number, effectiveFrom: YearMonth) => {
      setRules((prev) =>
        prev.map((rule) =>
          rule.id === ruleId
            ? {
                ...rule,
                amountHistory: [
                  ...rule.amountHistory,
                  { id: crypto.randomUUID(), amount, effectiveFrom },
                ],
              }
            : rule
        )
      );
    },
    []
  );

  const setStatus = useCallback(
    (ruleId: string, status: RuleStatus, effectiveFrom: YearMonth) => {
      setRules((prev) =>
        prev.map((rule) =>
          rule.id === ruleId
            ? {
                ...rule,
                statusEvents: [
                  ...rule.statusEvents,
                  { id: crypto.randomUUID(), status, effectiveFrom },
                ],
              }
            : rule
        )
      );
    },
    []
  );

  const removeRule = useCallback((ruleId: string) => {
    setRules((prev) => prev.filter((r) => r.id !== ruleId));
  }, []);

  return { rules, addRule, changeAmount, setStatus, removeRule, loaded };
}
