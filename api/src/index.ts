import 'reflect-metadata';
import express from 'express';
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { PostResolver } from "./resolvers/postResolver";
import { UserResolver } from "./resolvers/userResolver";
import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { dbPass, sessionSecret } from "./secrets";
import { __prod__, COOKIE_NAME } from './constants';
import cors from 'cors';
import { createConnection } from "typeorm";
import { User } from "./entities/User";
import { Post } from "./entities/Post";
import { sendEmail } from "./utils/sendEmail";
import { isAuth } from "./middleware/isAuth";

const main = async () => {
  const conn = await createConnection({
    type: 'postgres',
    database: 'lireddit2',
    username: 'postgres',
    password: dbPass,
    logging: true,
    synchronize: true, // syncs orm with db
    entities: [Post, User]
  });

  // setup server
  const app = express();

  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient();

  // apply cors middleware to all routes
  app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  }));

  // order is important for middleware - session needs be to be used within apollo server so it needs to come first
  // this middleware stores session cookies in a redis store
  // this handles excrypt+decrypting of session cookies, +sending and receiving in req + res pipeline
  app.use(session({
    name: COOKIE_NAME,
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
    saveUninitialized: false, // won't create a session by default - store data when needed
    secret: sessionSecret,
    resave: false
  }));

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
     which are resolved previous middleware above (app.use(session...) see sessions-explained.txt
     Passing orm.em is not necessary when using type orm, types have methods for interacting with db
    */
    context: ({req, res}) => ({
      req,
      res
    })
  });

  // add gql as middleware
  apolloServer.applyMiddleware({app, cors: false});

  app.listen(4000, () => {
    console.log('server started on http://localhost:4000/ \n' +
      'gql server started on http://localhost:4000/graphql');
  });

};

main().catch(err =>
  console.error(err)
);
