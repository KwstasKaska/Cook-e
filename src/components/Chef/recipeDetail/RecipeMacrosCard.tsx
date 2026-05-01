import React from 'react';
import { useTranslation } from 'next-i18next';
import { EditForm, MACRO_FIELDS } from './types';

interface Props {
  recipe: any;
  isEditing: boolean;
  editForm: EditForm;
  onUpdate: (field: keyof EditForm, value: unknown) => void;
}

export default function RecipeMacrosCard({
  recipe,
  isEditing,
  editForm,
  onUpdate,
}: Props) {
  const { t } = useTranslation('common');

  const hasMacros =
    recipe.caloriesTotal || recipe.protein || recipe.carbs || recipe.fat;
  if (!hasMacros && !isEditing) return null;

  return (
    <div className="rounded-2xl border border-gray-200 p-4">
      <h4 className="mb-3 text-center text-sm font-bold">
        {t('chef.recipe_detail.macros')}
      </h4>
      <div className="flex flex-col gap-2">
        {MACRO_FIELDS.map(({ field, unit, labelKey }) => (
          <div
            key={field}
            className="flex items-center justify-between text-xs"
          >
            <span className="text-gray-500">{t(labelKey)}</span>
            {isEditing ? (
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={0}
                  value={editForm[field]}
                  onChange={(e) => onUpdate(field, e.target.value)}
                  className="w-16 rounded border border-gray-200 px-2 py-0.5 text-right text-xs font-semibold outline-none"
                  style={{ color: '#377CC3' }}
                />
                <span className="text-gray-400">{unit}</span>
              </div>
            ) : (
              <span className="font-semibold" style={{ color: '#377CC3' }}>
                {recipe[field] ?? '—'} {unit}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
