-- An event's image moves out of the shared "images" library into its own table,
-- one row per event, removed with the event.

-- CreateTable
CREATE TABLE "event_images" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "event_id" INTEGER NOT NULL,

    CONSTRAINT "event_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "event_images_key_key" ON "event_images"("key");

-- CreateIndex
CREATE UNIQUE INDEX "event_images_event_id_key" ON "event_images"("event_id");

-- AddForeignKey
ALTER TABLE "event_images" ADD CONSTRAINT "event_images_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Carry existing event images over. The R2 object is left in place and simply
-- referenced by its new owner, so nothing has to be re-uploaded.
INSERT INTO "event_images" ("url", "key", "event_id")
SELECT i."url", i."key", e."id"
FROM "events" e
JOIN "images" i ON i."id" = e."image_id";

-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_image_id_fkey";

-- AlterTable
ALTER TABLE "events" DROP COLUMN "image_id";

-- Drop the library rows that only ever backed an event, so those images stop
-- appearing under Images. Rows still used as a sponsor logo, an event type icon
-- or art, or a gallery cover are kept — they now share the R2 object with the
-- event_images row, which the delete path accounts for.
DELETE FROM "images" i
WHERE i."key" IN (SELECT "key" FROM "event_images")
  AND NOT EXISTS (SELECT 1 FROM "sponsors" s WHERE s."logo_id" = i."id")
  AND NOT EXISTS (SELECT 1 FROM "event_types" t WHERE t."icon_id" = i."id" OR t."art_id" = i."id")
  AND NOT EXISTS (SELECT 1 FROM "galleries" g WHERE g."image_id" = i."id");
