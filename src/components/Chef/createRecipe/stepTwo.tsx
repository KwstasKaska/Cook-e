import { useTranslation } from 'next-i18next';
import { Difficulty } from '../../../generated/graphql';
import { FormData, inputClass } from './types';

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
      <h2 className="mb-5 text-myYellow">
        {t('chef.create_recipe.step2_title')}
      </h2>

      <h3 className="mb-3 mt-6">
        {t('chef.create_recipe.personal_tip_label')}
      </h3>
      <input
        type="text"
        placeholder={t('chef.create_recipe.personal_tip_placeholder')}
        value={form.personalNote}
        onChange={(e) => onUpdate('personalNote', e.target.value)}
        className={inputClass}
      />

      <h3 className="mb-3 mt-6">{t('chef.create_recipe.total_time_label')}</h3>
      <div className="flex flex-col gap-3">
        {timeFields.map(({ label, field }) => (
          <div key={field} className="flex items-center justify-between gap-4">
            <span>{label}</span>
            <input
              type="number"
              min={0}
              value={form[field]}
              onChange={(e) => onUpdate(field, e.target.value)}
              placeholder={`10 ${t('chef.create_recipe.minutes')}`}
              className="w-28 border-b border-cookie-200 bg-transparent py-1 outline-none text-right   focus:border-cookie-400 transition"
            />
          </div>
        ))}
      </div>
      {(fieldErrors.prepTime || fieldErrors.cookTime) && (
        <p className="mt-1 text-myRed">
          {fieldErrors.prepTime || fieldErrors.cookTime}
        </p>
      )}

      <h3 className="mb-3 mt-6">{t('chef.create_recipe.difficulty_label')}</h3>
      <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
        {difficultyOptions.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => onUpdate('difficulty', value)}
            className={`rounded-full px-5 py-2 transition ${
              form.difficulty === value
                ? 'bg-cookie-400 text-white'
                : 'bg-cookie-100 text-myText-base hover:bg-cookie-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      {fieldErrors.difficulty && (
        <p className="mt-1 text-myRed">{fieldErrors.difficulty}</p>
      )}

      <h3 className="mb-1 mt-6">{t('chef.create_recipe.macros_label')}</h3>
      <p className="mb-3 text-myText-muted">
        {t('chef.create_recipe.macros_hint')}
      </p>
      <div className="flex flex-col gap-3">
        {macroFields.map(({ label, field, unit }) => (
          <div key={field} className="flex items-center justify-between gap-4">
            <span>{label}</span>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min={0}
                value={form[field]}
                onChange={(e) => onUpdate(field, e.target.value)}
                placeholder="0"
                className="w-24 border-b border-cookie-200 bg-transparent py-1 outline-none text-right   focus:border-cookie-400 transition"
              />
              <span className="text-myText-muted">{unit}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
