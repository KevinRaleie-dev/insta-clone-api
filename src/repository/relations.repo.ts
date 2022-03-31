import { Service } from "typedi";
import { UserRepo } from "./user.repo";
import { RelationsDTO } from "@dtos/relations.dto";
import { FollowUserResponse } from "@_types/mod"
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

@Service()
export class RelationsRepo {

    constructor(private readonly userRepo: UserRepo) {}

    async #checkIsFollowing(relations: RelationsDTO): Promise<boolean> {
        const isFollowing = await prisma.relations.findFirst({
            where: {
                AND: [
                    {
                        followed_id: {
                            equals: relations.personImFollowingId
                        }
                    },
                    {
                        follower_id: {
                            equals: relations.meId
                        }
                    }
                ]
            }
        });

        return isFollowing ? true : false;
    }

    // TODO: Make user users do not follow themselves
    async followUser(relations: RelationsDTO): Promise<FollowUserResponse> {
        const user = await this.userRepo.getUserById(relations.personImFollowingId);

        if (!user) {
            return {
                success: false,
                message: "Could not find the requested user."
            }
        }

        if (user.id === relations.meId) {
            return {
                success: false,
                message: "You're not allowed to follow yourself."
            }
        }

        // check if already following
        const isFollowing = await this.#checkIsFollowing(relations);

        if (isFollowing) {
            return {
                success: false,
                message: "You're already following this user."
            }
        }
        else {
            try {
                await prisma.relations.create({
                    data: {
                        followed_id: relations.personImFollowingId,
                        follower_id: relations.meId
                    }
                });
    
                return {
                    success: true,
                    user
                }
            } catch (error) {
                return {
                    success: false,
                    message: error.message
                }
            }
        }
    }

    async unfollowUser(relations: RelationsDTO): Promise<FollowUserResponse> {
        try {
            const relation = await prisma.relations.findFirst({
                where: {
                    AND: [
                        {
                            followed_id: {
                                equals: relations.personImFollowingId
                            }
                        },
                        {
                            follower_id: {
                                equals: relations.meId
                            }
                        }
                    ]
                }
            });

            if(!relation) {
                return {
                    success: false,
                    message: "You're not following this user."
                }
            }
        
            await prisma.relations.delete({
                where: {
                    id: relation.id
                }
            });
            
            return {
                success: true,
            };
            
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    async getFollowers(meId: string) {
        const relations = await prisma.relations.findMany({
            where: {
                followed_id: meId
            }
        })

        const users = await this.userRepo.getMultipleUsersById(relations, "followers");

        return users;
    }

    async getFollowing(meId: string) {
        const relations = await prisma.relations.findMany({
            where: {
                follower_id: meId
            }
        });

        const users = await this.userRepo.getMultipleUsersById(relations, "following");

        return users;
    }

    async getFollowersCount(meId: string) {
        const relations = await prisma.relations.findMany({
            where: {
                followed_id: meId
            }
        });

        return relations.length;
    }

    async getFollowingCount(meId: string) {
        const relations = await prisma.relations.findMany({
            where: {
                follower_id: meId
            }
        });

        return relations.length;
    }

}