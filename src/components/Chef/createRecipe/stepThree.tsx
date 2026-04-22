import { useTranslation } from 'next-i18next';
import { FormData, CATEGORY_OPTIONS, inputClass } from './types';

// ─── Step 3: Category + Cuisine + Summary ─────────────────────────────────────

interface StepThreeProps {
  form: FormData;
  onUpdate: (field: keyof FormData, value: unknown) => void;
}

export default function StepThree({ form, onUpdate }: StepThreeProps) {
  const { t, i18n } = useTranslation('common');
  const lang = i18n.language as 'el' | 'en';

  return (
    <div>
      <h2 className="mb-5 text-2xl font-black" style={{ color: '#EAB308' }}>
        {t('chef.create_recipe.step3_title')}
      </h2>

      <h3 className="mb-3 text-base font-black" style={{ color: '#3F4756' }}>
        {t('chef.create_recipe.food_type_label')}
      </h3>
      <div className="flex flex-wrap gap-2 mb-5">
        {CATEGORY_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() =>
              onUpdate('category', form.category === opt.value ? '' : opt.value)
            }
            className="rounded-full px-4 py-1.5 text-sm font-semibold transition"
            style={{
              backgroundColor:
                form.category === opt.value ? '#EAB308' : '#F5F0D8',
              color: '#3F4756',
            }}
          >
            {lang === 'el' ? opt.labelEl : opt.labelEn}
          </button>
        ))}
      </div>

      <div className="mb-4">
        <label
          className="mb-1 block text-sm font-semibold"
          style={{ color: '#3F4756' }}
        >
          {t('chef.create_recipe.cuisine_label')}
        </label>
        <input
          type="text"
          placeholder={t('chef.create_recipe.cuisine_placeholder')}
          value={form.cuisine}
          onChange={(e) => onUpdate('cuisine', e.target.value)}
          className={inputClass}
          style={{ color: '#EAB308' }}
        />
      </div>

      <h3 className="mb-3 text-base font-black" style={{ color: '#3F4756' }}>
        {t('chef.create_recipe.summary_label')}
      </h3>
      <textarea
        value={form.summary}
        onChange={(e) => onUpdate('summary', e.target.value)}
        placeholder={t('chef.create_recipe.summary_placeholder')}
        rows={3}
        className="w-full resize-none bg-transparent text-sm outline-none placeholder:text-gray-300 border-b border-gray-200"
        style={{ color: '#3F4756' }}
      />
    </div>
  );
}
