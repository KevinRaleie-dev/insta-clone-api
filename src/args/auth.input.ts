import { User } from '@entities/user.entity'
import { InputType, Field } from 'type-graphql';

@InputType()
export class AuthInput implements Partial<User> {

    @Field()
    username: string;

    @Field()
    email: string;

    @Field()
    password: string;

}