/*
  Warnings:

  - You are about to drop the column `category` on the `Recipe` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `Recipe` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "category",
ADD COLUMN     "categoryId" INTEGER NOT NULL;

-- DropEnum
DROP TYPE "Recipe_Category";

-- CreateTable
CREATE TABLE "Recipe_Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Recipe_Category_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Recipe_Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
