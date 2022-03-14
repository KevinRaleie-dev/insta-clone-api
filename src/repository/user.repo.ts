import type { CreateUserDTO } from '@dtos/createUser.dto'
import type { SignInUserDTO } from '@dtos/signInUser.dto';
import { PrismaClient, User } from '@prisma/client';

import { compareHash, generateHash } from '@utils/hash.util'
import { createAccessToken } from '@utils/jwt.util'
import type { CreateUserResponse, SignInUserResponse } from '@_types/mod';

const prisma = new PrismaClient();

export const getUsers = async (): Promise<User[]> => await prisma.user.findMany();


export const createUser = async (user: CreateUserDTO ): Promise<CreateUserResponse> => {

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

export const getUserById = async (id: string): Promise<User | null> => {
    const user = await prisma.user.findUnique({
        where: {
            id
        }
    });

    return user;
}

export const signInUser = async (data: SignInUserDTO): Promise<SignInUserResponse> => {

    const user = await prisma.user.findFirst({
        where: {
            // username: data.usernameOrEmail
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