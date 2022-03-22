import type { CreateUserDTO } from '@dtos/createUser.dto'
import type { SignInUserDTO } from '@dtos/signInUser.dto';
import { PrismaClient, User } from '@prisma/client';
import { Service } from 'typedi'

import { compareHash, generateHash } from '@utils/hash.util'
import { createAccessToken } from '@utils/jwt.util'
import type { 
CreateUserResponse, 
SignInUserResponse, 
FollowUserResponse
} from '@_types/mod';

const prisma = new PrismaClient();

@Service()
export class UserRepo {

    // TODO: limit to how many i can get back
    async getUsers(): Promise<User[]> {
        return await prisma.user.findMany();
    }

    async createUser(user: CreateUserDTO ): Promise<CreateUserResponse> {

        const findByEmail = await prisma.user.findUnique({
            where: {
                email: user.email
            }
        });
    
        if (findByEmail) {
            return {
                success: false,
                message: "Account already exists."
            }
        }
    
        const findByUsername = await prisma.user.findFirst({
            where: {
                username: user.username
            }
        });
    
        if (findByUsername) {
            return {
                success: false,
                message: "This username is already taken."
            }
        }
    
        // hash user password
        const hashPassword = generateHash(user.password);
    
        return {
            success: true,
            user: await prisma.user.create({
                data: {
                    username: user.username,
                    email: user.email,
                    password: hashPassword
                }
            })
        }
    }

    async getUserById(id: string): Promise<User | null> {
        const user = await prisma.user.findUnique({
            where: {
                id
            }
        });
    
        return user;
    }

    async signInUser(data: SignInUserDTO): Promise<SignInUserResponse> {

        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    {
                        username: {
                            equals: data.usernameOrEmail
                        }
                    },
                    {
                        email: {
                            equals: data.usernameOrEmail
                        }
                    }
                ]            
            }
        });
    
        
        if (user === null) {
            return {
                success: false,
                message: "Invalid username/email or password."
            }
        }
        
        const isValidPassword = compareHash(user.password, data.password);
    
        if (!isValidPassword) {
            return {
                success: false,
                message: "Invalid username/email or password."
            }
        }
    
        // create jwt
        const token = createAccessToken(user);
    
        return {
            success: true,
            token
        }
    }
    
    async deleteUser(id: string): Promise<boolean> {
        const user = await prisma.user.findUnique({
            where: {
                id
            }
        });
        
        if(user) {
            await prisma.user.delete({
                where: {
                    id: user.id
                }
            });

            return true;
        }

        return false
    }

    // async #getMultipleUsersById(userIds: Array<string>) { 

    //     const users: User[] = []

    //     for (const id in userIds) {
    //         const user = await prisma.user.findUnique({
    //             where: {
    //                 id
    //             }
    //         });

    //         if (user) {
    //             users.push(user)
    //         }
    //     }

    //     return users
    // }

    // maybe seperate them into different functions?
    async followUser(follwerId: string, followingId: string): Promise<FollowUserResponse> { 
        // add me to the user im following under followers and add them under who im following
        try {
            const following = await this.getUserById(followingId);

            if (!following) {
                return {
                    success: false,
                    message: "There's no user with that id."
                }
            }

            // if there is a user then lets find out if we follow them
            const isFollowing = following.followers.find(id => id === follwerId);
            
            if(isFollowing) {
                return {
                    success: false,
                    message: "You're already following this user."
                }
            }

            // if undefined then add to their followers and your following
            const follower = await this.getUserById(follwerId)
            
            if (!follower) {
                return {
                    success: false,
                    message: "Could not find user with that id."
                }
            }

            // following.followers.push(follower.id);
            await prisma.user.update({
                where: {
                    id: following.id
                },
                data: {
                    followers: {
                        push: follower.id
                    }
                }
            })

            // follower.following.push(following.id)
            await prisma.user.update({
                where: {
                    id: follower.id
                },
                data: {
                    following: {
                        push: following.id
                    }
                }
            })

            return {
                success: true,
                user: following,
            }

        } catch (error) {
            return {
                success: false,
                error: error.message
            }
        }
    }
}






