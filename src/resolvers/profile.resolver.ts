import { Context } from "@context/mod";
import { Profile } from "@entities/profile.entity";
import { CreateProfileResponse } from "@graphql/createProfile.response";
import { isAuth } from "@middlewares/isAuth.middleware";
import { ProfileRepo } from "@repository/profile.repo";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { Service } from "typedi";

@InputType()
class CreateProfileInput {
  @Field()
  bio: string;
}

@Service()
@Resolver()
export class ProfileResolver {
  constructor(private readonly profileRepo: ProfileRepo) {}

  @Mutation(() => CreateProfileResponse)
  @UseMiddleware(isAuth)
  async createProfile(
    @Ctx() { payload }: Context,
    @Arg("input") input: CreateProfileInput
  ): Promise<CreateProfileResponse> {
    const { message, profile } = await this.profileRepo.create_profile({
      bio: input.bio,
      userId: payload?.id!,
    });

    if (message) {
      return {
        message,
      };
    }

    return {
      profile,
    };
  }

  @Mutation(() => Profile)
  @UseMiddleware(isAuth)
  async updateProfile(
    @Ctx() { payload }: Context,
    @Arg("input") input: CreateProfileInput
  ) {
    const profile = await this.profileRepo.update_profile({
      bio: input.bio,
      userId: payload?.id!,
    });

    return profile
  }
}
