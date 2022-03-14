import { Field, ObjectType } from "type-graphql";
import { Profile } from './profile.entity'

@ObjectType()
export class User {

    @Field()
    id: string;

    @Field()
    username: string;

    @Field()
    email: string;

    password: string;

    @Field(() => [String])
    followers: string[];

    @Field(() => [String])
    following: string[];

    @Field(() => Profile, { nullable: true })
    profile?: Profile;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;

}