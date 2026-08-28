-- Gallery.image was added as a cover/link thumbnail that no page ever rendered;
-- the bar art on /galleries is Gallery.banner instead.

-- DropForeignKey
ALTER TABLE "galleries" DROP CONSTRAINT "galleries_image_id_fkey";

-- AlterTable
ALTER TABLE "galleries" DROP COLUMN "image_id";
