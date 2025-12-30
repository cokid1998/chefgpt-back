import { Controller, Get } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { ArticleService } from "src/article/article.service";

@Controller("article")
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  @ApiOperation({ summary: "요리 정보 아티클" })
  async findAllArticle() {
    return this.articleService.findAllArticle();
  }
}
