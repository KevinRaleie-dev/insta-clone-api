import { InputType, Field } from 'type-graphql';

@InputType()
class PasswordArgs {

    @Field()
    password: string;
}

@InputType()
export class SignUpAuthInput extends PasswordArgs {

    @Field()
    username: string;

    @Field()
    email: string;
}

@InputType()
export class SignInAuthInput extends PasswordArgs {

    @Field()
    usernameOrEmail: string;
}