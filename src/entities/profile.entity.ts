import { ObjectType, Field } from "type-graphql";
import { User } from "./user.entity";

@ObjectType()
export class Profile {

    @Field()
    id: string;

    @Field()
    bio?: string;

    @Field(() => User)
    user: User;
}