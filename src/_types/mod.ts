import { User } from '@prisma/client'

type Message = "Invalid username/email or password." |
"Could not find the requested user." |
"You're already following this user." |
"This account is already taken." | 
"You're not following this user."

type CommonResponse = {
    success: boolean;
    message?: Message;
}

export type CreateUserResponse = CommonResponse & {
    user?: User;
}

export type SignInUserResponse = CommonResponse & {
    token?: string;
}

export type FollowUserResponse = CreateUserResponse & {
    error?: any
}

export type Payload = {
    id: string;
}

export type WhichType = "followers" | "following"