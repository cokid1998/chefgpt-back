-- CreateEnum
CREATE TYPE "Recipe_Category" AS ENUM ('한식', '양식', '중식', '일식', '디저트', '음료', '기타');

-- CreateTable
CREATE TABLE "Recipe" (
    "id" SERIAL NOT NULL,
    "category" "Recipe_Category" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "cookingTime" TEXT NOT NULL,

    CONSTRAINT "Recipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recipe_Ingredient" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "recipeId" INTEGER NOT NULL,

    CONSTRAINT "Recipe_Ingredient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recipe_Step" (
    "id" SERIAL NOT NULL,
    "stepTitle" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tip" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "recipeId" INTEGER NOT NULL,

    CONSTRAINT "Recipe_Step_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Recipe_Ingredient" ADD CONSTRAINT "Recipe_Ingredient_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recipe_Step" ADD CONSTRAINT "Recipe_Step_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recipe_Step" ADD CONSTRAINT "Recipe_Step_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
