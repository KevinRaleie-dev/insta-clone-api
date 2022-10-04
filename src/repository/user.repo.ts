import type { CreateUserDTO } from "@dtos/createUser.dto";
import type { SignInUserDTO } from "@dtos/signInUser.dto";
import { Relations, User } from "@prisma/client";
import { Service } from "typedi";

import { compareHash, generateHash } from "@utils/hash.util";
import { createAccessToken } from "@utils/jwt.util";
import type {
  CreateUserResponse,
  SignInUserResponse,
  WhichType,
} from "@_types/mod";
import prisma from "../lib/prisma.lib";

@Service()
export class UserRepo {
  // TODO: limit to how many i can get back
  async getUsers(): Promise<User[]> {
    return await prisma.user.findMany();
  }

  async createUser(user: CreateUserDTO): Promise<CreateUserResponse> {
    const { email, password, username } = user;
    const foundUser = await prisma.user.findFirst({
      where: {
        OR: [
          {
            email: {
              equals: email,
            },
            username: {
              equals: username,
            },
          },
        ],
      },
    });

    if (foundUser) {
      return {
        success: false,
        field: "email",
        message: "This account is already taken.",
      };
    }

    const hashedPassword = await generateHash(password);

    return {
      success: true,
      user: await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
        },
      }),
    };
  }

  async getUserById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async signInUser(data: SignInUserDTO): Promise<SignInUserResponse> {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          {
            username: {
              equals: data.usernameOrEmail,
            },
          },
          {
            email: {
              equals: data.usernameOrEmail,
            },
          },
        ],
      },
    });

    if (!user) {
      return {
        success: false,
        field: "usernameOrEmail",
        message: "Invalid username/email or password.",
      };
    }

    const isValidPassword = await compareHash(user.password, data.password);

    if (!isValidPassword) {
      return {
        success: false,
        field: "password",
        message: "Invalid username/email or password.",
      };
    }

    return {
      success: true,
      token: createAccessToken(user),
    };
  }

  async deleteUser(id: string): Promise<boolean> {
    const user = await prisma.user.delete({
      where: {
        id: id,
      },
    });

    return user ? true : false;
  }

  // accept an array of relations instead of an array of strings along with the type of users
  async getMultipleUsersById(userIds: Relations[], type: WhichType) {
    const queries = [];

    if (type === "followers") {
      for (const id of userIds) {
        const query = prisma.user.findUnique({
          where: {
            id: id.follower_id!,
          },
        });

        queries.push(query);
      }

      const users = await Promise.all(queries);

      return users as User[];
    }
    for (const id of userIds) {
      const query = prisma.user.findUnique({
        where: {
          id: id.followed_id!,
        },
      });

      queries.push(query);
    }

    const users = await Promise.all(queries);

    return users as User[];
  }
}
