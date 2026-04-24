import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import prismaClientPkg from "@prisma/client";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

const { PrismaClient } = prismaClientPkg;

const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await bcrypt.hash("Pass1234!", 10);

  // Create or find a test user
  let user = await prisma.user.findUnique({ where: { email: "owner@test.com" } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        id: randomUUID(),
        name: "Test Owner",
        email: "owner@test.com",
        password: hashedPassword,
        role: "StoreOwner",
      },
    });
  }

  let adminUser = await prisma.user.findUnique({ where: { email: "admin@test.com" } });
  if (!adminUser) {
    adminUser = await prisma.user.create({
      data: {
        id: randomUUID(),
        name: "Test Admin",
        email: "admin@test.com",
        password: hashedPassword,
        role: "Admin",
      },
    });
  }

  // Create or find a test store
  let store = await prisma.store.findUnique({ where: { subdomain: "teststore" } });
  if (!store) {
    store = await prisma.store.create({
      data: {
        id: randomUUID(),
        ownerId: user.id,
        name: "Test Store",
        subdomain: "teststore",
        status: "Active",
      },
    });
  }

  // Create or find a test category
  let category = await prisma.category.findFirst({ where: { name: "Test Category" } });
  if (!category) {
    category = await prisma.category.create({
      data: {
        id: randomUUID(),
        name: "Test Category",
      },
    });
  }

  console.log("Test data ready:");
  console.log("User ID:", user.id);
  console.log("Admin ID:", adminUser.id);
  console.log("Store ID:", store.id);
  console.log("Category ID:", category.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });