import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import generatedPrisma from "../generated/prisma/index.js";

const { PrismaClient } = generatedPrisma;

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
	throw new Error("DATABASE_URL is not defined. Ensure .env is loaded before Prisma client initialization.");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export default prisma;
