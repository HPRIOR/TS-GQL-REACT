import {Field, Int, ObjectType} from "type-graphql";
import {BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

/*
These are the programmatic entities which correspond to database tables in postgres
    @Entity, @PrimaryKey. @Property
Also ObjectTypes for gql
    @ObjectType, @Field (exposes to gql schema)

 */
@ObjectType()
@Entity()
export class Post extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @CreateDateColumn({type: "date"})
  createAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => String)
  @Column({type: "text"})
  title!: string;
}