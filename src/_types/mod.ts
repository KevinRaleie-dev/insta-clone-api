import { User } from '@prisma/client'

type Message = "Invalid username/email or password." |
"Could not find the requested user." |
"You're already following this user." |
"This account is already taken." | 
"You're not following this user." |
"You're not allowed to follow yourself."

const ArrayOfFields = ["email", "username", "password", "usernameOrEmail"] as const;
type Fields = typeof ArrayOfFields

type Field = Fields[number]

type CommonResponse = {
    success: boolean;
    message?: Message;
}

export type CreateUserResponse = CommonResponse & {
    user?: User;
    field?: Field;
}

export type SignInUserResponse = CommonResponse & {
    token?: string;
    field?: Field;
}

export type FollowUserResponse = CreateUserResponse & {
    error?: any
}

export type Payload = {
    id: string;
}

export type WhichType = "followers" | "following"