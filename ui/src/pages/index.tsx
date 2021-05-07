import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { usePostsQuery } from '../generatedTypes/graphql';
import { Link } from '@chakra-ui/react';
import NextLink from 'next/link';

const Index = () => {
  const [{ data }] = usePostsQuery();
  return (
    <>
      <NextLink href={'/create-post'}>
        <Link>CreatePost</Link>
      </NextLink>
      <div> ---</div>

      {!data ? null : data.posts.map(p => <div key={p.id}>{p.title}</div>)}
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
