import 'reflect-metadata';
import 'dotenv/config';

import express from 'express';

import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { Container } from 'typedi'

import { HelloResolver } from '@resolvers/hello.resolver';
import { AuthResolver } from '@resolvers/auth.resolver'
import { UserResolver } from '@resolvers/user.resolver'

async function main() {

    const app = express();
    const PORT = 4000;

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [
                HelloResolver,
                AuthResolver,
                UserResolver
            ],
            validate: false,
            container: Container
        })
    });

    await apolloServer.start();
    apolloServer.applyMiddleware({ app });

    app.listen(PORT, () => {
        console.log(`Server is running on localhost:${PORT}${apolloServer.graphqlPath}`)
    })
}

main();