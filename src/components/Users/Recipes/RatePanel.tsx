import { useTranslation } from 'next-i18next';
import { StarPicker } from '../../Helper/Stars';

type ExistingRating = {
  score: number;
} | null;

export default function RatePanel({
  myRating,
  ratingScore,
  ratingError,
  ratingSuccess,
  submitting,
  onScoreChange,
  onSubmit,
  onDelete,
}: {
  myRating: ExistingRating;
  ratingScore: number;
  ratingError: string;
  ratingSuccess: string;
  submitting: boolean;
  onScoreChange: (score: number) => void;
  onSubmit: () => void;
  onDelete: () => void;
}) {
  const { t } = useTranslation('common');

  return (
    <div className="p-5">
      <h3 className="mb-4 ">{t('recipes.rateTitle')}</h3>

      {myRating && (
        <div className="mb-4 rounded-xl bg-cookie-100 px-3 py-2 ">
          {t('recipes.existingRating')}: {myRating.score}/5
          <button
            onClick={onDelete}
            className="ml-2  underline hover:no-underline"
          >
            {t('common.delete')}
          </button>
        </div>
      )}

      <div className="mb-4">
        <StarPicker value={ratingScore} onChange={onScoreChange} />
      </div>

      {ratingError && <p className="mb-2   text-myRed">{ratingError}</p>}
      {ratingSuccess && <p className="mb-2   text-herb-200">{ratingSuccess}</p>}

      <button
        onClick={onSubmit}
        disabled={submitting || ratingScore === 0}
        className={`w-full rounded-xl py-1 border-2 border-cookie-400   transition ${
          submitting || ratingScore === 0
            ? 'cursor-not-allowed  '
            : 'hover:text-white hover:bg-cookie-400'
        }`}
      >
        {!submitting && t('recipes.submitRating')}
      </button>
    </div>
  );
}
