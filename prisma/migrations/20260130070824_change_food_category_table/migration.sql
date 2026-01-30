/*
  Warnings:

  - You are about to drop the column `userId` on the `Recipe_Step` table. All the data in the column will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `Recipe` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `cookingTime` on the `Recipe` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `stepNumber` to the `Recipe_Step` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Food" DROP CONSTRAINT "Food_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Recipe_Step" DROP CONSTRAINT "Recipe_Step_userId_fkey";

-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "userId" INTEGER NOT NULL,
DROP COLUMN "cookingTime",
ADD COLUMN     "cookingTime" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Recipe_Step" DROP COLUMN "userId",
ADD COLUMN     "stepNumber" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Category";

-- CreateTable
CREATE TABLE "Food_Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Food_Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Food_Category_name_key" ON "Food_Category"("name");

-- AddForeignKey
ALTER TABLE "Food" ADD CONSTRAINT "Food_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Food_Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
