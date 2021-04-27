import {MikroORM} from "@mikro-orm/core";
import {__prod__} from "./constants";
import {Post} from "./entities/Post";
import mikroConfig from './mikro-orm.config';
const main = async () => {
    /*
    Sets up the object relational mapper to the postgres db. Needed to
     */
    const orm = await MikroORM.init(mikroConfig);

    /*
    creates a post, and then pushes it to db
     */
    const post = orm.em.create(Post, {title: 'my first post'});
    await orm.em.persistAndFlush(post)

}

main().catch(err =>
    console.error(err)
);