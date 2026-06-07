'use client';

import { useState } from 'react';
import { useDashboard, DashboardPeriod } from '@/hooks/useDashboard';
import { useCategories } from '@/hooks/useCategories';
import { useSettings } from '@/hooks/useSettings';
import { useTransactions } from '@/hooks/useTransactions';
import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { SpendingByCategoryChart } from '@/components/dashboard/SpendingByCategoryChart';
import { MonthlyBreakdownChart } from '@/components/dashboard/MonthlyBreakdownChart';
import { RecentTransactionsList } from '@/components/dashboard/RecentTransactionsList';
import { NetWorthCard } from '@/components/dashboard/NetWorthCard';
import { NetWorthHistoryChart } from '@/components/dashboard/NetWorthHistoryChart';
import { UpcomingRecurringCard } from '@/components/dashboard/UpcomingRecurringCard';
import { BudgetProgressCard } from '@/components/dashboard/BudgetProgressCard';
import { SavingsRateCard } from '@/components/dashboard/SavingsRateCard';
import { AccountSummaryCard } from '@/components/dashboard/AccountSummaryCard';
import { useTranslations } from '@/hooks/useTranslations';

export default function DashboardPage() {
  const [period, setPeriod] = useState<DashboardPeriod>('month');
  const { settings } = useSettings();
  const t = useTranslations();
  const { categories } = useCategories();
  const { transactions } = useTransactions();
  const {
    totalIncome,
    totalExpenses,
    netBalance,
    categoryTotals,
    monthlyData,
    recentTransactions,
    assets,
    budgetUsage,
    savingsRate,
    prevMonthSavingsRate,
    netWorthHistory,
  } = useDashboard(period);

  return (
    <div className="px-4 py-6 md:px-8 space-y-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('dashboard.title')}</h1>

      <SummaryCards
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        netBalance={netBalance}
        currency={settings.currency}
        period={period}
        onPeriodChange={setPeriod}
      />

      {/* Upcoming recurring payments */}
      <UpcomingRecurringCard
        transactions={transactions}
        categories={categories}
        currency={settings.currency}
      />

      {/* Savings rate + budget */}
      <div className="grid gap-6 lg:grid-cols-2">
        <SavingsRateCard savingsRate={savingsRate} prevMonthSavingsRate={prevMonthSavingsRate} />
        <BudgetProgressCard budgetUsage={budgetUsage} currency={settings.currency} />
      </div>

      {/* Spending charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <SpendingByCategoryChart data={categoryTotals} currency={settings.currency} />
        <MonthlyBreakdownChart data={monthlyData} currency={settings.currency} />
      </div>

      {/* Net worth history */}
      <NetWorthHistoryChart data={netWorthHistory} currency={settings.currency} />

      {/* Bottom row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RecentTransactionsList
          transactions={recentTransactions}
          categories={categories}
          currency={settings.currency}
          dateFormat={settings.dateFormat}
        />
        <NetWorthCard assets={assets} currency={settings.currency} />
      </div>

      {/* Account summary */}
      <AccountSummaryCard
        assets={assets}
        transactions={transactions}
        currency={settings.currency}
      />
    </div>
  );
}
