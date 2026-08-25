"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import type { CostType, Transaction } from "./types";

interface BudgetRow {
  id: string;
  date: string;
  type: Transaction["type"];
  category: string;
  amount: number;
  memo: string | null;
  cost_type: CostType | null;
}

function rowToTransaction(row: BudgetRow): Transaction {
  return {
    id: row.id,
    date: row.date,
    type: row.type,
    amount: row.amount,
    category: row.category as Transaction["category"],
    memo: row.memo ?? "",
    ...(row.cost_type ? { costType: row.cost_type } : {}),
  };
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const { data, error } = await supabase
        .from("budget")
        .select("id, date, type, category, amount, memo, cost_type")
        .order("date", { ascending: false });

      if (cancelled) return;

      if (error) {
        console.error("Failed to load transactions:", error.message);
      } else if (data) {
        setTransactions(data.map(rowToTransaction));
      }
      setLoaded(true);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const addTransaction = useCallback(
    async (transaction: Omit<Transaction, "id">) => {
      const { data, error } = await supabase
        .from("budget")
        .insert({
          date: transaction.date,
          type: transaction.type,
          category: transaction.category,
          amount: transaction.amount,
          memo: transaction.memo || null,
          cost_type: transaction.costType ?? null,
        })
        .select("id, date, type, category, amount, memo, cost_type")
        .single();

      if (error) {
        console.error("Failed to add transaction:", error.message);
        return;
      }

      setTransactions((prev) => [rowToTransaction(data), ...prev]);
    },
    []
  );

  const removeTransaction = useCallback(async (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));

    const { error } = await supabase.from("budget").delete().eq("id", id);
    if (error) {
      console.error("Failed to remove transaction:", error.message);
    }
  }, []);

  return { transactions, addTransaction, removeTransaction, loaded };
}
