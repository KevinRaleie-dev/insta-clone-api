import { Arg, Mutation, Resolver } from "type-graphql"
import { AuthInput } from '@args/auth.input'
import { AuthResponse } from '@graphql/auth.response'
import { signUpSchema } from '@schema/mod'
import { createUser } from '@repository/user.repo'
import { ZodError } from "zod"

// TODO: 
// auth will consist of these methods:
// [] sign-in
// [x] sign-up
// [] forgot password
// [] reset password
// [] delete account

@Resolver()
export class AuthResolver {

    @Mutation(() => AuthResponse)
    async signUp(
        @Arg('input') input: AuthInput
    ): Promise<AuthResponse> {

        // validate the schema
        try {
            await signUpSchema.parseAsync(input)
        } catch (error) {
            if(error instanceof ZodError) {                                
                return {
                    success: false,
                    error: [
                        { message: error.issues[0].message }
                    ]
                }                
            }
        }

        // create a user
        const { success, message, user } = await createUser(input);

        if (!success) {
            return {
                success,
                error: [
                    {
                        message: String(message)
                    }
                ]
            }
        }
        else {
            return {
                success: true,
                node: user
            }
        }
    }

}