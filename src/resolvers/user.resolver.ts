import { Arg, Query, Resolver } from "type-graphql";
import { Service } from "typedi"
import { UserRepo } from "@repository/user.repo";
import { User } from "@entities/user.entity";

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
}