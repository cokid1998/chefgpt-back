-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "likeCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Article_Like" (
    "id" SERIAL NOT NULL,
    "articleId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Article_Like_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Article_Like" ADD CONSTRAINT "Article_Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Article_Like" ADD CONSTRAINT "Article_Like_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
