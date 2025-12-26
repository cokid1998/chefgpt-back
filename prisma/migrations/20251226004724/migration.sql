/*
  Warnings:

  - A unique constraint covering the columns `[voteId,userId]` on the table `Vote_User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Vote" ALTER COLUMN "description" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Vote_User_voteId_userId_key" ON "Vote_User"("voteId", "userId");
