import 'reflect-metadata';
import 'dotenv/config';

import express from 'express';

import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { Container } from 'typedi'
import { connectToDb } from './db/db'
import { HelloResolver } from '@resolvers/hello.resolver';
import { AuthResolver } from '@resolvers/auth.resolver';
import { UserResolver } from '@resolvers/user.resolver';
import { MeResolver } from '@resolvers/me.resolver'
import { PostResolver } from '@resolvers/post.resolver';
import { Context } from '@context/mod'

async function main() {

    const app = express();
    const PORT = 4000;

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [
                HelloResolver,
                AuthResolver,
                UserResolver,
                MeResolver,
                PostResolver
            ],
            validate: false,
            container: Container
        }),
        context: ({ req, res, }): Context => ({ req, res })
    });

    await apolloServer.start();
    apolloServer.applyMiddleware({ app });
	
	await connectToDb(); // check if the connection to the db is successful

    app.listen(PORT, () => {
        console.info(`Server is running on localhost:${PORT}${apolloServer.graphqlPath}`)
    })
}

main();
