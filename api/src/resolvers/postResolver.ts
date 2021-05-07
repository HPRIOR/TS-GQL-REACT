import { ContextType } from "src/types";
import { Arg, Ctx, Field, InputType, Int, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { Post } from "../entities/Post";
import { isAuth } from "../middleware/isAuth";

@InputType()
export class PostInput{
  @Field()
  title!: string

  @Field()
  text!: string

}

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  async posts(): Promise<Post[]> {
    return Post.find();
  }

  @Query(() => Post, {nullable: true})
  async post(
    @Arg('id', () => Int) id: number
  ): Promise<Post | undefined> {
    return Post.findOne(id);
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg("input") input: PostInput,
    @Ctx() {req}: ContextType
  ): Promise<Post> {
    return Post.create({
      ...input,
      creatorId: req.session.userId
    }).save();
  }

  @Mutation(() => Post, {nullable: true})
  async updatePost(
    @Arg('id', () => Int) id: number,
    @Arg('title', () => String, {nullable: true}) title: string
  ): Promise<Post | undefined> {
    const post = await Post.findOne(id);
    if (!post) return undefined;
    if (typeof title !== 'undefined') {
      await Post.update({id}, {title});
    }
    return post;
  }

  @Mutation(() => Boolean, {nullable: true})
  async deletePost(
    @Arg('id', () => Int) id: number
  ): Promise<boolean> {
    const post = await Post.findOne(id);
    if (post) {
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