import { PrismaClient } from '@prisma/client';
import { hash } from 'argon2';

const prisma = new PrismaClient();

async function main() {
    const adminCount = await prisma.admin.count();

    if (adminCount === 0) {
        const hashedPassword = await hash(process.env.ADMIN_PASSWORD || 'admin123');

        await prisma.admin.create({
            data: {
                username: process.env.ADMIN_USERNAME || 'admin',
                password: hashedPassword,
            }
        });

    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });