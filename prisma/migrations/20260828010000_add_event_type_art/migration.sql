-- AlterTable
ALTER TABLE "event_types" ADD COLUMN     "art_id" INTEGER;

-- AddForeignKey
ALTER TABLE "event_types" ADD CONSTRAINT "event_types_art_id_fkey" FOREIGN KEY ("art_id") REFERENCES "images"("id") ON DELETE SET NULL ON UPDATE CASCADE;
