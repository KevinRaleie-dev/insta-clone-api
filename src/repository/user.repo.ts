import type { CreateUserDTO } from '@dtos/createUser.dto'
import { PrismaClient, User } from '@prisma/client';

import { generateHash } from '@utils/hash.util'

const prisma = new PrismaClient();

type CreateUserResponse = {
    success: boolean;
    message?: string;
    user?: User;
}

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