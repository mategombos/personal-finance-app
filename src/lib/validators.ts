import { z } from 'zod';

export const transactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.number().positive('Amount must be greater than 0'),
  categoryId: z.string().min(1, 'Category is required'),
  description: z.string().min(1, 'Description is required').max(200),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  assetId: z.string().optional(),
});

export const categorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(50),
  type: z.enum(['income', 'expense', 'both']),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Invalid color'),
  icon: z.string().min(1, 'Icon is required'),
});

export const assetSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  type: z.enum(['cash', 'bank', 'investment', 'personal']),
  balance: z.number(),
  currency: z.string().min(1, 'Currency is required'),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Invalid color'),
  icon: z.string().min(1, 'Icon is required'),
  description: z.string().max(200).optional(),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;
export type CategoryFormData = z.infer<typeof categorySchema>;
export type AssetFormData = z.infer<typeof assetSchema>;
