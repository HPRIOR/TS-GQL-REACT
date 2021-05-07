import React, { useEffect } from 'react';
import { Wrapper } from '../components/Wrapper';
import { Form, Formik } from 'formik';
import { Box, Button } from '@chakra-ui/react';
import { InputField } from '../components/InputField';
import { useCreatePostMutation, useTestLoginQuery } from '../generatedTypes/graphql';
import { useRouter } from 'next/router';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { useIsAuth } from '../utils/useIsAuth';

interface CreatePostProps {}

const CreatePost: React.FC<CreatePostProps> = ({}) => {
  const router = useRouter();
  useIsAuth();
  const [, createPost] = useCreatePostMutation();

  return (
    <Wrapper variant={'small'}>
      <Formik
        initialValues={{ title: '', text: '' }}
        onSubmit={async values => {
          const { error } = await createPost({ input: values });
          if (!error) {
            await router.push('/');
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Box mt={4}>
              <InputField name="title" placeholder="title" label="Title" />
            </Box>
            <Box mt={4}>
              <InputField name="text" placeholder="post some content here..." label="Body" textArea={true} />
            </Box>
            <Box mt={4}>
              <Button colorScheme="teal" isLoading={isSubmitting} type="submit">
                Create Post
              </Button>
            </Box>
            <Box mt={4}>
              {/*{errors ? errors.map(error =>*/}
              {/*  <Box key={uuid()} mt={4}> <Alert status="error">{error.message}</Alert></Box>) : null}*/}
            </Box>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(CreatePost);
