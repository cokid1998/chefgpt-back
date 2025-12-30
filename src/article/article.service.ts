import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ArticleService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllArticle() {
    const article = await this.prisma.article.findMany({
      select: {
        id: true,
        title: true,
        summary: true,
        content: true,
        category: true,
      },
    });
    return article;
  }

  async findAllArticleCategory() {
    const categories = await this.prisma.article_Category.findMany();
    return categories;
  }
}
