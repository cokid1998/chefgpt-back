import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import {
  CurrentUser,
  JWTUser,
} from "src/common/decorators/current-user.decorator";
import { ArticleService } from "src/modules/article/article.service";
import { CreateArticleDto } from "src/modules/article/dto/article.dto";
import {
  JwtAuthGuard,
  OptionalJwtAuthGuard,
} from "src/modules/auth/guard/jwt-auth.guard";

@Controller("article")
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: "요리 정보 아티클" })
  async findAllArticle(
    @CurrentUser() user: JWTUser,
    @Query("category") category?: string,
    @Query("search") search?: string,
  ) {
    const userId = user?.userId;
    return this.articleService.findAllArticle(category, search, userId);
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
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: "아티클 단건 조회" })
  async findOneArticle(
    @CurrentUser() user: JWTUser,
    @Param("articleId", ParseIntPipe) articleId: number,
  ) {
    const userId = user?.userId;
    return this.articleService.findOneArticle(articleId, userId);
  }

  @Post("")
  @ApiOperation({ summary: "요리 정보 아티클 생성" })
  async createArticle(@Body() payload: CreateArticleDto) {
    return this.articleService.createArticle(payload);
  }

  @Patch(":articleId")
  @ApiOperation({ summary: "아티클 조회수 증가" })
  async incrementViewCount(
    @Param("articleId", ParseIntPipe) articleId: number,
  ) {
    return this.articleService.incrementViewCount(articleId);
  }

  @Patch("/like/:articleId")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "아티클 조회수 증가" })
  async toggleArticleLike(
    @Param("articleId", ParseIntPipe) articleId: number,
    @CurrentUser() user: JWTUser,
  ) {
    const { userId, email: _ } = user;
    return this.articleService.toggleArticleLike(articleId, userId);
  }
}
