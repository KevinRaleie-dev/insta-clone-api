import { Arg, Query, Resolver } from "type-graphql";
import { getUsers, getUserById } from "@repository/user.repo";
import { User } from "@entities/user.entity";

@Resolver()
export class UserResolver {

    @Query(() => [User])
    async getAllUsers(): Promise<User[]> {
        const users = await getUsers()

        return users;
    }

    @Query(() => User, { nullable: true })
    async getUser(
        @Arg('id') id: string
    ): Promise<User | null> {
        const user = await getUserById(id);

        return user;
    }
}