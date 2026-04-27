import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useMeQuery } from '../generated/graphql';

const useIsChef = () => {
  const { data, loading } = useMeQuery({});
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!data?.me) {
        router.replace('/login?next=' + router.asPath);
      } else if (data.me.role !== 'CHEF') {
        router.replace('/' + data.me.role.toLowerCase());
      }
    }
  }, [loading, data, router]);

  const isAuthorized = !loading && data?.me?.role === 'CHEF';

  return { loading, isAuthorized };
};

export default useIsChef;
