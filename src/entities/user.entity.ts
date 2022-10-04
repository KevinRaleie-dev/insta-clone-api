import { Field, ObjectType } from "type-graphql";
import { Post } from "./post.entity";
import { Profile } from './profile.entity'

@ObjectType()
export class User {

    @Field()
    id: string;

    @Field()
    username: string;

    @Field()
    email: string;

    @Field(() => [Post])
    posts?: Post[];

    password: string;

    @Field(() => Profile, { nullable: true })
    profile?: Profile;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;

}