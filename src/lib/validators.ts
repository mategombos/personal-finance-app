import { z } from 'zod';

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

export type TransactionFormData = z.infer<ReturnType<typeof makeTransactionSchema>>;
export type CategoryFormData = z.infer<ReturnType<typeof makeCategorySchema>>;
export type AssetFormData = z.infer<ReturnType<typeof makeAssetSchema>>;
