import { Post, PrismaClient } from "@prisma/client";
import { Service } from "typedi";

const prisma = new PrismaClient();

@Service()
export class PostRepo {

    async posts(): Promise<Post[]> {
        return await prisma.post.findMany();
    }

    async getPostById(id: string): Promise<Post | null> {
        return await prisma.post.findUnique({ where: { id } });
    }

    


}