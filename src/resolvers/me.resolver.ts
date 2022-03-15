import { User } from "@entities/user.entity";
import { UserRepo } from "@repository/user.repo";
import { isAuth } from "@middlewares/isAuth.middleware"
import { Ctx, Query, Resolver, UseMiddleware } from "type-graphql";
import { Service } from "typedi";
import { Context } from "@context/mod";

@Service()
@Resolver()
export class MeResolver {

    constructor(private readonly userRepo: UserRepo) { }

    @Query(() => User, { nullable: true })
    @UseMiddleware(isAuth)
    async me(
        @Ctx() { payload }: Context
    ): Promise<User | null> {
        const user = await this.userRepo.getUserById(String(payload?.id))

        if (user) {
            return user;
        }

        return null;
    }
}