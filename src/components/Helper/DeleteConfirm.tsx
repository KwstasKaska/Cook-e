import React from 'react';

type Props = {
  title: string;
  subtitle?: string;
  confirmLabel: string;
  cancelLabel: string;
  loading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function DeleteConfirm({
  title,
  confirmLabel,
  cancelLabel,
  loading,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl mx-4">
        <h2 className="mb-4 text-center text-xl font-bold">{title}</h2>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={onCancel}
            disabled={loading}
            className="w-full sm:w-auto rounded-full border border-gray-300 px-6 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="w-full sm:w-auto rounded-full px-6 py-2 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: '#E53E3E' }}
          >
            {loading ? '...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
