import React from 'react';
import { useTranslation } from 'next-i18next';

interface Props {
  search: string;
  sort: 'newest' | 'oldest' | 'alpha';
  onSearchChange: (value: string) => void;
  onSortChange: (value: 'newest' | 'oldest' | 'alpha') => void;
}

export default function RecipeSearchBar({
  search,
  sort,
  onSearchChange,
  onSortChange,
}: Props) {
  const { t } = useTranslation('common');

  return (
    <div className="flex flex-1 items-center gap-3 md:justify-end">
      <input
        type="text"
        placeholder={t('chef.recipes.search_placeholder')}
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="flex-1 rounded-full border border-gray-200 px-4 py-2 text-sm outline-none focus:border-myBlue-200 md:max-w-xs"
      />
      <select
        value={sort}
        onChange={(e) =>
          onSortChange(e.target.value as 'newest' | 'oldest' | 'alpha')
        }
        className="rounded-full border border-gray-200 px-3 py-2 text-sm outline-none"
      >
        <option value="newest">{t('chef.recipes.sort_newest')}</option>
        <option value="oldest">{t('chef.recipes.sort_oldest')}</option>
        <option value="alpha">{t('chef.recipes.sort_alpha')}</option>
      </select>
    </div>
  );
}
