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

const ListView = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const lang = (router.locale ?? 'el') as 'el' | 'en';

  const { data, loading } = useNutritionistsQuery({
    variables: { limit: 50, offset: 0 },
    fetchPolicy: 'network-only',
  });

  const nutritionists = data?.nutritionists ?? [];

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-3xl px-6 pb-24 pt-10 lg:max-w-4xl">
        <button
          onClick={() => router.back()}
          className="mb-6 hover:text-cookie-400"
        >
          {t('common.back')}
        </button>

        <h1 className="mb-2 text-center">{t('nutritionists.popularTitle')}</h1>

        <div className="mb-8 flex flex-col gap-1.5 text-left">
          <p>{t('nutritionists.listHint1')}</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-cookie-400 border-t-transparent" />
          </div>
        ) : (
          <div className="rounded-2xl bg-surface px-4 pb-8 pt-2 shadow-lg">
            {nutritionists.length === 0 ? (
              <div className="py-12 text-center">
                {t('nutritionists.noResults')}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 pt-2 md:grid-cols-3 lg:grid-cols-4">
                {nutritionists.map((nutr) => (
                  <NutrCard
                    key={nutr.id}
                    username={nutr.user?.username ?? '—'}
                    city={pick(nutr.city_el ?? '', nutr.city_en ?? '', lang)}
                    image={nutr.user?.image ?? null}
                    onClick={() =>
                      router.push(`/user/nutritionists/${nutr.user?.id}`)
                    }
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const NutrCard = ({
  username,
  city,
  image,
  onClick,
}: {
  username: string;
  image?: string | null;
  city?: string | null;
  onClick: () => void;
}) => {
  return (
    <div
      className="cursor-pointer rounded-2xl bg-surface shadow-xl overflow-hidden transition duration-200 hover:scale-105 flex flex-col items-center gap-3 pb-4"
      onClick={onClick}
    >
      <div className="w-full bg-cookie-100 flex justify-center pt-6 pb-4">
        {image ? (
          <img
            src={image}
            alt={username}
            className="h-16 w-16 rounded-full border-2 border-cookie-400 object-cover shadow"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-surface bg-cookie-200 shadow">
            <span className="text-myText-heading">
              {username[0]?.toUpperCase() ?? '?'}
            </span>
          </div>
        )}
      </div>
      <div className="text-center px-4">
        <p className="mb-1 w-full break-words text-center">{username}</p>
        {city && <p>{city}</p>}
      </div>
    </div>
  );
};
