"use client";

import { useCallback, useEffect, useState } from "react";
import type { Transaction } from "./types";

const STORAGE_KEY = "budget-app:transactions";

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setTransactions(JSON.parse(raw) as Transaction[]);
      }
    } catch {
      // ignore malformed storage
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions, loaded]);

  const addTransaction = useCallback((transaction: Omit<Transaction, "id">) => {
    setTransactions((prev) => [
      { ...transaction, id: crypto.randomUUID() },
      ...prev,
    ]);
  }, []);

  const removeTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { transactions, addTransaction, removeTransaction, loaded };
}
