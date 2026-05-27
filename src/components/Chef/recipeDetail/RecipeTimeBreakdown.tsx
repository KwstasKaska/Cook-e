import React from 'react';
import { useTranslation } from 'next-i18next';
import { EditForm } from './types';

interface TimeField {
  label: string;
  field: 'prepTime' | 'cookTime' | 'restTime';
  value: number | null;
}

interface Props {
  timeBreakdown: TimeField[];
  totalTime: number;
  isEditing: boolean;
  editForm: EditForm;
  onUpdate: (field: keyof EditForm, value: unknown) => void;
}

export default function RecipeTimeBreakdown({
  timeBreakdown,
  totalTime,
  isEditing,
  editForm,
  onUpdate,
}: Props) {
  const { t } = useTranslation('common');

  return (
    <div className="rounded-2xl border border-cookie-400 p-4">
      <h4 className="mb-3 text-center ">
        {t('chef.recipe_detail.implementation_time')} {totalTime}{' '}
        {t('chef.recipe_detail.minutes')}
      </h4>
      <div className="flex flex-col gap-2">
        {timeBreakdown.map(({ label, field, value }) => (
          <div key={field} className="flex items-center justify-between gap-2">
            <span className="">{label}</span>
            {isEditing ? (
              <input
                type="number"
                min={0}
                value={editForm[field]}
                onChange={(e) => onUpdate(field, e.target.value)}
                className="w-16 rounded border border-cookie-400 px-2 py-0.5 text-right   outline-none focus:border-cookie-400"
              />
            ) : (
              <span className="flex-shrink-0  ">
                {value ?? 0} {t('chef.recipe_detail.minutes')}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
