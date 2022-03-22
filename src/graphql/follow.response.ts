import { User } from "@entities/user.entity";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class FollowUserResponse { 

    @Field({ nullable: true })
    message?: string;

    @Field(() => User, { nullable: true })
    user?: User

}