import { useTranslation } from 'next-i18next';
import { StarPicker } from '../../../components/Helper/Stars';
import { ChefRating } from '../../../generated/graphql';

interface Props {
  myRating: Pick<ChefRating, 'score'> | null;
  ratingScore: number;
  ratingError: string;
  ratingSuccess: string;
  submitting: boolean;
  onScoreChange: (score: number) => void;
  onSubmit: () => void;
  onDelete: () => void;
}

export default function ChefRateForm({
  myRating,
  ratingScore,
  ratingError,
  ratingSuccess,
  submitting,
  onScoreChange,
  onSubmit,
  onDelete,
}: Props) {
  const { t } = useTranslation('common');

  return (
    <div className="rounded-2xl bg-surface p-5 shadow-xl">
      <h3 className="mb-4 ">{t('recipes.rateChefTitle')}</h3>

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
        className={`w-full rounded-xl py-1 border-2   transition ${
          submitting || ratingScore === 0
            ? 'cursor-not-allowed border-cookie-400  '
            : 'hover:text-white hover:bg-cookie-400'
        }`}
      >
        {submitting ? t('common.saving') : t('recipes.submitRating')}
      </button>
    </div>
  );
}
