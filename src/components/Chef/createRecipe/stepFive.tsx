import { useTranslation } from 'next-i18next';
import { useUtensilsQuery } from '../../../generated/graphql';
import { FormData } from './types';

interface StepFiveProps {
  form: FormData;
  fieldErrors: Record<string, string>;
  selectedUtensilIds: number[];
  onAddStep: () => void;
  onUpdateStep: (id: number, value: string) => void;
  onRemoveStep: (id: number) => void;
  onToggleUtensil: (id: number) => void;
}

export default function StepFive({
  form,
  fieldErrors,
  selectedUtensilIds,
  onAddStep,
  onUpdateStep,
  onRemoveStep,
  onToggleUtensil,
}: StepFiveProps) {
  const { t, i18n } = useTranslation('common');
  const lang = i18n.language as 'el' | 'en';
  const { data: utensilsData } = useUtensilsQuery();

  return (
    <div>
      <h2 className="mb-5 text-myYellow">
        {t('chef.create_recipe.step5_title')}
      </h2>

      <h3 className="mb-4">{t('chef.create_recipe.execution_label')}</h3>

      {fieldErrors.steps && (
        <p className="mb-2 text-myRed">{fieldErrors.steps}</p>
      )}

      <div className="flex flex-col gap-4">
        {form.steps.map((s, i) => (
          <div key={s.id} className="flex items-start gap-2">
            <div className="mt-2 bg-cookie-300 h-5 w-5 flex-shrink-0 rounded-full flex items-center justify-center text-white">
              {i + 1}
            </div>
            <textarea
              value={s.text}
              onChange={(e) => onUpdateStep(s.id, e.target.value)}
              placeholder={t('chef.create_recipe.step_placeholder')}
              rows={3}
              className="flex-1 resize-none rounded-xl border-b border-cookie-200 bg-cookie-100 px-3 py-2 outline-none placeholder: focus:border-cookie-400 transition"
            />
            {form.steps.length > 1 && (
              <button
                type="button"
                onClick={() => onRemoveStep(s.id)}
                className="mt-2 flex-shrink-0  hover:text-myRed transition-colors"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onAddStep}
        className="mt-4 rounded-xl border-2 border-cookie-400 px-5 py-1.5 text-cookie-400 transition hover:bg-cookie-400 hover:text-white"
      >
        {t('chef.create_recipe.add_step')}
      </button>

      {utensilsData?.utensils && utensilsData.utensils.length > 0 && (
        <div className="mt-6">
          <h3 className="mb-3">{t('chef.create_recipe.utensils_label')}</h3>
          <div className="flex flex-wrap gap-2">
            {utensilsData.utensils.map((u) => {
              const selected = selectedUtensilIds.includes(u.id);
              return (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => onToggleUtensil(u.id)}
                  className={`rounded-full px-4 py-1.5 transition ${
                    selected
                      ? 'bg-cookie-400 text-white'
                      : 'bg-cookie-100 text-myText-base hover:bg-cookie-200'
                  }`}
                >
                  {lang === 'el' ? u.name_el : u.name_en}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {fieldErrors.server && (
        <p className="mt-4 text-myRed">{fieldErrors.server}</p>
      )}
    </div>
  );
}
