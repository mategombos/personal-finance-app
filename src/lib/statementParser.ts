export interface ParsedRow {
  date: string; // YYYY-MM-DD
  amount: number;
  type: 'income' | 'expense';
  description: string;
}

export async function parseStatement(csvText: string): Promise<ParsedRow[]> {
  const csv = csvText.split('\n').slice(0, 200).join('\n');

  const response = await fetch('/api/openai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'parse-statement', csv }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error ?? `Parse error ${response.status}`);
  }

  return response.json() as Promise<ParsedRow[]>;
}
