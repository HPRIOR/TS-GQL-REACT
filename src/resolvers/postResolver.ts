import {Arg, Ctx, Int, Mutation, Query, Resolver} from "type-graphql";
import {Post} from "../entities/Post";
import {ContextType} from "../types";

@Resolver()
export class PostResolver {
    @Query(() => [Post])
    posts(@Ctx() {em}: ContextType): Promise<Post[]> {
        return em.find(Post, {});
    }

    @Query(() => Post, {nullable: true})
    post(
        @Arg('id', () => Int) id: number,
        @Ctx() {em}: ContextType
    ): Promise<Post | null> {
        return em.findOne(Post, {id});
    }

    @Mutation(() => Post)
    async createPost(
        @Arg('title', () => String) title: string,
        @Ctx() {em}: ContextType
    ): Promise<Post> {
        let post = em.create(Post, {title})
        await em.persistAndFlush(post)
        return post;
    }

    @Mutation(() => Post, {nullable: true})
    async updatePost(
        @Arg('id', () => Int) id: number,
        @Arg('title', () => String, {nullable: true}) title: string,
        @Ctx() {em}: ContextType
    ): Promise<Post | null> {
        const post = await em.findOne(Post, {id});
        if (!post) return null;
        if(typeof title !== 'undefined'){
            post.title = title;
            await em.persistAndFlush(post)
        }
        return post;
    }

    @Mutation(() => Post, {nullable: true})
    async deletePost(
        @Arg('id', () => Int) id: number,
        @Ctx() {em}: ContextType
    ): Promise<Post | null> {
        const post = await em.findOne(Post, {id});
        if (!post) return null;
        await em.nativeDelete(Post, {id})
        return post;
    }

}

/*
Resolves how posts are gotten from the database
Post was originally not a graphql type, but was modified by adding the @ObjectType decorator to the entity

The posts query needs to be passed the ORM contexts (the type of which is defined in types.ts). This is used to find
the posts

Two types are defined for the query, The query attributes return type, and the actual functions return type

@Arg <- argument passed to GraphQl, needs to be passed it's type, both gql and ts

em.find(Entity/GQLType, {filter})




 */