import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { usePostsQuery } from '../generatedTypes/graphql';
import { Box, Button, Flex, Heading, Stack, Text } from '@chakra-ui/react';
import NextLink from 'next/link';
import { Wrapper } from '../components/Wrapper';

const Index = () => {
  const [{ data, fetching }] = usePostsQuery({
    variables: { limit: 20 },
  });
  if (!fetching && !data) {
    return <div>query failed</div>;
  }
  return (
    <>
      <Wrapper variant={'small'}>
        <Flex>
          <Heading mb={'100px'}>RedditClone</Heading>
          <NextLink href={'/create-post'}>
            <Button ml={'auto'}>CreatePost</Button>
          </NextLink>
        </Flex>
        <Stack spacing={8}>
          {fetching && !data ? (
            <div> loading...</div>
          ) : (
            data!.posts.map(p => (
              <Box padding={5} shadow={'md'} borderWidth={'px'} key={p.id}>
                <Heading fontSize={'xl'}>{p.title}</Heading>
                <Text mt={4}>{p.textSnippet + '...'}</Text>
              </Box>
            ))
          )}
        </Stack>
        {data ? (
          <Flex>
            <Button isLoading={fetching} m={'auto'} my={8}>
              Load More
            </Button>
          </Flex>
        ) : null}
      </Wrapper>
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
