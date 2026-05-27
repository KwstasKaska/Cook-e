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

const DeleteConfirm = ({
  title,
  confirmLabel,
  cancelLabel,
  loading,
  onConfirm,
  onCancel,
}: Props) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
    <div className="relative z-10 w-full max-w-sm rounded-2xl bg-surface p-8  mx-4">
      <h2 className="mb-4 text-center">{title}</h2>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button
          onClick={onCancel}
          disabled={loading}
          className="w-full sm:w-auto rounded-full border border-cookie-200 px-6 py-2   transition hover:bg-cookie-100 disabled:opacity-50"
        >
          {cancelLabel}
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="w-full sm:w-auto rounded-full bg-myRed px-6 py-2  text-white transition hover:bg-myRed/90 disabled:opacity-50"
        >
          {loading ? '...' : confirmLabel}
        </button>
      </div>
    </div>
  </div>
);

export default DeleteConfirm;
