import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useMeQuery } from '../generated/graphql';

const useIsUser = () => {
  const { data, loading } = useMeQuery({});
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!data?.me) {
        router.replace('/login?next=' + router.pathname);
      } else if (data.me.role !== 'USER') {
        router.replace('/' + data.me.role.toLowerCase());
      }
    }
  }, [loading, data, router]);

  const isAuthorized = !loading && data?.me?.role === 'USER';

  return { loading, isAuthorized };
};

export default useIsUser;
