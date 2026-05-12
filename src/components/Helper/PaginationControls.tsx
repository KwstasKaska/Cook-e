import { useTranslation } from 'next-i18next';

interface Props {
  hasPrev: boolean;
  hasMore: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export default function PaginationControls({
  hasPrev,
  hasMore,
  onPrev,
  onNext,
}: Props) {
  const { t } = useTranslation('common');

  if (!hasPrev && !hasMore) return null;

  return (
    <div className="mt-6 flex justify-center gap-4">
      <button
        onClick={onPrev}
        disabled={!hasPrev}
        className="w-32 rounded-xl border-2 border-cookie-400 py-1.5 text-cookie-400 transition hover:bg-cookie-400 hover:text-white disabled:opacity-0"
      >
        {t('common.prev')}
      </button>
      <button
        onClick={onNext}
        disabled={!hasMore}
        className="w-32 rounded-xl border-2 border-cookie-400 py-1.5 text-cookie-400 transition hover:bg-cookie-400 hover:text-white disabled:opacity-0"
      >
        {t('common.next')}
      </button>
    </div>
  );
}
