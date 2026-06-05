import { format, parseISO } from 'date-fns';

export function formatCurrency(amount: number, currency = 'HUF'): string {
  return new Intl.NumberFormat('hu-HU', {
    style: 'currency',
    currency,
    maximumFractionDigits: currency === 'HUF' ? 0 : 2,
  }).format(amount);
}

export function formatDate(isoDate: string, dateFormat = 'DD/MM/YYYY'): string {
  try {
    const date = parseISO(isoDate);
    const fnsFormat = dateFormat
      .replace('DD', 'dd')
      .replace('MM', 'MM')
      .replace('YYYY', 'yyyy');
    return format(date, fnsFormat);
  } catch {
    return isoDate;
  }
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatCompact(amount: number): string {
  if (Math.abs(amount) >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M`;
  if (Math.abs(amount) >= 1_000) return `${(amount / 1_000).toFixed(0)}K`;
  return amount.toFixed(0);
}

export function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}
