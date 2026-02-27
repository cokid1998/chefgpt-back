/*
  Warnings:

  - A unique constraint covering the columns `[articleId,userId]` on the table `Article_Like` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Article_Like_articleId_userId_key" ON "Article_Like"("articleId", "userId");
