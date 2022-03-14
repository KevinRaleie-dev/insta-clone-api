import { User } from '@prisma/client';
import jwt from 'jsonwebtoken';

export const createAccessToken = (user: User): string => {

    const token = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET as string, {
        expiresIn: '1d',
    });

    return token;
};