import React from 'react';
import { useTranslation } from 'next-i18next';
import { pick } from '../../../utils/pick';
import { EditForm } from './types';

interface Props {
  recipe: any;
  lang: string;
  isEditing: boolean;
  editForm: EditForm;
  onUpdate: (field: keyof EditForm, value: unknown) => void;
}

export default function RecipeDescriptionCard({
  recipe,
  lang,
  isEditing,
  editForm,
  onUpdate,
}: Props) {
  const { t } = useTranslation('common');

  return (
    <div className="mb-6 rounded-xl p-4" style={{ backgroundColor: '#B3D5F8' }}>
      {isEditing ? (
        <>
          <textarea
            value={editForm.description}
            onChange={(e) => onUpdate('description', e.target.value)}
            rows={3}
            placeholder={t('chef.recipe_detail.placeholder_description')}
            className="mb-2 w-full resize-none rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm outline-none"
            style={{ color: '#3F4756' }}
          />
          <textarea
            value={editForm.chefComment}
            onChange={(e) => onUpdate('chefComment', e.target.value)}
            rows={2}
            placeholder={t('chef.recipe_detail.placeholder_chef_comment')}
            className="w-full resize-none rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm italic outline-none"
            style={{ color: '#3F4756' }}
          />
        </>
      ) : (
        <>
          {recipe.description_el && (
            <p
              className="mb-3 text-sm leading-relaxed"
              style={{ color: '#3F4756' }}
            >
              {pick(recipe.description_el, recipe.description_en ?? '', lang)}
            </p>
          )}
          {recipe.chefComment_el && (
            <p className="text-sm italic" style={{ color: '#3F4756' }}>
              "{pick(recipe.chefComment_el, recipe.chefComment_en ?? '', lang)}"
            </p>
          )}
        </>
      )}
      <div className="mt-3 flex items-center gap-3">
        <div className="h-9 w-9 flex-shrink-0 rounded-full bg-gray-300" />
        <span className="text-sm font-semibold" style={{ color: '#3F4756' }}>
          {recipe.author?.user?.username ?? '—'}
        </span>
      </div>
    </div>
  );
}
