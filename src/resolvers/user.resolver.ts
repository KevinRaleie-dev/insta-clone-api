import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { Service } from "typedi"
import { UserRepo } from "@repository/user.repo";
import { User } from "@entities/user.entity";
import { isAuth } from "@middlewares/isAuth.middleware";
import { Context } from "@context/mod";
import { FollowUserResponse } from "@graphql/follow.response"

@Service()
@Resolver()
export class UserResolver {

    constructor(private readonly userRepo: UserRepo) {}

    @Query(() => [User])
    async getAllUsers(): Promise<User[]> {
        const users = await this.userRepo.getUsers()

        return users;
    }

    @Query(() => User, { nullable: true })
    async getUser(
        @Arg('id') id: string
    ): Promise<User | null> {
        const user = await this.userRepo.getUserById(id);

        return user;
    }

    @Mutation(() => FollowUserResponse)
    @UseMiddleware(isAuth)
    async followUser(
        @Arg('followingId', { description: "The user id of the person we're following"}) followingId: string,
        @Ctx() { payload }: Context
    ): Promise<FollowUserResponse> {

        const { user, success, message } = await this.userRepo.followUser(payload?.id!, followingId)

        if(!success) {
            return {
                message
            }
        }

        return {
            user
        }
    }
}