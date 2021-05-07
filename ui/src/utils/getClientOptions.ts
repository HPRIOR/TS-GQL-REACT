import { dedupExchange, Exchange, fetchExchange } from "urql";
import { cacheExchange } from "@urql/exchange-graphcache";
import { TestLoginDocument } from "../generatedTypes/graphql";
import { pipe, tap } from "wonka";
import Router from "next/router";

const errorExchange: Exchange = ({forward}) => {
  return (ops$) => {
    return pipe(
      forward(ops$),
      tap(async ({error}) => {
        if (error) {
          if (error?.message.includes('not authenticated')) {
            await Router.replace("/login");
          }
        }
      })
    );
  };
};

export const getClientOptions = (ssrExchange: any) => ({
  url: 'http://localhost:4000/graphql',
  fetchOptions: {
    credentials: "include" as const
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
      updates: {
        Mutation: {
          logout: (result: any, args, cache, _) => {
            cache.updateQuery({query: TestLoginDocument}, () => {
              return {testLogin: null};
            });
          },
          login: (result: any, args, cache, _) => {
            cache.updateQuery({query: TestLoginDocument}, () => {
              if (result.login.errors) {
                return result;
              } else {
                return {testLogin: result.login.user};
              }
            });
          },
          register: (result: any, args, cache, _) => {
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
    errorExchange,
    ssrExchange,
    fetchExchange
  ]
});