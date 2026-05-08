import React from 'react';
import { useTranslation } from 'next-i18next';

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
}

export default function RecipeSearchBar({ search, onSearchChange }: Props) {
  const { t } = useTranslation('common');

  return (
    <div className="flex w-full items-center md:flex-1 md:justify-end">
      <input
        type="text"
        placeholder={t('chef.recipes.search_placeholder')}
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="min-w-0 flex-1 rounded-full border border-gray-200 px-4 py-2 text-sm outline-none focus:border-myBlue-200 md:max-w-xs"
      />
    </div>
  );
}
