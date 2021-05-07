import { MiddlewareFn } from "type-graphql";
import { ContextType } from "../types";


// this allows us to wrap add middlewhere which checks whether or not a call has been authenticated
export const isAuth: MiddlewareFn<ContextType> =  ({context}, next) => {
  if (!context.req.session.userId){
    throw new Error("not authenticated")
  }
  return next();
}