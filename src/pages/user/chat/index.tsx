import Navbar from '../../../components/Users/Navbar';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useUsersQuery } from '../../../generated/graphql';
import useIsUser from '../../../utils/useIsUser';
import { useChatContext } from '../../../components/Chat/ChatContext';

const LIMIT = 20;

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default function ChatPage() {
  const { loading: authLoading, isAuthorized } = useIsUser();
  if (authLoading || !isAuthorized) return null;
  return <ChatList />;
}

function ChatList() {
  const { t } = useTranslation('common');
  const { openConversation } = useChatContext();

  const { data, loading, fetchMore } = useUsersQuery({
    variables: { limit: LIMIT, offset: 0 },
    fetchPolicy: 'network-only',
  });

  const users = data?.users ?? [];
  const hasMore = users.length > 0 && users.length % LIMIT === 0;

  const handleLoadMore = () => {
    fetchMore({ variables: { limit: LIMIT, offset: users.length } });
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 pb-20 pt-12">
        <h1 className="mb-6 text-center text-2xl font-bold text-white md:text-3xl">
          {t('chat.title')}
        </h1>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-myBlue-200 border-t-transparent" />
          </div>
        ) : (
          <div className="relative mx-auto md:px-8">
            <div className="rounded-2xl bg-white px-4 pb-8 pt-2 shadow-lg">
              <div className="flex justify-end pr-1 pb-1 pt-3">
                <span className="text-sm text-gray-400">
                  {users.length} {t('chat.usersCount')}
                </span>
              </div>
              {users.length === 0 ? (
                <div className="py-12 text-center text-sm text-gray-400">
                  {t('chat.noResults')}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-x-4 gap-y-14 pt-6 md:grid-cols-3 lg:grid-cols-4">
                  {users.map((u) => (
                    <UserCard
                      key={u.id}
                      username={u.username}
                      image={u.image ?? null}
                      onClick={() => openConversation(u.id)}
                    />
                  ))}
                </div>
              )}

              {hasMore && (
                <div className="mt-10 flex justify-center">
                  <button
                    onClick={handleLoadMore}
                    className="rounded-full border border-myBlue-200 px-6 py-2 text-sm font-semibold text-myBlue-200 transition hover:bg-myBlue-200 hover:text-white"
                  >
                    {t('chat.loadMore')}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function UserCard({
  username,
  image,
  onClick,
}: {
  username: string;
  image: string | null;
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
        <p className="text-sm font-bold leading-tight text-gray-800">
          {username}
        </p>
      </div>
    </div>
  );
}
