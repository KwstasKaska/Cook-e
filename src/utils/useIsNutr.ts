import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useMeQuery } from '../generated/graphql';

const useIsNutr = () => {
  const { data, loading } = useMeQuery({});
  const router = useRouter();
  useEffect(() => {
    if (!loading && data?.me?.role !== 'NUTRITIONIST') {
      router.replace('/');
    }
  }, [loading, data, router]);
};

export default useIsNutr;
