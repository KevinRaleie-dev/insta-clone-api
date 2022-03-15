import { User } from '@prisma/client'

export type CreateUserResponse = {
    success: boolean;
    message?: string;
    user?: User;
}

export type SignInUserResponse = {
    success: boolean;
    message?: string;
    token?: string;
}

export type Payload = {
    id: string;
}