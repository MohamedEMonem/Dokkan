require("dotenv/config");
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("../generated/prisma");

const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Create or find a test user
  let user = await prisma.user.findUnique({ where: { id: 1 } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        id: 1,
        name: "Test Owner",
        email: "owner@test.com",
        password: "hashedpassword",
        role: "StoreOwner",
      },
    });
  }

  // Create or find a test store
  let store = await prisma.store.findUnique({ where: { id: 1001 } });
  if (!store) {
    store = await prisma.store.create({
      data: {
        id: 1001,
        ownerId: user.id,
        name: "Test Store",
        subdomain: "teststore",
        status: "Active",
      },
    });
  }

  // Create or find a test category
  let category = await prisma.category.findUnique({ where: { id: 2 } });
  if (!category) {
    category = await prisma.category.create({
      data: {
        id: 2,
        name: "Test Category",
      },
    });
  }

  console.log("Test data ready:");
  console.log("User ID:", user.id);
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