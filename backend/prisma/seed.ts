
import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    // 1. Create Base Users (Admin, Owner, User)
    const password = await bcrypt.hash('Password@123', 10);

    const admin = await prisma.user.upsert({
        where: { email: 'admin@admin.com' },
        update: {},
        create: {
            name: 'System Administrator User',
            email: 'admin@admin.com',
            password_hash: password,
            address: 'Admin HQ, 123 Tech Park, Silicon Valley, CA 94000',
            role: Role.ADMIN,
        },
    });

    const owner = await prisma.user.upsert({
        where: { email: 'owner@store.com' },
        update: {},
        create: {
            name: 'Store Owner Representative',
            email: 'owner@store.com',
            password_hash: password,
            address: 'Owner Residence, 456 Commerce St, Retail City, NY 10001',
            role: Role.OWNER,
        },
    });

    const baseUser = await prisma.user.upsert({
        where: { email: 'user@user.com' },
        update: {},
        create: {
            name: 'Regular Shopping User Account',
            email: 'user@user.com',
            password_hash: password,
            address: 'User Apartment, 789 Consumer Ave, Market Town, TX 75001',
            role: Role.USER,
        },
    });

    console.log('Base users checked/created.');

    // 2. Generate Bulk Users (20 Users)
    const users = [baseUser];
    for (let i = 1; i <= 20; i++) {
        const userEmail = `user${i}@example.com`;
        const newUser = await prisma.user.upsert({
            where: { email: userEmail },
            update: {},
            create: {
                name: `Test User Account Number ${i}`, // Min 20 chars
                email: userEmail,
                password_hash: password,
                address: `10${i} Random St, City ${i}`,
                role: Role.USER,
            },
        });
        users.push(newUser);
    }
    console.log(`Created/Checked ${users.length} users.`);

    // 3. Generate Bulk Stores (15 Stores)
    const stores = [];
    const storeCategories = ['Bakery', 'Electronics', 'Clothing', 'Books', 'Furniture', 'Toys', 'Sports', 'Music', 'Hardware', 'Garden'];

    for (let i = 1; i <= 15; i++) {
        const category = storeCategories[i % storeCategories.length];
        const storeName = `${category} Store ${i}`;
        const storeEmail = `store${i}@shop.com`;

        // Check if exists to avoid unique constraint error on re-seed
        let store = await prisma.store.findUnique({ where: { email: storeEmail } });
        if (!store) {
            store = await prisma.store.create({
                data: {
                    name: storeName,
                    email: storeEmail,
                    address: `${i * 5} Market Street, Shopping District`,
                    ownerUserId: owner.id,
                },
            });
        }
        stores.push(store);
    }
    console.log(`Created/Checked ${stores.length} stores.`);

    // 4. Generate Random Ratings
    // Each user rates random 3-8 stores
    console.log('Generating ratings...');
    for (const u of users) {
        // Randomly select 3 to 8 stores to rate
        const numRatings = Math.floor(Math.random() * 6) + 3;
        const shuffledStores = [...stores].sort(() => 0.5 - Math.random());
        const selectedStores = shuffledStores.slice(0, numRatings);

        for (const s of selectedStores) {
            const ratingVal = Math.floor(Math.random() * 5) + 1; // 1-5

            await prisma.rating.upsert({
                where: {
                    storeId_userId: {
                        storeId: s.id,
                        userId: u.id,
                    }
                },
                update: {}, // Don't change existing ratings
                create: {
                    storeId: s.id,
                    userId: u.id,
                    rating: ratingVal
                }
            });
        }
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
