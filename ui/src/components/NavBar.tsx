import React from 'react';
import { Box, Button, Flex, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useLogoutMutation, useTestLoginQuery } from '../generatedTypes/graphql';
import { onServer } from '../utils/onServer';

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = props => {
  const [{ data, fetching }] = useTestLoginQuery({
    pause: onServer(),
  });
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  let body = null;
  if (fetching) {
  } else if (!data?.testLogin) {
    body = (
      <>
        <NextLink href={'/login'}>
          <Link color={'white'} mr={2}>
            Login
          </Link>
        </NextLink>
        <NextLink href={'/register'}>
          <Link color={'white'}>Register</Link>
        </NextLink>
      </>
    );
  } else {
    body = (
      <Flex>
        <Box mr={4}>{data.testLogin.username}</Box>
        <Button isLoading={logoutFetching} onClick={() => logout()} variant={'link'}>
          Logout
        </Button>
      </Flex>
    );
  }
  return (
    <>
      <Flex bg={'teal'} p={4}>
        <Box bg="teal" ml={'auto'}>
          {body}
        </Box>
      </Flex>
      {props.children}
    </>
  );
};
