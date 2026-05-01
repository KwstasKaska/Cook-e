import React from 'react';
import { useTranslation } from 'next-i18next';
import Stars from '../Helper/Stars';

type StarKey = 1 | 2 | 3 | 4 | 5;

interface RatingModalProps {
  onClose: () => void;
  average: number;
  total: number;
  counts: Record<StarKey, number>;
  overlay?: boolean;
}

export default function RatingModal({
  onClose,
  average,
  total,
  counts,
  overlay = true,
}: RatingModalProps) {
  const { t } = useTranslation('common');

  const breakdown = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    pct: total > 0 ? Math.round((counts[stars as StarKey] / total) * 100) : 0,
  }));

  const card = (
    <div className="rounded-2xl bg-white p-8 shadow-2xl w-full max-w-sm">
      <button
        onClick={onClose}
        className="mb-4 flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-100 transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-4 w-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
          />
        </svg>
      </button>

      <h2 className="mb-3 text-center  text-xl font-bold">
        {t('chef.rating.title')}
      </h2>

      <div className="mb-1 flex justify-center">
        <div className="flex items-center gap-2 rounded-full border-2 border-gray-200 px-4 py-2">
          <Stars rating={average} size="md" />
          <span className="font-bold text-gray-700">
            {average.toFixed(1)}/ 5
          </span>
        </div>
      </div>
      <p className="mb-6 text-center text-sm text-gray-400">
        {total} {t('chef.rating.reviews')}
      </p>

      <div className="flex flex-col gap-4">
        {breakdown.map((row) => (
          <div key={row.stars} className="flex items-center gap-3">
            <span className="w-20 text-sm text-gray-600">
              {row.stars}{' '}
              {row.stars === 1
                ? t('chef.rating.stars_singular')
                : t('chef.rating.stars_plural')}
            </span>
            <div className="relative flex-1 h-8 rounded-full bg-gray-100 overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
                style={{ width: `${row.pct}%`, backgroundColor: '#EAB308' }}
              />
            </div>
            <span className="w-8 text-xs text-gray-400 text-right">
              {counts[row.stars as StarKey]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  if (!overlay) return card;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 mx-4 w-full max-w-sm">{card}</div>
    </div>
  );
}
