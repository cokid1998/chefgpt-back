-- CreateTable
CREATE TABLE "Recipe_Like" (
    "id" SERIAL NOT NULL,
    "recipeId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Recipe_Like_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Recipe_Like_recipeId_userId_key" ON "Recipe_Like"("recipeId", "userId");

-- AddForeignKey
ALTER TABLE "Recipe_Like" ADD CONSTRAINT "Recipe_Like_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Vote"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recipe_Like" ADD CONSTRAINT "Recipe_Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
