/*
  Warnings:

  - The primary key for the `Store` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `StoreEmployee` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_store_id_fkey";

-- DropForeignKey
ALTER TABLE "Orders" DROP CONSTRAINT "Orders_store_id_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_store_id_fkey";

-- DropForeignKey
ALTER TABLE "StoreEmployee" DROP CONSTRAINT "StoreEmployee_store_id_fkey";

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_store_id_fkey";

-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "store_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Orders" ALTER COLUMN "store_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "store_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Store" DROP CONSTRAINT "Store_pkey",
ALTER COLUMN "store_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Store_pkey" PRIMARY KEY ("store_id");

-- AlterTable
ALTER TABLE "StoreEmployee" DROP CONSTRAINT "StoreEmployee_pkey",
ALTER COLUMN "store_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "StoreEmployee_pkey" PRIMARY KEY ("user_id", "store_id");

-- AlterTable
ALTER TABLE "Subscription" ALTER COLUMN "store_id" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "Store"("store_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "Store"("store_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "Store"("store_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoreEmployee" ADD CONSTRAINT "StoreEmployee_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "Store"("store_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "Store"("store_id") ON DELETE SET NULL ON UPDATE CASCADE;
