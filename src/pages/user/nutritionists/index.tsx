import { useState } from 'react';
import Navbar from '../../../components/Users/Navbar';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useNutritionistsQuery } from '../../../generated/graphql';
import useIsUser from '../../../utils/useIsUser';
import { pick } from '../../../utils/pick';

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default function NutritionistsPage() {
  const { loading: authLoading, isAuthorized } = useIsUser();
  if (authLoading || !isAuthorized) return null;
  return <ListView />;
}

function ListView() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const lang = (router.locale ?? 'el') as 'el' | 'en';
  const [search, setSearch] = useState('');

  const { data, loading } = useNutritionistsQuery({
    variables: { limit: 50, offset: 0 },
    fetchPolicy: 'network-only',
  });

  const nutritionists = data?.nutritionists ?? [];
  const filtered = nutritionists.filter((n) =>
    (n.user?.username ?? '').toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 pb-20 pt-12">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold text-white md:text-3xl">
            {t('nutritionists.searchTitle')}
          </h1>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('nutritionists.searchPlaceholder')}
            className="w-full rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-myBlue-200 md:w-64"
          />
        </div>

        <h2 className="mb-6 text-center text-2xl font-bold text-white">
          {t('nutritionists.popularTitle')}
        </h2>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-myBlue-200 border-t-transparent" />
          </div>
        ) : (
          <div className="relative mx-auto md:px-8">
            <div className="rounded-2xl bg-white px-4 pb-8 pt-2 shadow-lg">
              <div className="flex justify-end pr-1 pb-1 pt-3">
                <span className="text-sm text-gray-400">
                  {filtered.length} {t('nutritionists.showAll')}
                </span>
              </div>
              {filtered.length === 0 ? (
                <div className="py-12 text-center text-sm text-gray-400">
                  {t('nutritionists.noResults')}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-x-4 gap-y-14 pt-6 md:grid-cols-3 lg:grid-cols-4">
                  {filtered.map((nutr) => (
                    <NutrCard
                      key={nutr.id}
                      username={nutr.user?.username ?? '—'}
                      city={pick(nutr.city_el ?? '', nutr.city_en ?? '', lang)}
                      image={nutr.user?.image ?? null}
                      onClick={() =>
                        router.push(`/user/nutritionists/${nutr.id}`)
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function NutrCard({
  username,
  city,
  image,
  onClick,
}: {
  username: string;
  image?: string | null;
  city?: string | null;
  onClick: () => void;
}) {
  return (
    <div
      className="relative cursor-pointer rounded-2xl border-2 border-black px-4 pb-4 pt-10 shadow-sm transition-transform duration-200 hover:scale-105"
      onClick={onClick}
    >
      <div className="absolute -top-8 left-1/2 -translate-x-1/2">
        {image ? (
          <img
            src={image}
            alt={username}
            className="h-16 w-16 rounded-full border-4 border-white object-cover shadow"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-myBlue-100 shadow">
            <span className="text-xl font-bold text-white">
              {username[0]?.toUpperCase() ?? '?'}
            </span>
          </div>
        )}
      </div>
      <div className="text-center">
        <p className="mb-1 text-sm font-bold leading-tight text-gray-800">
          {username}
        </p>
        {city && <p className="text-xs text-gray-500">{city}</p>}
      </div>
    </div>
  );
}
