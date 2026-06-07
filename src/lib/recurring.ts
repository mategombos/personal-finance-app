import { Transaction } from '@/types';
import { addDays, addWeeks, addMonths, addYears, parseISO, isAfter, isBefore, differenceInDays } from 'date-fns';

export function getUpcomingRecurring(transactions: Transaction[], daysAhead = 7): Transaction[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const cutoff = addDays(today, daysAhead);

  return transactions.filter((t) => {
    if (!t.isRecurring || !t.nextDueDate) return false;
    const due = parseISO(t.nextDueDate);
    return !isAfter(due, cutoff); // due today, already past, or within daysAhead
  });
}

export function advanceNextDueDate(transaction: Transaction): string {
  if (!transaction.nextDueDate || !transaction.recurringInterval) {
    return transaction.nextDueDate ?? transaction.date;
  }
  const current = parseISO(transaction.nextDueDate);
  let next: Date;
  switch (transaction.recurringInterval) {
    case 'daily':   next = addDays(current, 1); break;
    case 'weekly':  next = addWeeks(current, 1); break;
    case 'biweekly': next = addWeeks(current, 2); break;
    case 'monthly': next = addMonths(current, 1); break;
    case 'yearly':  next = addYears(current, 1); break;
    default:        next = addMonths(current, 1);
  }
  return next.toISOString().split('T')[0];
}

export function daysUntilDue(nextDueDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = parseISO(nextDueDate);
  return differenceInDays(due, today);
}

export function isDueOrOverdue(nextDueDate: string): boolean {
  return daysUntilDue(nextDueDate) <= 0;
}
