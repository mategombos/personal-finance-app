'use client';

import { Modal } from './Modal';
import { Button } from './Button';
import { useTranslations } from '@/hooks/useTranslations';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  dangerous?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  dangerous = false,
}: ConfirmDialogProps) {
  const t = useTranslations();

  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">{description}</p>
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose}>{t('common.cancel')}</Button>
        <Button variant={dangerous ? 'danger' : 'primary'} onClick={() => { onConfirm(); onClose(); }}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
