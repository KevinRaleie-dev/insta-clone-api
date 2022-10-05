import { Context } from "@context/mod";
import { MeResponse } from "@graphql/me.response";
import { isAuth } from "@middlewares/isAuth.middleware";
import { RelationsRepo } from "@repository/relations.repo";
import { UserRepo } from "@repository/user.repo";
import { Ctx, Query, Resolver, UseMiddleware } from "type-graphql";
import { Service } from "typedi";

@Service()
@Resolver()
export class MeResolver {

    constructor(private readonly userRepo: UserRepo, private readonly relationsRepo: RelationsRepo) { }

    @Query(() => MeResponse, { nullable: true })
    @UseMiddleware(isAuth)
    async me(
        @Ctx() { payload }: Context
    ) {
        const user = await this.userRepo.getUserById(payload?.id!)

        if (!user) {
            return {
                errorMessage: "Could not find the currently logged in user."
            };
        }

        const [followers, following, followers_count, following_count ] = await Promise.all([
            this.relationsRepo.getFollowers(payload?.id!),
            this.relationsRepo.getFollowing(payload?.id!),
            this.relationsRepo.getFollowersCount(payload?.id!),
            this.relationsRepo.getFollowingCount(payload?.id!),
        ]);

        if (followers && following) {
            return {
                user,
                followers_count,
                following_count,
                followers,
                following
            }
        }
        
        return {
            errorMessage: "Something unexpectedly went wrong."
        };

    }
}
