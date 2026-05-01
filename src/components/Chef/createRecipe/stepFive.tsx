import { useTranslation } from 'next-i18next';
import { useUtensilsQuery } from '../../../generated/graphql';
import { FormData } from './types';

// ─── Step 5: Execution Steps + Utensils ──────────────────────────────────────

interface StepFiveProps {
  form: FormData;
  fieldErrors: Record<string, string>;
  serverError: string;
  selectedUtensilIds: number[];
  onAddStep: () => void;
  onUpdateStep: (id: number, value: string) => void;
  onRemoveStep: (id: number) => void;
  onToggleUtensil: (id: number) => void;
}

export default function StepFive({
  form,
  fieldErrors,
  serverError,
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
      <h2 className="mb-5 text-2xl font-black" style={{ color: '#EAB308' }}>
        {t('chef.create_recipe.step5_title')}
      </h2>

      <h3 className="mb-4 text-base  font-black">
        {t('chef.create_recipe.execution_label')}
      </h3>

      {fieldErrors.steps && (
        <p className="mb-2 text-xs text-red-500">{fieldErrors.steps}</p>
      )}

      <div className="flex flex-col gap-4">
        {form.steps.map((s, i) => (
          <div key={s.id} className="flex items-start gap-2">
            <div className="mt-2 bg-myGrey-200 h-5 w-5 flex-shrink-0 rounded-full flex items-center justify-center text-xs font-bold text-white">
              {i + 1}
            </div>
            <textarea
              value={s.text}
              onChange={(e) => onUpdateStep(s.id, e.target.value)}
              placeholder={t('chef.create_recipe.step_placeholder')}
              rows={3}
              className="flex-1 resize-none rounded-xl border-b border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none placeholder:text-gray-300  focus:border-gray-400"
            />
            {form.steps.length > 1 && (
              <button
                type="button"
                onClick={() => onRemoveStep(s.id)}
                className="mt-2 flex-shrink-0 text-gray-300 hover:text-red-400 transition-colors"
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
        className="mt-4 rounded-full border px-5 py-2 text-sm font-semibold transition  border-myGrey-200 hover:bg-gray-50"
      >
        {t('chef.create_recipe.add_step')}
      </button>

      {/* Utensils */}
      {utensilsData?.utensils && utensilsData.utensils.length > 0 && (
        <div className="mt-6">
          <h3 className="mb-3 text-base  font-black">
            {t('chef.create_recipe.utensils_label')}
          </h3>
          <div className="flex flex-wrap gap-2">
            {utensilsData.utensils.map((u) => {
              const selected = selectedUtensilIds.includes(u.id);
              return (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => onToggleUtensil(u.id)}
                  className="rounded-full px-4 py-1.5 text-sm font-semibold transition"
                  style={{
                    backgroundColor: selected ? '#EAB308' : '#F5F0D8',
                    color: '#3F4756',
                  }}
                >
                  {lang === 'el' ? u.name_el : u.name_en}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {(serverError || fieldErrors.server) && (
        <p className="mt-4 text-xs text-red-500">
          {serverError || fieldErrors.server}
        </p>
      )}
    </div>
  );
}
