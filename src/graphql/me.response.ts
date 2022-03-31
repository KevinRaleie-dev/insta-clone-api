import { User } from "@entities/user.entity";
import { ObjectType, Field, Int } from "type-graphql";

@ObjectType()
export class MeResponse {

    @Field(() => User, { nullable: true })
    user?: User;

    @Field(() => Int, { nullable: true })
    following_count?: number;

    @Field(() => Int, { nullable: true })
    followers_count?: number;

    @Field(() => [User], { nullable: true })
    followers?: User[];

    @Field(() => [User], { nullable: true })
    following?: User[];
}