import type { CreateUserDTO } from '@dtos/createUser.dto'
import type { SignInUserDTO } from '@dtos/signInUser.dto';
import { PrismaClient, Relations, User } from '@prisma/client';
import { Service } from 'typedi'

import { compareHash, generateHash } from '@utils/hash.util'
import { createAccessToken } from '@utils/jwt.util'
import type { 
CreateUserResponse, 
SignInUserResponse, 
WhichType
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
                field: "email",
                message: "This account is already taken."
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
                field: "username",
                message: "This account is already taken."
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
                field: "usernameOrEmail",
                message: "Invalid username/email or password."
            }
        }
        
        const isValidPassword = compareHash(user.password, data.password);
    
        if (!isValidPassword) {
            return {
                success: false,
                field: "password",
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

    // accept an array of relations instead of an array of strings along with the type of users
    async getMultipleUsersById(userIds: Relations[], type: WhichType): Promise<User[]> { 

        const users: User[] = [];

        if(type === "followers") {
            for (let ids of userIds) {
                const user = await prisma.user.findUnique({
                    where: {
                        id: ids.follower_id!
                    }
                });

                if (user) {
                    users.push(user);
                }
            }
        }
        else {
            for (const ids of userIds) {
                const user = await prisma.user.findUnique({
                    where: {
                        id: ids.followed_id!
                    }
                });
                
                if(user) {
                    users.push(user);
                }
            }
        }

        return users
    }
}






