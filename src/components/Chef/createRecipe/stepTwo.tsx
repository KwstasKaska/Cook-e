import { useTranslation } from 'next-i18next';
import { Difficulty } from '../../../generated/graphql';
import { FormData, inputClass, labelClass } from './types';

// ─── Step 2: Personal Note + Times + Difficulty + Macros ─────────────────────

interface StepTwoProps {
  form: FormData;
  fieldErrors: Record<string, string>;
  onUpdate: (field: keyof FormData, value: unknown) => void;
}

export default function StepTwo({ form, fieldErrors, onUpdate }: StepTwoProps) {
  const { t } = useTranslation('common');

  const difficultyOptions: { value: Difficulty; label: string }[] = [
    { value: Difficulty.Easy, label: t('chef.create_recipe.easy') },
    { value: Difficulty.Medium, label: t('chef.create_recipe.medium') },
    { value: Difficulty.Difficult, label: t('chef.create_recipe.hard') },
  ];

  const timeFields: {
    label: string;
    field: 'prepTime' | 'cookTime' | 'restTime';
  }[] = [
    { label: t('chef.create_recipe.prep_time'), field: 'prepTime' },
    { label: t('chef.create_recipe.cook_time'), field: 'cookTime' },
    { label: t('chef.create_recipe.rest_time'), field: 'restTime' },
  ];

  const macroFields: {
    label: string;
    field: 'caloriesTotal' | 'protein' | 'carbs' | 'fat';
    unit: string;
  }[] = [
    {
      label: t('chef.create_recipe.calories'),
      field: 'caloriesTotal',
      unit: 'kcal',
    },
    { label: t('chef.create_recipe.protein'), field: 'protein', unit: 'g' },
    { label: t('chef.create_recipe.carbs'), field: 'carbs', unit: 'g' },
    { label: t('chef.create_recipe.fat'), field: 'fat', unit: 'g' },
  ];

  return (
    <div>
      <h2 className="mb-5 text-2xl font-black" style={{ color: '#EAB308' }}>
        {t('chef.create_recipe.step2_title')}
      </h2>

      <label className={labelClass}>
        {t('chef.create_recipe.personal_tip_label')}
      </label>
      <input
        type="text"
        placeholder={t('chef.create_recipe.personal_tip_placeholder')}
        value={form.personalNote}
        onChange={(e) => onUpdate('personalNote', e.target.value)}
        className={inputClass}
      />

      {/* Times */}
      <h3 className="mb-3 mt-6 text-base font-black">
        {t('chef.create_recipe.total_time_label')}
      </h3>
      <div className="flex flex-col gap-3">
        {timeFields.map(({ label, field }) => (
          <div key={field} className="flex items-center justify-between gap-4">
            <span className="text-sm">{label}</span>
            <input
              type="number"
              min={0}
              value={form[field]}
              onChange={(e) => onUpdate(field, e.target.value)}
              placeholder={`10 ${t('chef.create_recipe.minutes')}`}
              className="w-28 border-b border-gray-300 bg-transparent py-1 text-sm outline-none text-right font-semibold"
              style={{ color: '#EAB308' }}
            />
          </div>
        ))}
      </div>
      {(fieldErrors.prepTime || fieldErrors.cookTime) && (
        <p className="mt-1 text-xs text-red-500">
          {fieldErrors.prepTime || fieldErrors.cookTime}
        </p>
      )}

      {/* Difficulty */}
      <h3 className="mb-3 mt-6 text-base font-black">
        {t('chef.create_recipe.difficulty_label')}
      </h3>
      <div className="flex gap-3">
        {difficultyOptions.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => onUpdate('difficulty', value)}
            className="rounded-full px-5 py-2 text-sm font-semibold transition"
            style={{
              backgroundColor:
                form.difficulty === value ? '#EAB308' : '#F5F0D8',
              color: '#3F4756',
            }}
          >
            {label}
          </button>
        ))}
      </div>
      {fieldErrors.difficulty && (
        <p className="mt-1 text-xs text-red-500">{fieldErrors.difficulty}</p>
      )}

      {/* Macros */}
      <h3 className="mb-1 mt-6 text-base font-black">
        {t('chef.create_recipe.macros_label')}
      </h3>
      <p className="mb-3 text-xs text-gray-400">
        {t('chef.create_recipe.macros_hint')}
      </p>
      <div className="flex flex-col gap-3">
        {macroFields.map(({ label, field, unit }) => (
          <div key={field} className="flex items-center justify-between gap-4">
            <span className="text-sm">{label}</span>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min={0}
                value={form[field]}
                onChange={(e) => onUpdate(field, e.target.value)}
                placeholder="0"
                className="w-24 border-b border-gray-300 bg-transparent py-1 text-sm outline-none text-right font-semibold"
                style={{ color: '#EAB308' }}
              />
              <span className="text-xs text-gray-400">{unit}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
