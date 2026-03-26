import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
    const passwordHash = await bcrypt.hash("@Admin123", 10);

    const user = await prisma.user.upsert({
        where: { email: "lucas@admin.com" },
        update: {
            firstName: "Lucas",
            lastName: "Pessoa",
            passwordHash,
        },
        create: {
            firstName: "Lucas",
            lastName: "Pessoa",
            email: "lucas@admin.com",
            passwordHash,
        },
    });

    console.log(`Seed completed for user: ${user.email}`);
}

main()
    .catch((error) => {
        console.error("Seed failed:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
