const prisma = require('./prismaClient');

async function main() {
    const admin = await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: { email: 'admin@example.com', name: 'Admin' }
    });

    const existing = await prisma.post.count({ where: { authorId: admin.id } });

    if (existing === 0) {
        await prisma.post.createMany({
            data: [
                { title: 'Hello Prisma', content: 'First post', published: true, authorId: admin.id },
                { title: 'Draft Post', content: 'Not published yet', published: false, authorId: admin.id },
            ]
        });
    }

    console.log('Seed complete.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });