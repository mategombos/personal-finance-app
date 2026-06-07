'use client';

import { useState, useRef, useCallback } from 'react';
import { useTransactions } from '@/hooks/useTransactions';
import { useCategories } from '@/hooks/useCategories';
import { useAssets } from '@/hooks/useAssets';
import { useSettings } from '@/hooks/useSettings';
import { parseStatement, ParsedRow } from '@/lib/statementParser';

const MAX_CSV_SIZE = 5 * 1024 * 1024; // 5 MB
import { TransactionFormData } from '@/lib/validators';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Upload, Loader2, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { clsx } from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ReviewRow extends ParsedRow {
  id: string;
  categoryId: string;
  assetId: string;
  selected: boolean;
}

type Step = 'upload' | 'review' | 'done';

export default function ImportPage() {
  const { addTransactions } = useTransactions();
  const { categories } = useCategories();
  const { assets } = useAssets();
  const { settings } = useSettings();
  const router = useRouter();

  const fileRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<Step>('upload');
  const [csvPreview, setCsvPreview] = useState('');
  const [fileName, setFileName] = useState('');
  const [csvText, setCsvText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<ReviewRow[]>([]);

  const activeAssets = assets.filter((a) => !a.isArchived);
  const defaultAssetId = settings.defaultAssetId ?? '';

  const loadFile = (file: File) => {
    if (file.size > MAX_CSV_SIZE) {
      setError('File is too large. Maximum size is 5 MB.');
      return;
    }
    setFileName(file.name);
    setError(null);
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      setCsvText(text);
      const preview = text.split('\n').slice(0, 6).join('\n');
      setCsvPreview(preview);
    };
    reader.readAsText(file, 'utf-8');
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    loadFile(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    loadFile(file);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAnalyse = async () => {
    if (!csvText) return;
    setLoading(true);
    setError(null);
    try {
      const parsed = await parseStatement(csvText);
      if (parsed.length === 0) {
        setError('No transactions could be parsed. Try a different file or check the format.');
        setLoading(false);
        return;
      }
      const firstExpenseCat = categories.find((c) => c.type === 'expense' || c.type === 'both');
      const firstIncomeCat = categories.find((c) => c.type === 'income' || c.type === 'both');
      setRows(parsed.map((r) => ({
        ...r,
        id: crypto.randomUUID(),
        categoryId: r.type === 'income'
          ? (firstIncomeCat?.id ?? firstExpenseCat?.id ?? '')
          : (firstExpenseCat?.id ?? ''),
        assetId: defaultAssetId,
        selected: true,
      })));
      setStep('review');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse statement');
    } finally {
      setLoading(false);
    }
  };

  const handleImport = () => {
    const selected = rows.filter((r) => r.selected && r.categoryId);
    const formData: TransactionFormData[] = selected.map((r) => ({
      type: r.type,
      amount: r.amount,
      categoryId: r.categoryId,
      description: r.description,
      date: r.date,
      assetId: r.assetId || undefined,
    }));
    addTransactions(formData);
    setStep('done');
  };

  const updateRow = (id: string, patch: Partial<ReviewRow>) => {
    setRows((prev) => prev.map((r) => r.id === id ? { ...r, ...patch } : r));
  };

  if (step === 'done') {
    return (
      <div className="px-4 py-6 md:px-8 max-w-2xl mx-auto flex flex-col items-center gap-4 py-20">
        <CheckCircle className="h-12 w-12 text-green-500" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Import Complete</h2>
        <p className="text-gray-500 text-sm">Your transactions have been imported successfully.</p>
        <Button onClick={() => router.push('/transactions')}>View Transactions</Button>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 md:px-8 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/transactions" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Import Bank Statement</h1>
      </div>


      {step === 'upload' && (
        <div className="space-y-6">
          {/* Drop zone */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileRef.current?.click()}
            className="rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 p-12 text-center cursor-pointer hover:border-blue-400 transition-colors"
          >
            <Upload className="h-10 w-10 mx-auto text-gray-400 mb-3" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {fileName ? fileName : 'Drop your CSV file here or click to browse'}
            </p>
            <p className="text-xs text-gray-400 mt-1">Supports any bank statement CSV format</p>
            <input ref={fileRef} type="file" accept=".csv,.txt" className="hidden" onChange={handleFile} />
          </div>

          {csvPreview && (
            <div className="rounded-xl bg-gray-50 dark:bg-gray-900 p-4">
              <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Preview (first 6 rows)</p>
              <pre className="text-xs text-gray-700 dark:text-gray-300 overflow-x-auto whitespace-pre-wrap">{csvPreview}</pre>
            </div>
          )}

          {error && (
            <p className="text-sm text-red-500 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" /> {error}
            </p>
          )}

          <Button
            onClick={handleAnalyse}
            disabled={!csvText || loading}
            className="w-full justify-center"
          >
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Analysing…</> : 'Analyse with AI'}
          </Button>
        </div>
      )}

      {step === 'review' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {rows.filter((r) => r.selected).length} of {rows.length} transactions selected
            </p>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => setStep('upload')}>
                Back
              </Button>
              <Button
                size="sm"
                onClick={handleImport}
                disabled={rows.filter((r) => r.selected && r.categoryId).length === 0}
              >
                Import {rows.filter((r) => r.selected).length} transactions
              </Button>
            </div>
          </div>

          <div className="rounded-xl bg-white shadow-sm dark:bg-gray-900 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left w-8">
                      <input
                        type="checkbox"
                        checked={rows.every((r) => r.selected)}
                        onChange={(e) => setRows((prev) => prev.map((r) => ({ ...r, selected: e.target.checked })))}
                        className="h-4 w-4 rounded"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {rows.map((row) => (
                    <tr
                      key={row.id}
                      className={clsx(
                        'transition-colors',
                        row.selected
                          ? 'bg-white dark:bg-gray-900'
                          : 'bg-gray-50 dark:bg-gray-800 opacity-50'
                      )}
                    >
                      <td className="px-4 py-2">
                        <input
                          type="checkbox"
                          checked={row.selected}
                          onChange={(e) => updateRow(row.id, { selected: e.target.checked })}
                          className="h-4 w-4 rounded"
                        />
                      </td>
                      <td className="px-4 py-2 text-gray-700 dark:text-gray-300 whitespace-nowrap">{row.date}</td>
                      <td className="px-4 py-2 text-gray-700 dark:text-gray-300 max-w-48 truncate">{row.description}</td>
                      <td className={clsx(
                        'px-4 py-2 font-medium whitespace-nowrap',
                        row.type === 'income' ? 'text-green-600' : 'text-red-600'
                      )}>
                        {row.type === 'income' ? '+' : '-'}{row.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-2">
                        <select
                          value={row.type}
                          onChange={(e) => updateRow(row.id, { type: e.target.value as 'income' | 'expense' })}
                          className="text-xs rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-1"
                        >
                          <option value="expense">Expense</option>
                          <option value="income">Income</option>
                        </select>
                      </td>
                      <td className="px-4 py-2">
                        <select
                          value={row.categoryId}
                          onChange={(e) => updateRow(row.id, { categoryId: e.target.value })}
                          className="text-xs rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-1 max-w-36"
                        >
                          <option value="">— select —</option>
                          {categories
                            .filter((c) => c.type === row.type || c.type === 'both')
                            .map((c) => (
                              <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                      </td>
                      <td className="px-4 py-2">
                        <select
                          value={row.assetId}
                          onChange={(e) => updateRow(row.id, { assetId: e.target.value })}
                          className="text-xs rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-1 max-w-36"
                        >
                          <option value="">No account</option>
                          {activeAssets.map((a) => (
                            <option key={a.id} value={a.id}>{a.name}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
