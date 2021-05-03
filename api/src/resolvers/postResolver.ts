import {Arg, Int, Mutation, Query, Resolver} from "type-graphql";
import {Post} from "../entities/Post";
import {ContextType} from "../types";

@Resolver()
export class PostResolver {
    @Query(() => [Post])
    posts(): Promise<Post[]> {
        return Post.find();
    }

    @Query(() => Post, {nullable: true})
    post(
        @Arg('id', () => Int) id: number
    ): Promise<Post | undefined> {
        return Post.findOne(id);
    }

    @Mutation(() => Post)
    async createPost(
        @Arg('title', () => String) title: string,
    ): Promise<Post> {
        return Post.create({title}).save();
    }

    @Mutation(() => Post, {nullable: true})
    async updatePost(
        @Arg('id', () => Int) id: number,
        @Arg('title', () => String, {nullable: true}) title: string,
    ): Promise<Post | undefined> {
        const post = await Post.findOne(id);
        if (!post) return undefined;
        if(typeof title !== 'undefined'){
            await Post.update({id}, {title});
        }
        return post;
    }

    @Mutation(() => Boolean, {nullable: true})
    async deletePost(
        @Arg('id', () => Int) id: number,
    ): Promise<boolean> {
        const post = await Post.findOne(id);
        if (post){
            await Post.delete(id);
            return true;
        }
        return false;
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