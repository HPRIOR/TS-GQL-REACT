import {ChakraProvider} from "@chakra-ui/react";
import '../styles/globals.css'
import {Provider, createClient, dedupExchange, fetchExchange} from "urql";
import {NavBar} from "../components/NavBar";
import {cacheExchange} from "@urql/exchange-graphcache";

const client = createClient(
    {
        url: 'http://localhost:4000/graphql',
        fetchOptions: {
            credentials: "include"
        },
        exchanges: [dedupExchange, cacheExchange({}), fetchExchange]
    },
)

function MyApp({Component, pageProps}: any) {
    return (
        <Provider value={client}>
            <ChakraProvider>
                <NavBar>
                    <Component {...pageProps} />
                </NavBar>
            </ChakraProvider>
        </Provider>
    )


}


export default MyApp
