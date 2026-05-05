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
          className="rounded-full px-8 py-2.5 text-sm font-bold transition hover:opacity-90 bg-myBlue-100 text-myGrey-200"
        >
          {t('common.prev')}
        </button>
      )}
      {hasMore && (
        <button
          onClick={onNext}
          className="rounded-full px-8 py-2.5 text-sm font-bold transition hover:opacity-90 bg-myBlue-100 text-myGrey-200"
        >
          {t('common.next')}
        </button>
      )}
    </div>
  );
}
