import { PrismaClient } from '@prisma/client';
import { hash } from 'argon2';

const prisma = new PrismaClient();

async function main() {
    const adminCount = await prisma.admin.count();

    if (adminCount === 0) {
        const username = process.env.ADMIN_USERNAME;
        const password = process.env.ADMIN_PASSWORD;

        if (!username || !password) {
            throw new Error(
                'ADMIN_USERNAME и ADMIN_PASSWORD обязательны для первичного seed',
            );
        }

        const hashedPassword = await hash(password);

        await prisma.admin.create({
            data: {
                username,
                password: hashedPassword,
            },
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
