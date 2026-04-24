import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import prismaClientPkg from "@prisma/client";
import { randomUUID } from "crypto";
import { randomBytes, pbkdf2 as pbkdf2Callback } from "crypto";
import { promisify } from "util";

const { PrismaClient } = prismaClientPkg;

const pbkdf2 = promisify(pbkdf2Callback);

const PASSWORD_ALGORITHM = "pbkdf2";
const PASSWORD_DIGEST = "sha256";
const PASSWORD_ITERATIONS = 310000;
const PASSWORD_KEY_LENGTH = 32;
const PASSWORD_SALT_BYTES = 16;

function toBase64Url(value) {
  return value.toString("base64url");
}

async function hashPassword(password) {
  const salt = randomBytes(PASSWORD_SALT_BYTES);
  const derivedKey = await pbkdf2(password, salt, PASSWORD_ITERATIONS, PASSWORD_KEY_LENGTH, PASSWORD_DIGEST);

  return [
    PASSWORD_ALGORITHM,
    PASSWORD_DIGEST,
    String(PASSWORD_ITERATIONS),
    toBase64Url(salt),
    toBase64Url(derivedKey),
  ].join("$");
}

const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await hashPassword("Pass1234!");

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