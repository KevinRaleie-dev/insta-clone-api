import { Profile } from "@prisma/client";

export type CreateProfile = Pick<Profile, "bio" | "userId">