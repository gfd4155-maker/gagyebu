"use client";

import { useCallback, useEffect, useState } from "react";
import { EMPTY_BUDGET, type Budget, type ExpenseCategory } from "./types";

const STORAGE_KEY = "budget-app:budget";

export function useBudget() {
  const [budget, setBudget] = useState<Budget>(EMPTY_BUDGET);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setBudget({ ...EMPTY_BUDGET, ...(JSON.parse(raw) as Budget) });
      }
    } catch {
      // ignore malformed storage
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(budget));
  }, [budget, loaded]);

  const setTotalBudget = useCallback((total: number | null) => {
    setBudget((prev) => ({ ...prev, total }));
  }, []);

  const setCategoryBudget = useCallback(
    (category: ExpenseCategory, amount: number | null) => {
      setBudget((prev) => {
        const byCategory = { ...prev.byCategory };
        if (amount === null || amount <= 0) {
          delete byCategory[category];
        } else {
          byCategory[category] = amount;
        }
        return { ...prev, byCategory };
      });
    },
    []
  );

  return { budget, setTotalBudget, setCategoryBudget, loaded };
}
