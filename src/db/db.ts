import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
export const connectToDb = async () => {
    try {
		await prisma.$connect()
		console.log('Connected to database')
	} catch (err) {
		console.log('Error connecting to db', err)
	}
}
