import { z } from 'zod'

export const signUpSchema = z.object({
    username: z.string().min(2).nonempty("Username is a required field."),
    email: z.string().email().max(255).nonempty("Email is a required field."),
    password: z.string().min(6).max(12).nonempty("Password is a required field.")
});

export const signInSchema = z.object({
    usernameOrEmail: z.string().nonempty({ message: "Property cannot be empty."}),
    password: z.string().nonempty({ message: "Property cannot be empty."}),
})