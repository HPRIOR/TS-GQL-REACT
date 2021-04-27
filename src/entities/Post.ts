import {Entity, PrimaryKey, Property} from "@mikro-orm/core";
/*
These are the programmatic entities which correspond to database tables in postgres
 */
@Entity()
export class Post{
    @PrimaryKey()
    id!: number;

    @Property()
    createAt = new Date();

    @Property( {onUpdate:() => new Date()})
    updatedAt = new Date();

    @Property()
    title!: string;
}