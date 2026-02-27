import { Module } from "@nestjs/common";
import { ArticleService } from "src/modules/article/article.service";
import { ArticleController } from "src/modules/article/article.controller";

@Module({
  providers: [ArticleService],
  controllers: [ArticleController],
})
export class ArticleModule {}
