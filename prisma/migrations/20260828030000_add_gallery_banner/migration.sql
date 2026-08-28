-- AlterTable
ALTER TABLE "galleries" ADD COLUMN     "banner_id" INTEGER;

-- AddForeignKey
ALTER TABLE "galleries" ADD CONSTRAINT "galleries_banner_id_fkey" FOREIGN KEY ("banner_id") REFERENCES "images"("id") ON DELETE SET NULL ON UPDATE CASCADE;
