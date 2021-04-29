import 'reflect-metadata';
import {MikroORM} from "@mikro-orm/core";
import express from 'express';
import {ApolloServer} from "apollo-server-express";
import {buildSchema} from "type-graphql";
import mikroConfig from './mikro-orm.config';
import {PostResolver} from "./resolvers/postResolver";
import {UserResolver} from "./resolvers/userResolver";
import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import {sessionSecret} from "./secrets";
import {__prod__} from './constants';
import {ContextType} from "./types";


const main = async () => {
    // orm for programmatic interface with db
    const orm = await MikroORM.init(mikroConfig);
    // for any new or changed entities, create sql for creating or updating databases
    await orm.getMigrator().up();

    // setup server
    const app = express();

    const RedisStore = connectRedis(session);
    const redisClient = redis.createClient();

    // order is important for middleware - session needs be to be used within apollo server so it needs to come first
    // this middleware stores session cookies in a redis store
    app.use(session({
        name: 'qid',
        store: new RedisStore({
            disableTouch: true,
            client: redisClient
        }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 364 * 10, // cookie will last for 10 years
            httpOnly: true,
            sameSite: 'lax', // csrf
            secure: __prod__ // cookie only works with https in production
        },
        secret: sessionSecret,
        resave: false
    }))

    /*
    Setup gql server:
        builds scheme from resolvers
        context provides access to the ORM to all resolvers
     */
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [PostResolver, UserResolver],
            validate: false
        }),
        /*
         Apollo allows us to share context throughout the resolvers. orm.em allows resolvers to interact with
         the db orm. we can also pass through request and response objects. This allows us to determine session cookies
         which are resolved previous middleware above (app.use(session...
        */
        context: ({req, res}): ContextType => ({
            em: orm.em,
            req,
            res

        })
    });

    // add gql as middleware
    apolloServer.applyMiddleware({app});

    app.listen(4000, () => {
        console.log('server started on http://localhost:4000/ \n' +
            'gql server started on http://localhost:4000/graphql');
    })

}

main().catch(err =>
    console.error(err)
);
