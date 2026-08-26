-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_thumbnail_id_fkey";

-- DropForeignKey
ALTER TABLE "_PhotoToPost" DROP CONSTRAINT "_PhotoToPost_A_fkey";

-- DropForeignKey
ALTER TABLE "_PhotoToPost" DROP CONSTRAINT "_PhotoToPost_B_fkey";

-- DropTable
DROP TABLE "_PhotoToPost";

-- DropTable
DROP TABLE "posts";

-- DropEnum
DROP TYPE "post_type";
