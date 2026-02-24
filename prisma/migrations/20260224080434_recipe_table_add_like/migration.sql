-- DropForeignKey
ALTER TABLE "Recipe_Like" DROP CONSTRAINT "Recipe_Like_recipeId_fkey";

-- AddForeignKey
ALTER TABLE "Recipe_Like" ADD CONSTRAINT "Recipe_Like_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
