import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
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

  @Get("category")
  @ApiOperation({ summary: "요리 정보 아티클 카테고리" })
  async findAllArticleCategory() {
    return this.articleService.findAllArticleCategory();
  }

  @Get("count")
  @ApiOperation({ summary: "요리 정보 아티클 개수" })
  async articleCount() {
    return this.articleService.articleCount();
  }

  @Get(":articleId")
  @ApiOperation({ summary: "아티클 단건 조회" })
  async findOneArticle(@Param("articleId", ParseIntPipe) articleId: number) {
    return this.articleService.findOneArticle(articleId);
  }
}
