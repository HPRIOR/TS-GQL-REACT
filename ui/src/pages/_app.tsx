import {ChakraProvider} from "@chakra-ui/react";
import '../styles/globals.css';
import {createClient, dedupExchange, fetchExchange, Provider} from "urql";
import {NavBar} from "../components/NavBar";
import {cacheExchange} from "@urql/exchange-graphcache";
import {LogoutDocument, TestLoginDocument} from "../generatedTypes/graphql";

const client = createClient(
  {
    url: 'http://localhost:4000/graphql',
    fetchOptions: {
      credentials: "include"
    },
    exchanges: [
      dedupExchange,
      cacheExchange({
        updates: {
          Mutation: {
            logout: (result: any, args, cache, info) => {
              cache.updateQuery({query: TestLoginDocument }, () => {
                return {testLogin: null};
              })
            },
            login: (result: any, args, cache, info) => {
              cache.updateQuery({query: TestLoginDocument}, () => {
                if (result.login.errors) {
                  return result;
                } else {
                  return {testLogin: result.login.user};
                }
              });
            },
            register: (result: any, args, cache, info) => {
              cache.updateQuery({query: TestLoginDocument}, () => {
                if (result.register.errors) {
                  return result;
                } else {
                  return {testLogin: result.register.user};
                }
              });
            }
            //
          }
        }
      }),
      fetchExchange
    ]
  }
);

function MyApp({Component, pageProps}: any) {
  return (
    <Provider value={client}>
      <ChakraProvider>
        <NavBar>
          <Component {...pageProps} />
        </NavBar>
      </ChakraProvider>
    </Provider>
  );

}

export default MyApp;
