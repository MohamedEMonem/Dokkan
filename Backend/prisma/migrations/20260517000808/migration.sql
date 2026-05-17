-- AlterTable
ALTER TABLE "Store" ADD COLUMN     "operating_hours" JSONB,
ADD COLUMN     "phone_number" VARCHAR(20),
ADD COLUMN     "social_media_links" JSONB,
ADD COLUMN     "support_email" VARCHAR(150);
