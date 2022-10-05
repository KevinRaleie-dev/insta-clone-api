import { ObjectType, Field } from "type-graphql";
import { User } from "./user.entity";

@ObjectType()
export class Post {

    @Field()
    id: string;

    @Field()
    image_url: string;

    @Field()
    caption: string;

    @Field(() => User)
    userId: string;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}