import { User } from '@entities/user.entity'
import { InputType, Field } from 'type-graphql';

@InputType()
export class SignUpAuthInput implements Partial<User> {

    @Field()
    username: string;

    @Field()
    email: string;

    @Field()
    password: string;

}

@InputType()
export class SignInAuthInput implements Partial<User> {

    @Field()
    usernameOrEmail: string;

    @Field()
    password: string;
}