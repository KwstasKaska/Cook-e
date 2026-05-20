import Navbar from '../../../components/Users/Navbar';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
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

const ChatList = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
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
      <div className="relative z-10 mx-auto w-full max-w-3xl lg:max-w-4xl  pb-20 pt-12">
        <button
          onClick={() => router.push('/user')}
          className="mb-6 ml-7 text-myText-muted hover:text-cookie-400"
        >
          {t('common.back')}
        </button>

        <h1 className="mb-6 text-center">{t('chat.title')}</h1>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-2xl border-2 border-cookie-400" />
          </div>
        ) : (
          <div className="relative mx-auto md:px-8">
            <div className="rounded-2xl bg-surface px-4 pb-8 pt-2 shadow-lg">
              {users.length === 0 ? (
                <div className="py-12 text-center text-myText-muted">
                  {t('chat.noResults')}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 pt-2 md:grid-cols-3 lg:grid-cols-4">
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
                    className="rounded-full border-2 border-cookie-400 px-6 py-2 transition hover:bg-cookie-400 hover:text-white"
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
};

const UserCard = ({
  username,
  image,
  onClick,
}: {
  username: string;
  image: string | null;
  onClick: () => void;
}) => (
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
    <div className="px-4 text-center">
      <p className="leading-tight">{username}</p>
    </div>
  </div>
);
