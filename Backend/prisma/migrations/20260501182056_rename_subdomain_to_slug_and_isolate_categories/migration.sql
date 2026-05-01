-- 1. Add the columns as NULLABLE first so the migration doesn't crash
ALTER TABLE "Category" ADD COLUMN "store_id" UUID;
ALTER TABLE "Store" ADD COLUMN "slug" VARCHAR(150);

-- 2. Migrate existing 'subdomain' data to 'slug' so you don't lose your URLs
UPDATE "Store" SET "slug" = "subdomain";

-- 3. Handle Categories: Assign all existing categories to your primary store
-- Replace 'PASTE_YOUR_STORE_ID_HERE' with a valid UUID from your Store table
UPDATE "Category" SET "store_id" = (SELECT store_id FROM "Store" LIMIT 1);

-- 4. Now that data exists, enforce NOT NULL and drop the old column
ALTER TABLE "Store" ALTER COLUMN "slug" SET NOT NULL;
ALTER TABLE "Store" DROP COLUMN "subdomain";
ALTER TABLE "Category" ALTER COLUMN "store_id" SET NOT NULL;

-- 5. Create the Indexes and Constraints
DROP INDEX IF EXISTS "Store_subdomain_key";
CREATE UNIQUE INDEX "Store_slug_key" ON "Store"("slug");
CREATE UNIQUE INDEX "Category_name_store_id_key" ON "Category"("name", "store_id");

-- 6. Add the Foreign Key
ALTER TABLE "Category" ADD CONSTRAINT "Category_store_id_fkey" 
FOREIGN KEY ("store_id") REFERENCES "Store"("store_id") ON DELETE RESTRICT ON UPDATE CASCADE;