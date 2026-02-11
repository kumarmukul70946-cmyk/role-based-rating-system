
import { PrismaClient } from '@prisma/client';

async function main() {
    const prisma = new PrismaClient();
    try {
        await prisma.$connect();
        console.log('Successfully connected to the database!');
        const count = await prisma.user.count();
        console.log(`Found ${count} users.`);
    } catch (e) {
        console.error('Failed to connect to database:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
