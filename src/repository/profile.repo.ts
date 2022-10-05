import type { CreateProfile as CreateProfileDTO } from "@dtos/createProfile.dto";
import { UpdateProfileDTO } from "@dtos/updateProfile.dto";
import prisma from "@lib/prisma.lib";
import { Profile } from "@prisma/client";
import { Service } from "typedi";

type CreateProfileResponse = {
  message?: string;
  profile?: Profile;
};

@Service()
export class ProfileRepo {
  async create_profile(
    profile_dto: CreateProfileDTO
  ): Promise<CreateProfileResponse> {
    const is_profile = await prisma.profile.findUnique({
      where: {
        userId: profile_dto.userId,
      },
    });

    if (is_profile) {
      console.log(`profile exists for: ${profile_dto.userId}`);
      return {
        message: "There's already a profile linked with this user",
      };
    }

    const profile = await prisma.profile.create({
      data: {
        userId: profile_dto.userId,
        bio: profile_dto.bio,
      },
    });

    console.log(`created new profile for: ${profile_dto.userId}`);

    return {
      profile,
    };
  }

  async update_profile(update_profile: UpdateProfileDTO) {
    
    // provide valid checks
    const profile = await prisma.profile.update({
        where: {
            userId: update_profile.userId
        },
        data: {
            bio: update_profile.bio
        }
    })

    return profile
  }
}
