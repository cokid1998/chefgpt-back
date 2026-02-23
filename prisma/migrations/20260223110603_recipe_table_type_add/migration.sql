/*
  Warnings:

  - Added the required column `recipeType` to the `Recipe` table without a default value. This is not possible if the table is not empty.
  - Made the column `thumbnailUrl` on table `Recipe` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "RecipeType" AS ENUM ('YOUTUBE', 'MANUAL');

-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "recipeType" "RecipeType" NOT NULL,
ALTER COLUMN "thumbnailUrl" SET NOT NULL;
