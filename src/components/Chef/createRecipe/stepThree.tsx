import { useTranslation } from 'next-i18next';
import { FormData, CATEGORY_OPTIONS } from './types';
import { getCategoryLabel } from '../../../utils/categoryLabel';

interface StepThreeProps {
  form: FormData;
  onUpdate: (field: keyof FormData, value: unknown) => void;
}

export default function StepThree({ form, onUpdate }: StepThreeProps) {
  const { t, i18n } = useTranslation('common');
  const lang = i18n.language as 'el' | 'en';

  return (
    <div>
      <h2 className="mb-5 text-myYellow">
        {t('chef.create_recipe.step3_title')}
      </h2>

      <h3 className="mb-3">{t('chef.create_recipe.food_type_label')}</h3>
      <div className="flex flex-wrap gap-2 mb-5">
        {CATEGORY_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() =>
              onUpdate('category', form.category === opt.value ? '' : opt.value)
            }
            className={`rounded-full px-4 py-1.5 transition ${
              form.category === opt.value
                ? 'bg-cookie-400 text-white'
                : 'bg-cookie-100 text-myText-base hover:bg-cookie-200'
            }`}
          >
            {getCategoryLabel(opt.value, lang)}
          </button>
        ))}
      </div>

      <h3 className="mb-3">{t('chef.create_recipe.summary_label')}</h3>
      <textarea
        value={form.summary}
        onChange={(e) => onUpdate('summary', e.target.value)}
        placeholder={t('chef.create_recipe.summary_placeholder')}
        rows={3}
        className="w-full resize-none bg-transparent outline-none placeholder:text-myText-muted border-b border-cookie-200 focus:border-cookie-400 transition"
      />
    </div>
  );
}
