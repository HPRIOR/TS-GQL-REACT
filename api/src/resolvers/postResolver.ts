import { ContextType } from 'src/types';
import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  InputType,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from 'type-graphql';
import { Post } from '../entities/Post';
import { isAuth } from '../middleware/isAuth';
import { getConnection } from 'typeorm';

@InputType()
export class PostInput {
  @Field()
  title!: string;

  @Field()
  text!: string;
}

@Resolver(Post)
export class PostResolver {
  @FieldResolver(() => String)
  textSnippet(@Root() root: Post) {
    return root.text.slice(0, 50);
  }

  @Query(() => [Post])
  async posts(
    @Arg('limit', () => Int) limit: number,
    @Arg('cursor', () => String, { nullable: true }) cursor: string | null
  ): Promise<Post[]> {
    const realLimit = Math.min(50, limit);
    const qb = getConnection()
      .getRepository(Post)
      .createQueryBuilder('p')
      .orderBy('"createdAt"', 'ASC')
      .take(realLimit);
    if (cursor) {
      qb.where('"createdAt" < :cursor', { cursor: new Date(parseInt(<string>cursor)) });
    }
    return qb.getMany();
  }

  @Query(() => Post, { nullable: true })
  async post(@Arg('id', () => Int) id: number): Promise<Post | undefined> {
    return Post.findOne(id);
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async createPost(@Arg('input') input: PostInput, @Ctx() { req }: ContextType): Promise<Post> {
    return Post.create({
      ...input,
      creatorId: req.session.userId,
    }).save();
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg('id', () => Int) id: number,
    @Arg('title', () => String, { nullable: true }) title: string
  ): Promise<Post | undefined> {
    const post = await Post.findOne(id);
    if (!post) return undefined;
    if (typeof title !== 'undefined') {
      await Post.update({ id }, { title });
    }
    return post;
  }

  @Mutation(() => Boolean, { nullable: true })
  async deletePost(@Arg('id', () => Int) id: number): Promise<boolean> {
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
