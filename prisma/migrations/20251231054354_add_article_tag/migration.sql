-- CreateTable
CREATE TABLE "Article_Tag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Article_Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Article_Tag_Relation" (
    "articleId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,

    CONSTRAINT "Article_Tag_Relation_pkey" PRIMARY KEY ("articleId","tagId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Article_Tag_name_key" ON "Article_Tag"("name");

-- AddForeignKey
ALTER TABLE "Article_Tag_Relation" ADD CONSTRAINT "Article_Tag_Relation_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Article_Tag_Relation" ADD CONSTRAINT "Article_Tag_Relation_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Article_Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
