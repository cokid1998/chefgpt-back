/*
  Warnings:

  - Made the column `categoryId` on table `Food` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Food" DROP CONSTRAINT "Food_categoryId_fkey";

-- AlterTable
ALTER TABLE "Food" ALTER COLUMN "location" DROP NOT NULL,
ALTER COLUMN "quantity" DROP NOT NULL,
ALTER COLUMN "unit" DROP NOT NULL,
ALTER COLUMN "expiration_date" DROP NOT NULL,
ALTER COLUMN "memo" DROP NOT NULL,
ALTER COLUMN "categoryId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Food" ADD CONSTRAINT "Food_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
