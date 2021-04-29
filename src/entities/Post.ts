import {Entity, PrimaryKey, Property} from "@mikro-orm/core";
import {Field, Int, ObjectType} from "type-graphql";

/*
These are the programmatic entities which correspond to database tables in postgres
    @Entity, @PrimaryKey. @Property
Also ObjectTypes for gql
    @ObjectType, @Field (exposes to gql schema)

 */
@ObjectType()
@Entity()
export class Post {
    @Field(() => Int)
    @PrimaryKey()
    id!: number;

    @Field(() => String)
    @Property({type: "date"})
    createAt = new Date();

    @Field(() => String)
    @Property({type: "date", onUpdate: () => new Date()})
    updatedAt = new Date();

    @Field(() => String)
    @Property({type: "text"})
    title!: string;
}