import {Post} from "./entities/Post";
import {__prod__} from "./constants";
import {MikroORM} from "@mikro-orm/core";
import path from "node:path";
import {dbPass} from "./secrets";

export default {
    migrations:{
        path: path.join(__dirname, './migrations'),
        pattern: /^[\w-]+\d+\.[tj]s$/,
    },
    entities:[Post],
    dbName: 'lireddit',
    user: 'postgres',
    password: dbPass,
    type: 'postgresql',
    debug: !__prod__,
} as Parameters<typeof MikroORM.init>[0];

/*
Separating this config file enables our configuration to be available through the MikroORM CLI
We set this up in package.json

Entities: objects which correspond to db entities such as tables
Migrations:
 */