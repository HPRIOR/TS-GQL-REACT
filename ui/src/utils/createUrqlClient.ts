import { getClientOptions } from "./getClientOptions";

export const createUrqlClient = (ssrExchange: any) => getClientOptions(ssrExchange);