import { useTestLoginQuery } from '../generatedTypes/graphql';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export const useIsAuth = () => {
  const [{ data, fetching }] = useTestLoginQuery();
  const router = useRouter();
  // if the user is not logged in the we append the intended route to url.
  // this can be retrieved in router.query.next to redirect to the intended page
  useEffect(() => {
    if (!fetching && !data?.testLogin) {
      router.replace('/login?next=' + router.pathname);
    }
  }, [fetching, data, router]);
};
