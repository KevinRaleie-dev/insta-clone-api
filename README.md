# Instagram Clone 🤳🏽

Decided to build an insta clone but API first using my favourite tech stach ⚡️:

- GraphQL

- Node.js / TypeScript

- Prisma / Postgres

- Next.js

This gives me the opportunity to hone my skills a bit more and challenge myself to see how close I can build this to
being as close to insta as possible.

## Getting Started

If you'd like to clone the repo or contribute 🤝, here are a few things to get you up and running.

Firstly, clone the repo or fork 🍽 it, then run:

``` bash

npm i or yarn
```

Then you'd need to setup your database url in the ``` schema.prisma ``` file. Once that's done run:

``` bash
yarn migrate or npm run migrate
```

Hopefully you got green checks after running that command ✓.

If not, then its possible you do not have a ```.env``` file or you could not connect to your database.

If its the former then I suggest creating a ```.env``` file at the root of the project and populate it with the necessary environment variables, such as the database url, JWT token secret and port.

Then you can start the dev server by running:

``` bash
yarn dev or npm run dev
```

This will start a local dev server on ``` http://localhost:4000/graphql ```

Notice how im importing my files from the project paths? This will not work if you're planning to run the ```watch``` command and running the application from the generated ```dist``` folder.
