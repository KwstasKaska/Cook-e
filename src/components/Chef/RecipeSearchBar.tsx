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
    <div className="flex w-full items-center gap-2 md:flex-1 md:gap-3 md:justify-end">
      <input
        type="text"
        placeholder={t('chef.recipes.search_placeholder')}
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="min-w-0 flex-1 rounded-full border border-gray-200 px-4 py-2 text-sm outline-none focus:border-myBlue-200 md:max-w-xs"
      />
      <select
        value={sort}
        onChange={(e) =>
          onSortChange(e.target.value as 'newest' | 'oldest' | 'alpha')
        }
        className="flex-shrink-0 rounded-full border border-gray-200 px-3 py-2 text-sm outline-none max-w-[110px] md:max-w-none"
      >
        <option value="newest">{t('chef.recipes.sort_newest')}</option>
        <option value="oldest">{t('chef.recipes.sort_oldest')}</option>
        <option value="alpha">{t('chef.recipes.sort_alpha')}</option>
      </select>
    </div>
  );
}
