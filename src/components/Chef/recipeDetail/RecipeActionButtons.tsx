import React from 'react';
import { useTranslation } from 'next-i18next';

interface Props {
  isEditing: boolean;
  saving: boolean;
  deleting: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
}

export default function RecipeActionButtons({
  isEditing,
  saving,
  deleting,
  onEdit,
  onSave,
  onCancel,
  onDelete,
}: Props) {
  const { t } = useTranslation('common');

  if (!isEditing) {
    return (
      <button
        type="button"
        onClick={onEdit}
        className="flex items-center justify-center gap-2 rounded-2xl border-2 border-cookie-400 px-4 py-1.5  hover:text-white transition hover:bg-cookie-400"
      >
        {t('chef.recipe_detail.edit')}
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="flex items-center justify-center gap-2 rounded-2xl  px-4 py-1.5 border-2 border-herb-200 text-herb-200  hover:text-white transition  hover:bg-herb-200 disabled:opacity-50"
      >
        {saving ? t('common.saving') : t('chef.recipe_detail.save')}
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="flex items-center justify-center gap-2 rounded-2xl  px-4 py-1.5 text-myYellow border-2 border-myYellow hover:text-white transition hover:bg-myYellow "
      >
        {t('chef.recipe_detail.cancel')}
      </button>
      <button
        type="button"
        onClick={onDelete}
        disabled={deleting}
        className="flex items-center justify-center gap-2 rounded-2xl  px-4 py-1.5 border-2 border-myRed text-myRed  transition hover:bg-myRed hover:text-white disabled:opacity-50"
      >
        {deleting ? t('common.loading') : t('chef.recipe_detail.delete')}
      </button>
    </div>
  );
}
