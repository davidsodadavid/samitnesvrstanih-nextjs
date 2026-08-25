-- AlterTable
ALTER TABLE "galleries" ADD COLUMN     "image_id" INTEGER;

-- AddForeignKey
ALTER TABLE "galleries" ADD CONSTRAINT "galleries_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "images"("id") ON DELETE SET NULL ON UPDATE CASCADE;
