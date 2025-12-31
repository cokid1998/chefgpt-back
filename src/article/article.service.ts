import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { getReadingTimeFromHTML } from "src/util/readingTime";

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
        readingTime: true,
      },
    });

    return article;
  }

  async findAllArticleCategory() {
    const categories = await this.prisma.article_Category.findMany({
      orderBy: { id: "asc" },
    });
    return categories;
  }

  async articleCount() {
    const count = await this.prisma.article.count();

    return count;
  }
}
