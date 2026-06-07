export interface ScannedReceipt {
  amount?: number;
  description?: string;
  date?: string; // YYYY-MM-DD
}

export async function scanReceipt(imageBase64: string, mimeType: string): Promise<ScannedReceipt> {
  const response = await fetch('/api/openai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'scan-receipt', imageBase64, mimeType }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error ?? `Scan error ${response.status}`);
  }

  return response.json() as Promise<ScannedReceipt>;
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1] ?? '');
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
