import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { getReadingTimeFromHTML } from "src/util/readingTime";

@Injectable()
export class ArticleService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllArticle() {
    const articles = await this.prisma.article.findMany({
      select: {
        id: true,
        title: true,
        summary: true,
        content: true,
        category: true,
        readingTime: true,
        viewCount: true,
        articleTagRelations: {
          select: {
            tag: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    const formatArticle = articles.map(
      ({ articleTagRelations, ...article }) => ({
        ...article,
        tags: articleTagRelations.map((at) => at.tag.name),
      })
    );

    return formatArticle;
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
