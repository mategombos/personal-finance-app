import { z } from 'zod';

export const financeStoreImportSchema = z.object({
  version: z.number().int().positive(),
  settings: z.object({
    currency: z.string().min(1).max(10),
    dateFormat: z.string().min(1).max(20),
    theme: z.enum(['light', 'dark', 'system']),
    language: z.enum(['en', 'hu']).optional().default('en'),
    defaultAssetId: z.string().optional(),
  }),
  transactions: z.array(z.object({
    id: z.string().min(1),
    type: z.enum(['income', 'expense']),
    amount: z.number().positive().finite().max(1e12),
    categoryId: z.string().min(1),
    description: z.string().max(500),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    assetId: z.string().optional(),
    isRecurring: z.boolean().optional(),
    recurringInterval: z.enum(['daily', 'weekly', 'biweekly', 'monthly', 'yearly']).optional(),
    nextDueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })),
  categories: z.array(z.object({
    id: z.string().min(1),
    name: z.string().min(1).max(50),
    type: z.enum(['income', 'expense', 'both']),
    color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    icon: z.string().min(1),
    isDefault: z.boolean(),
    monthlyBudget: z.number().positive().optional(),
    createdAt: z.string(),
  })),
  assets: z.array(z.object({
    id: z.string().min(1),
    name: z.string().min(1).max(100),
    type: z.enum(['cash', 'bank', 'investment', 'personal']),
    balance: z.number().finite().max(1e15),
    currency: z.string().min(1).max(10),
    color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    icon: z.string().min(1),
    description: z.string().max(200).optional(),
    isArchived: z.boolean(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })),
  netWorthHistory: z.array(z.object({
    date: z.string().regex(/^\d{4}-\d{2}$/),
    value: z.number().finite().max(1e15),
    manual: z.boolean().optional(),
  })).optional().default([]),
});

export function makeTransactionSchema(msgs: {
  amountRequired: string;
  categoryRequired: string;
  descriptionRequired: string;
  dateInvalid: string;
}) {
  return z.object({
    type: z.enum(['income', 'expense']),
    amount: z.number().positive(msgs.amountRequired),
    categoryId: z.string().min(1, msgs.categoryRequired),
    description: z.string().min(1, msgs.descriptionRequired).max(200),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, msgs.dateInvalid),
    assetId: z.string().optional(),
    isRecurring: z.boolean().optional(),
    recurringInterval: z.enum(['daily', 'weekly', 'biweekly', 'monthly', 'yearly']).optional(),
    nextDueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  });
}

export function makeCategorySchema(msgs: {
  nameRequired: string;
  colorInvalid: string;
  iconRequired: string;
}) {
  return z.object({
    name: z.string().min(1, msgs.nameRequired).max(50),
    type: z.enum(['income', 'expense', 'both']),
    color: z.string().regex(/^#[0-9a-fA-F]{6}$/, msgs.colorInvalid),
    icon: z.string().min(1, msgs.iconRequired),
    monthlyBudget: z.number().positive().optional(),
  });
}

export function makeAssetSchema(msgs: {
  nameRequired: string;
  currencyRequired: string;
  colorInvalid: string;
  iconRequired: string;
}) {
  return z.object({
    name: z.string().min(1, msgs.nameRequired).max(100),
    type: z.enum(['cash', 'bank', 'investment', 'personal']),
    balance: z.number(),
    currency: z.string().min(1, msgs.currencyRequired),
    color: z.string().regex(/^#[0-9a-fA-F]{6}$/, msgs.colorInvalid),
    icon: z.string().min(1, msgs.iconRequired),
    description: z.string().max(200).optional(),
  });
}

export function makeNetWorthSnapshotSchema(msgs: {
  monthInvalid: string;
  valueRequired: string;
}) {
  return z.object({
    date: z.string().regex(/^\d{4}-\d{2}$/, msgs.monthInvalid),
    value: z.number().finite(msgs.valueRequired).max(1e15),
  });
}

export type TransactionFormData = z.infer<ReturnType<typeof makeTransactionSchema>>;
export type CategoryFormData = z.infer<ReturnType<typeof makeCategorySchema>>;
export type AssetFormData = z.infer<ReturnType<typeof makeAssetSchema>>;
export type NetWorthSnapshotFormData = z.infer<ReturnType<typeof makeNetWorthSnapshotSchema>>;
