import { PrismaClient } from "@prisma/client";

type Global = {
  prisma?: PrismaClient;
};

let global: Global = {};

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === "development") {
  global.prisma = prisma;
}

export default prisma
