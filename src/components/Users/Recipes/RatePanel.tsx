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
      <h3 className="mb-4 text-xl font-bold">{t('recipes.rateTitle')}</h3>

      {/* Existing rating notice */}
      {myRating && (
        <div
          className="mb-4 rounded-xl px-3 py-2 text-sm"
          style={{ backgroundColor: '#B3D5F8', color: '#3F4756' }}
        >
          {t('recipes.existingRating')}: {myRating.score}/5
          <button
            onClick={onDelete}
            className="ml-2 text-xs underline hover:no-underline"
          >
            {t('common.delete')}
          </button>
        </div>
      )}

      {/* Star picker */}
      <div className="mb-4">
        <StarPicker value={ratingScore} onChange={onScoreChange} />
      </div>

      {ratingError && (
        <p className="mb-2 text-xs font-semibold text-red-500">{ratingError}</p>
      )}
      {ratingSuccess && (
        <p className="mb-2 text-xs font-semibold text-green-500">
          {ratingSuccess}
        </p>
      )}

      <button
        onClick={onSubmit}
        disabled={submitting || ratingScore === 0}
        className="w-full rounded-xl py-2 text-sm font-bold text-white transition"
        style={{
          backgroundColor: '#377CC3',
          opacity: submitting || ratingScore === 0 ? 0.5 : 1,
          cursor: submitting || ratingScore === 0 ? 'not-allowed' : 'pointer',
        }}
      >
        {submitting ? t('common.saving') : t('recipes.submitRating')}
      </button>
    </div>
  );
}
