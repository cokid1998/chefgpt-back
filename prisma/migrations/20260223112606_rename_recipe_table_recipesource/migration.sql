/*
  Warnings:

  - You are about to drop the column `recipeType` on the `Recipe` table. All the data in the column will be lost.
  - Added the required column `recipeSource` to the `Recipe` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Recipe_Source" AS ENUM ('YOUTUBE', 'MANUAL');

-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "recipeType",
ADD COLUMN     "recipeSource" "Recipe_Source" NOT NULL;

-- DropEnum
DROP TYPE "RecipeType";
