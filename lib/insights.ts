import type { Budget } from "./types";
import type { MonthAggregate } from "./aggregates";
import { percentChange } from "./stats";

/**
 * `sixMonth` must be the trailing 6 months ending at (and including) the
 * currently selected month, oldest first — independent of any trend-chart
 * period the user has picked, so insights stay stable regardless of that UI.
 */
export function buildInsights(sixMonth: MonthAggregate[], budget: Budget): string[] {
  if (sixMonth.length === 0) return [];
  const current = sixMonth[sixMonth.length - 1];
  const previous = sixMonth.length >= 2 ? sixMonth[sixMonth.length - 2] : null;
  const candidates: string[] = [];

  // 1. Month-over-month expense change.
  if (previous) {
    const change = percentChange(current.expense, previous.expense);
    if (change !== null && current.expense > 0) {
      const dir = change >= 0 ? "증가" : "감소";
      candidates.push(
        `이번 달 지출은 지난달보다 ${Math.abs(Math.round(change))}% ${dir}했어요.`
      );
    }
  }

  // 2. Current expense vs. trailing 3-month average (excluding current).
  const priorMonths = sixMonth.slice(0, -1).slice(-3);
  if (priorMonths.length === 3) {
    const avg = priorMonths.reduce((sum, m) => sum + m.expense, 0) / priorMonths.length;
    const change = percentChange(current.expense, avg);
    if (change !== null && Math.abs(change) >= 3) {
      const dir = change >= 0 ? "높습니다" : "낮습니다";
      candidates.push(
        `최근 3개월 평균보다 이번 달 지출이 ${Math.abs(Math.round(change))}% ${dir}.`
      );
    }
  }

  // 3. Savings rate rank within the trailing window.
  const rateWindow = sixMonth.filter((m) => m.savingsRate !== null);
  if (current.savingsRate !== null && rateWindow.length >= 3) {
    const maxRate = Math.max(...rateWindow.map((m) => m.savingsRate as number));
    const minRate = Math.min(...rateWindow.map((m) => m.savingsRate as number));
    if (current.savingsRate === maxRate) {
      candidates.push(
        `이번 달 저축률(${current.savingsRate.toFixed(0)}%)은 최근 ${rateWindow.length}개월 중 가장 높아요.`
      );
    } else if (current.savingsRate === minRate) {
      candidates.push(
        `이번 달 저축률(${current.savingsRate.toFixed(0)}%)은 최근 ${rateWindow.length}개월 중 가장 낮아요.`
      );
    }
  }

  // 4. A category rising for 3 consecutive months.
  const last3 = sixMonth.slice(-3);
  if (last3.length === 3) {
    for (const [category] of last3[2].categoryTotals) {
      const amounts = last3.map((m) => m.categoryTotals.get(category) ?? 0);
      if (amounts[0] > 0 && amounts[0] < amounts[1] && amounts[1] < amounts[2]) {
        candidates.push(`${category}가 3개월 연속 증가하고 있어요.`);
        break;
      }
    }
  }

  // 5. Fixed-cost drift over the trailing window.
  if (sixMonth.length >= 6) {
    const diff = current.fixed - sixMonth[0].fixed;
    if (Math.abs(diff) >= 10000) {
      const dir = diff >= 0 ? "증가" : "감소";
      candidates.push(
        `최근 ${sixMonth.length}개월 동안 고정비가 ${Math.abs(diff).toLocaleString("ko-KR")}원 ${dir}했어요.`
      );
    }
  }

  // 6. Top expense category this month.
  const topCategory = [...current.categoryTotals.entries()].sort((a, b) => b[1] - a[1])[0];
  if (topCategory && topCategory[1] > 0) {
    candidates.push(`가장 많이 지출한 항목은 ${topCategory[0]}입니다.`);
  }

  // 7. Top variable-spend category (the part users can actually control).
  const variableTotals = new Map<string, number>();
  for (const t of current.transactions) {
    if (t.type !== "expense" || t.costType === "fixed") continue;
    variableTotals.set(t.category, (variableTotals.get(t.category) ?? 0) + t.amount);
  }
  const topVariable = [...variableTotals.entries()].sort((a, b) => b[1] - a[1])[0];
  if (topVariable && topVariable[1] > 0) {
    candidates.push(`변동비에서 가장 큰 비중을 차지하는 항목은 ${topVariable[0]}입니다.`);
  }

  // 8. Budget usage.
  if (budget.total && budget.total > 0) {
    const usedPct = Math.round((current.expense / budget.total) * 100);
    candidates.push(`현재 월 예산의 ${usedPct}%를 사용했습니다.`);
  }

  // 9. Fixed-cost share of total spend.
  const totalFixedVariable = current.fixed + current.variable;
  if (totalFixedVariable > 0 && current.fixed > 0) {
    const fixedPct = Math.round((current.fixed / totalFixedVariable) * 100);
    candidates.push(`고정비가 전체 지출의 ${fixedPct}%를 차지하고 있습니다.`);
  }

  return candidates.slice(0, 4);
}
