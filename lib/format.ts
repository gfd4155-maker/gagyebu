export function formatCurrency(amount: number): string {
  const sign = amount < 0 ? "-" : "";
  return `${sign}₩${Math.abs(amount).toLocaleString("ko-KR")}`;
}

export function formatDate(dateStr: string): string {
  const [, month, day] = dateStr.split("-");
  return `${Number(month)}월 ${Number(day)}일`;
}

export function todayISO(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 10);
}
