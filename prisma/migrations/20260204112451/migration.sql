-- AlterTable
ALTER TABLE "Recipe" ALTER COLUMN "cookingTime" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Recipe_Step" ALTER COLUMN "tip" DROP NOT NULL;
