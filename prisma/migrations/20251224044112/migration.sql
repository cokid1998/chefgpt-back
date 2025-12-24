-- CreateEnum
CREATE TYPE "Option_Name" AS ENUM ('A', 'B');

-- CreateTable
CREATE TABLE "Vote" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "optionA" TEXT NOT NULL,
    "optionB" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vote_User" (
    "id" SERIAL NOT NULL,
    "voteId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "selectOption" "Option_Name" NOT NULL,

    CONSTRAINT "Vote_User_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Vote_User" ADD CONSTRAINT "Vote_User_voteId_fkey" FOREIGN KEY ("voteId") REFERENCES "Vote"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote_User" ADD CONSTRAINT "Vote_User_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
