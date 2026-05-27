import React from 'react';

const SnapshotBox = ({
  title,
  loading,
  emptyLabel,
  onSeeAll,
  seeAllLabel,
  children,
}: {
  title: string;
  loading: boolean;
  emptyLabel: string;
  onSeeAll: () => void;
  seeAllLabel: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col rounded-2xl bg-surface p-5 shadow-lg">
    <h3 className="mb-4 text-center">{title}</h3>
    {loading ? (
      <div className="flex flex-1 items-center justify-center py-6">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-cookie-400 border-t-transparent" />
      </div>
    ) : !children ||
      (Array.isArray(children) &&
        (children as React.ReactNode[]).length === 0) ? (
      <p className="flex-1">{emptyLabel}</p>
    ) : (
      <div className="grid grid-cols-2 gap-3">{children}</div>
    )}
    <button
      onClick={onSeeAll}
      className="mt-4 self-end text-cookie-400 hover:underline"
    >
      {seeAllLabel}
    </button>
  </div>
);

export default SnapshotBox;
