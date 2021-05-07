import { ChakraProvider } from "@chakra-ui/react";
import '../styles/globals.css';
import { NavBar } from "../components/NavBar";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";


function MyApp({Component, pageProps}: any) {
  return (
      <ChakraProvider>
        <NavBar>
          <Component {...pageProps} />
        </NavBar>
      </ChakraProvider>
  );

}

export default withUrqlClient(createUrqlClient)( MyApp);
