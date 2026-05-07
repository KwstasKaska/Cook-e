import React from 'react';
import { useTranslation } from 'next-i18next';
import { pick } from '../../../utils/pick';
import { EditForm, StepRow } from './types';
import { useUtensilsQuery } from '../../../generated/graphql';

interface Props {
  recipe: any;
  lang: string;
  isEditing: boolean;
  editForm: EditForm;
  onUpdate: (field: keyof EditForm, value: unknown) => void;
}

export default function RecipeStepsList({
  recipe,
  lang,
  isEditing,
  editForm,
  onUpdate,
}: Props) {
  const { t } = useTranslation('common');
  const { data: utensilsData } = useUtensilsQuery({ skip: !isEditing });
  const allUtensils = utensilsData?.utensils ?? [];

  return (
    <div>
      <h3 className="mb-3 text-lg font-black">
        {t('chef.recipe_detail.execution')}
      </h3>

      {isEditing ? (
        <div className="flex flex-col gap-3">
          {editForm.steps.map((s: StepRow, i: number) => (
            <div key={i} className="flex items-start gap-2">
              <div className="mt-2 h-5 bg-myGrey-200 w-5 flex-shrink-0 rounded-full flex items-center justify-center text-xs font-bold text-white">
                {i + 1}
              </div>
              <textarea
                value={s.body}
                onChange={(e) => {
                  const updated = [...editForm.steps];
                  updated[i] = { ...updated[i], body: e.target.value };
                  onUpdate('steps', updated);
                }}
                rows={2}
                className="flex-1 resize-none rounded-lg border border-gray-200 bg-gray-50 px-2 py-1.5 text-sm outline-none focus:border-blue-300"
              />
              {editForm.steps.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    onUpdate(
                      'steps',
                      editForm.steps.filter((_, idx) => idx !== i),
                    )
                  }
                  className="mt-1.5 text-gray-300 hover:text-red-400 transition-colors flex-shrink-0"
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

          <button
            type="button"
            onClick={() =>
              onUpdate('steps', [
                ...editForm.steps,
                { id: Date.now(), body: '' },
              ])
            }
            className="mt-1 self-start rounded-full border px-4 py-1.5 text-xs font-semibold transition border-myGrey-200 hover:bg-gray-50"
          >
            + {t('chef.create_recipe.add_step')}
          </button>

          {allUtensils.length > 0 && (
            <div className="mt-4">
              <h4 className="mb-3 text-base font-black">
                {t('chef.create_recipe.utensils_label')}
              </h4>
              <div className="flex flex-wrap gap-2">
                {allUtensils.map((u) => {
                  const selected = editForm.utensilIds.includes(u.id);
                  return (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => {
                        const current = editForm.utensilIds;
                        onUpdate(
                          'utensilIds',
                          selected
                            ? current.filter((id) => id !== u.id)
                            : [...current, u.id],
                        );
                      }}
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
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {(recipe.steps ?? []).map((step: any, i: number) => (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center border-myGrey-200 rounded-full border-2" />
                <span className="text-sm text-gray-600">
                  {pick(step.body_el, step.body_en, lang)}
                </span>
              </div>
            ))}
          </div>

          {(recipe.utensils ?? []).length > 0 && (
            <div className="mt-4">
              <h4 className="mb-2 text-sm font-black">
                {t('chef.create_recipe.utensils_label')}
              </h4>
              <div className="flex flex-wrap gap-2">
                {recipe.utensils.map((u: any) => (
                  <span
                    key={u.id}
                    className="rounded-full px-3 py-1 text-xs font-semibold"
                    style={{ backgroundColor: '#F5F0D8', color: '#3F4756' }}
                  >
                    {lang === 'el' ? u.name_el : u.name_en}
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
