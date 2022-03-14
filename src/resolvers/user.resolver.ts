import { Query, Resolver } from "type-graphql";
import { getUsers } from "@repository/user.repo";
import { User } from "@entities/user.entity";

@Resolver()
export class UserResolver {

    @Query(() => [User])
    async getAllUsers(): Promise<User[]> {
        const users = await getUsers()

        return users;
    }
}