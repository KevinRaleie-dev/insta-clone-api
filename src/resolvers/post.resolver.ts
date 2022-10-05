import { Post } from "@entities/post.entity";
import { PostRepo } from "@repository/post.repo";
import { Query, Resolver } from "type-graphql";
import { Service } from "typedi";

@Service()
@Resolver()
export class PostResolver {

    constructor(private readonly postRepo: PostRepo) { }

    @Query(() => [Post])
    async posts(): Promise<Post[]> {
        const posts = await this.postRepo.posts();
		return posts;
    }
}
