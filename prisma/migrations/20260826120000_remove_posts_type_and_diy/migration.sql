-- DropForeignKey
ALTER TABLE "diys" DROP CONSTRAINT "diys_location_id_fkey";

-- DropForeignKey
ALTER TABLE "_DiyToPhoto" DROP CONSTRAINT "_DiyToPhoto_A_fkey";

-- DropForeignKey
ALTER TABLE "_DiyToPhoto" DROP CONSTRAINT "_DiyToPhoto_B_fkey";

-- DropTable
DROP TABLE "_DiyToPhoto";

-- DropTable
DROP TABLE "diys";

-- AlterEnum
BEGIN;
CREATE TYPE "post_type_new" AS ENUM ('FILM', 'EXHIBITION', 'WORKSHOP', 'CONCERT');
ALTER TABLE "posts" ALTER COLUMN "type" TYPE "post_type_new" USING ("type"::text::"post_type_new");
ALTER TYPE "post_type" RENAME TO "post_type_old";
ALTER TYPE "post_type_new" RENAME TO "post_type";
DROP TYPE "post_type_old";
COMMIT;
