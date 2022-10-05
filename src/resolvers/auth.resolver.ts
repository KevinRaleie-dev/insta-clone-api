import { SignInAuthInput, SignUpAuthInput } from "@args/auth.input";
import { Context } from "@context/mod";
import { AuthResponse } from "@graphql/auth.response";
import { isAuth } from "@middlewares/isAuth.middleware";
import { UserRepo } from "@repository/user.repo";
import { signInSchema, signUpSchema } from "@schema/mod";
import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { Service } from "typedi";
import { ZodError } from "zod";

// TODO:
// auth will consist of these methods:
// [x] sign-in
// [x] sign-up
// [] forgot password
// [] reset password
// [x] delete account

@Service()
@Resolver()
export class AuthResolver {
  constructor(private readonly userRepo: UserRepo) {}

  @Mutation(() => AuthResponse)
  async signUp(@Arg("input") input: SignUpAuthInput): Promise<AuthResponse> {
    // validate the schema
    try {
      await signUpSchema.parseAsync(input);
    } catch (error) {
      if (error instanceof ZodError) {
        return {
          success: false,
          error: error.issues.map((issue) => ({
            message: issue.message,
            field: String(issue.path),
          })),
        };
      }
    }

    const { success, message, user, field } = await this.userRepo.createUser(
      input
    );

    if (success) {
      return {
        success: true,
        node: user,
      };
    }
    return {
      success,
      error: [
        {
          message: String(message),
          field,
        },
      ],
    };
  }

  @Mutation(() => AuthResponse)
  async signIn(@Arg("input") input: SignInAuthInput): Promise<AuthResponse> {
    try {
      await signInSchema.parseAsync(input);
    } catch (error) {
      if (error instanceof ZodError) {
        return {
          success: false,
          error: error.issues.map((issue) => ({
            message: issue.message,
            field: String(issue.path),
          })),
        };
      }
    }

    const { success, message, token, field } = await this.userRepo.signInUser(
      input
    );

    if (!success) {
      return {
        success,
        error: [
          {
            message: String(message),
            field,
          },
        ],
      };
    } else {
      return {
        success: true,
        token,
      };
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteAccount(@Ctx() { payload }: Context): Promise<boolean> {
    return await this.userRepo.deleteUser(payload?.id!);
  }
}
