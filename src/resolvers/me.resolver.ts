import { UserRepo } from "@repository/user.repo";
import { isAuth } from "@middlewares/isAuth.middleware"
import { Ctx, Query, Resolver, UseMiddleware } from "type-graphql";
import { Service } from "typedi";
import { Context } from "@context/mod";
import { MeResponse } from "@graphql/me.response"
import { RelationsRepo } from "@repository/relations.repo";

@Service()
@Resolver()
export class MeResolver {

    constructor(private readonly userRepo: UserRepo, private readonly relationsRepo: RelationsRepo) { }

    @Query(() => MeResponse, { nullable: true })
    @UseMiddleware(isAuth)
    async me(
        @Ctx() { payload }: Context
    ): Promise<MeResponse | null> {
        const user = await this.userRepo.getUserById(payload?.id!)

        if (!user) {
            return null;
        }

        const [followers, following] = await Promise.all([
            this.relationsRepo.getFollowers(payload?.id!),
            this.relationsRepo.getFollowing(payload?.id!)
        ]);

        if (followers && following) {
            return {
                user,
                follower_count: followers.length,
                following_count: following.length,
                followers,
                following
            }
        }
        
        return null;

    }
}
