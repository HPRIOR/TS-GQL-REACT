import {ChakraProvider} from "@chakra-ui/react";
import '../styles/globals.css';
import {Provider, createClient, dedupExchange, fetchExchange} from "urql";
import {NavBar} from "../components/NavBar";
import {cacheExchange} from "@urql/exchange-graphcache";
import {TestLoginDocument} from "../generatedTypes/graphql";

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
