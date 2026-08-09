-- AlterTable
ALTER TABLE "event_types" ADD COLUMN     "icon_id" INTEGER;

-- AddForeignKey
ALTER TABLE "event_types" ADD CONSTRAINT "event_types_icon_id_fkey" FOREIGN KEY ("icon_id") REFERENCES "images"("id") ON DELETE SET NULL ON UPDATE CASCADE;
