import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { Service } from "typedi"
import { UserRepo } from "@repository/user.repo";
import { User } from "@entities/user.entity";
import { isAuth } from "@middlewares/isAuth.middleware";
import { Context } from "@context/mod";
import { FollowUserResponse } from "@graphql/follow.response";
import { UserResponse } from "@graphql/user.response";
import { RelationsRepo } from "@repository/relations.repo";

@Service()
@Resolver()
export class UserResolver {

    constructor(private readonly userRepo: UserRepo, private readonly relationsRepo: RelationsRepo) {}

    @Query(() => [User])
    async getAllUsers(): Promise<User[]> {
        const users = await this.userRepo.getUsers()

        return users;
    }

    @Query(() => UserResponse, { nullable: true })
    async getUser(
        @Arg('id') id: string
    ): Promise<UserResponse | null> {
        const user = await this.userRepo.getUserById(id);

        if(!user) {
            return null;
        }

        const [followers, following] = await Promise.all([
            this.relationsRepo.getFollowers(id),
            this.relationsRepo.getFollowing(id)
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

    @Mutation(() => FollowUserResponse)
    @UseMiddleware(isAuth)
    async followUser(
        @Arg('followingId', { description: "The user id of the person we're following" }) followingId: string,
        @Ctx() { payload }: Context
    ): Promise<FollowUserResponse> {

        const { success, message, user } = await this.relationsRepo.followUser({ meId: payload?.id!, personImFollowingId: followingId });

        if(!success) {
            return {
                message
            }
        }

        return {
            user
        }
    }

    @Mutation(() => FollowUserResponse)
    @UseMiddleware(isAuth)
    async unfollowUser(
        @Arg('followingId') followingId: string,
        @Ctx() { payload }: Context
    ): Promise<FollowUserResponse> {

        const { success, message } = await this.relationsRepo.unfollowUser({ meId: payload?.id!, personImFollowingId: followingId });

        return {
            success,
            message
        }
    }
}