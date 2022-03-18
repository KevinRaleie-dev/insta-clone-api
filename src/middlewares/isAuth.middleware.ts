import { Context } from '@context/mod'
import { MiddlewareFn, NextFn } from 'type-graphql'
import { verifyAccessToken } from '@utils/jwt.util'
import { throwError } from '@utils/error.util';

export const isAuth: MiddlewareFn<Context> = ({ context }, next: NextFn): any => {

    const auth = context.req.headers["authorization"];

    if (!auth) {
        throw new Error("You are not authorized to perform this action.");
    }

    try {
        const token = auth.split(' ')[1];
        const payload = verifyAccessToken(token);

        context.payload = payload as any;

    } catch (error) {
        throwError(error.message)
    }

    return next()
}