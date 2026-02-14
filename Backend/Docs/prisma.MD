Loaded Prisma config from prisma.config.ts.

This will create a project for you on console.prisma.io and requires you to be authenticated.
✔ Would you like to authenticate? Yes
Let's set up your Prisma Postgres database!
✔ Select your region: eu-central-1 - Europe (Frankfurt)
✔ Enter a project name: Dokkan
✔ Success! Your Prisma Postgres database is ready ✅

We found an existing schema.prisma file in your current project directory.

--- Database URL ---

Connect Prisma ORM to your Prisma Postgres database with this URL:

postgres://5ef10cb2b248bc0c8ad6fe45b025c1a455c2a12300e88c691d1e050047102dba:sk_X6qXf-WKdNVWjIH4iUZhM@db.prisma.io:5432/postgres?sslmode=require

--- Next steps ---

Go to https://pris.ly/ppg-init for detailed instructions.

1. Install the Postgres adapter
npm install @prisma/adapter-pg

...and add it to your Prisma Client instance:

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

2. Apply migrations
Run the following command to create and apply a migration:
npx prisma migrate dev

3. Manage your data
View and edit your data locally by running this command:
npx prisma studio
...or online in Console:
https://console.prisma.io/y3qp4urft6op0vlerw6fpeny/cmllmr8zy02a61qee61iokk7p/cmllmr8zx02a21qeeeku8kos5/studio

4. Send queries from your app
If you already have an existing app with Prisma ORM, you can now run it and it will send queries against your newly created Prisma Postgres instance.

5. Learn more
For more info, visit the Prisma Postgres docs: https://pris.ly/ppg-docs