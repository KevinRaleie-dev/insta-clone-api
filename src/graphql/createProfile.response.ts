import { Profile } from "@entities/profile.entity"
import { Field, ObjectType } from "type-graphql"

@ObjectType()
export class CreateProfileResponse {
    @Field({ nullable: true })
    message?: string

    @Field(() => Profile, { nullable: true })
    profile?: Profile
}