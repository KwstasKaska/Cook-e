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
      {hasPrev && (
        <button
          onClick={onPrev}
          className="rounded-xl border-2 border-cookie-400 px-8 py-1.5  transition hover:bg-cookie-400 hover:text-white"
        >
          {t('common.prev')}
        </button>
      )}
      {hasMore && (
        <button
          onClick={onNext}
          className="rounded-xl border-2 border-cookie-400 px-8 py-1.5  transition hover:bg-cookie-400 hover:text-white"
        >
          {t('common.next')}
        </button>
      )}
    </div>
  );
}
