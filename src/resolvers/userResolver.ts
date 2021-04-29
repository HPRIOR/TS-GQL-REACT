import {Arg, Ctx, Field, InputType, Mutation, ObjectType, Resolver} from "type-graphql";
import {ContextType} from "src/types";
import {User} from "../entities/User";
import argon2 from 'argon2';

// this can be used to pass more complex types to a resolver
@InputType()
class UsernamePasswordInput {
    @Field()
    username: string
    @Field()
    password: string
}

@ObjectType()
class FieldError {
    @Field()
    message: string;
}

@ObjectType()
class UserResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[]

    @Field(() => User, {nullable: true})
    user?: User
}

@Resolver()
export class UserResolver {
    @Mutation(() => UserResponse)
    async register(
        @Arg('options') options: UsernamePasswordInput, // the type-graphql type has been inferred
        @Ctx() {em}: ContextType
    ) {
        if (options.username.length <= 2) {
            return {
                errors: [{
                    message: "username length must be greater than 2"
                }]
            }
        }
        if (options.password.length <= 2) {
            return {
                errors: [{
                    message: "password length must be greater than 3"
                }]
            }
        }
        const hashedPassword = await argon2.hash(options.password);
        const user = em.create(User, {username: options.username, password: hashedPassword})
        try {
            await em.persistAndFlush(user)
        } catch(err) {
            if(err.code === '23505' || err.detail.includes("already exists")) {
                return {errors: [{message: "username already exits"}]}
            }
        }
        return {user};
    }

    // Type created for handling response and errors - UserResponse can return {[FieldError]?, user?}
    // These are gql types, and therefore define the shape of the json which will be returned for the query
    // in this case it will be {errors, user}, each could be null
    @Mutation(() => UserResponse)
    async login(
        @Arg('options') options: UsernamePasswordInput, // the type-graphql type has been inferred
        @Ctx() {em, req}: ContextType
    ): Promise<UserResponse> {
        const user = await em.findOne(User, {username: options.username})
        const genericError = {errors: [{message: "Incorrect username or password"}]}
        if (!user) {
            return genericError;
        }
        const valid = await argon2.verify(user.password, options.password);
        if (!valid) {
            return genericError;
        }
        req.session!.userId = user.id;
        return {user}
    }
}
