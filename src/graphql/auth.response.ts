import { Field, ObjectType } from "type-graphql";
import { User } from '@entities/user.entity'

@ObjectType()
export class AuthResponse {

    @Field(() => [FieldError], { nullable: true })
    error?: FieldError[]

    @Field(() => User,{ nullable: true })
    node?: User;

    @Field(() => Boolean)
    success: boolean;
    
    @Field({ nullable: true })
    token?: string;
}

@ObjectType()
class FieldError {

    @Field(() => String,{ nullable: true })
    field?: string

    @Field()
    message: string
}