import { Injectable } from "@nestjs/common";
import { contains } from "class-validator";
import { Prisma } from "prisma/generated/client";
import { CreateArticleDto } from "src/modules/article/dto/article.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { getReadingTimeFromText } from "src/common/util/readingTime";

@Injectable()
export class ArticleService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllArticle(category: string, search: string, userId?: number) {
    const where: Prisma.ArticleWhereInput = {};

    if (category) {
      where.category = {
        name: category,
      };
    }

    if (search) {
      where.title = {
        contains: search,
        mode: "insensitive",
      };
    }

    const articles = await this.prisma.article.findMany({
      where,
      select: {
        userId: true,
        id: true,
        title: true,
        summary: true,
        contentJSON: true,
        category: true,
        readingTime: true,
        viewCount: true,
        createdAt: true,
        likeCount: true,
        like: userId
          ? {
              where: { userId },
            }
          : false,

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
      orderBy: { createdAt: "desc" },
    });

    const formatArticle = articles.map(
      ({ articleTagRelations, ...article }) => ({
        ...article,
        tags: articleTagRelations.map((at) => at.tag.name),
        liked: userId ? article.like.length > 0 : false,
      }),
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

  async findOneArticle(articleId: number, userId?: number) {
    const article = await this.prisma.article.findFirst({
      where: {
        id: articleId,
      },
      select: {
        userId: true,
        id: true,
        title: true,
        summary: true,
        contentJSON: true,
        category: true,
        readingTime: true,
        viewCount: true,
        createdAt: true,
        likeCount: true,
        like: userId ? { where: { userId } } : false,

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

    const { articleTagRelations, ...formatArticle } = article;

    return {
      ...formatArticle,
      tags: articleTagRelations.map((at) => at.tag.name),
      liked: userId ? article.like.length > 0 : false,
    };
  }

  async getMyArticle(userId: number) {
    const articles = await this.prisma.article.findMany({
      where: {
        userId,
      },
      select: {
        userId: true,
        id: true,
        createdAt: true,
        title: true,
        summary: true,
        contentJSON: true,
        readingTime: true,
        viewCount: true,
        likeCount: true,
        category: true,
        articleTagRelations: {
          select: {
            tag: {
              select: { name: true },
            },
          },
        },
        like: { where: { userId } },
      },
      orderBy: { id: "desc" },
    });

    return articles.map((article) => ({
      ...article,
      tags: article.articleTagRelations.map((r) => r.tag.name),
      liked: article.like.length > 0,
      articleTagRelations: undefined,
      like: undefined,
    }));
  }

  async getLikedArticle(userId: number) {
    const articles = await this.prisma.article.findMany({
      where: {
        like: {
          some: { userId },
        },
      },
      select: {
        id: true,
        createdAt: true,
        title: true,
        summary: true,
        contentJSON: true,
        readingTime: true,
        viewCount: true,
        likeCount: true,
        category: true,
        articleTagRelations: {
          select: {
            tag: {
              select: { name: true },
            },
          },
        },
        like: { where: { userId } },
      },
      orderBy: { id: "desc" },
    });

    return articles.map((article) => ({
      ...article,
      tags: article.articleTagRelations.map((r) => r.tag.name),
      liked: article.like.length > 0,
      articleTagRelations: undefined,
      like: undefined,
    }));
  }

  async createArticle(userId: number, payload: CreateArticleDto) {
    // 고려해야할것
    // 사용자A가 이미 만든 태그를 사용자B가 똑같이 태그를 만들었을 때 중복된 태그가 생성이 되지 않아야함
    // 영향을 받는 테이블은 Article, Article_Tag, Article_Tag_Relation
    const { title, summary, categoryId, tags, contentJSON, contentText } =
      payload;
    const readingTime = getReadingTimeFromText(contentText);

    // 아티클 추가시 여러 테이블에 영향을 주기 때문에
    // 성공시 연관된 테이블에 데이터 추가 or 실패시 연관된 테이블에 데이터를 추가 하지 않아야함
    // 따라서 transaction을 사용
    const article = await this.prisma.$transaction(async (tx) => {
      // 1. Article테이블에 데이터 생성
      const newArticle = await tx.article.create({
        data: {
          userId,
          title,
          contentJSON,
          summary,
          categoryId,
          readingTime,
        },
      });

      // 2. 같은 이름의 중복된 태그를 생성 방지
      if (tags && tags.length > 0) {
        const tagIds = await Promise.all(
          tags.map(async (tagName) => {
            // 이전에 생성된 같은 이름의 태그가 있는지 탐색
            // 있으면 그대로 tag변수에 할당
            let tag = await tx.article_Tag.findUnique({
              where: { name: tagName },
            });

            // 없으면 새로 생성
            if (!tag) {
              tag = await tx.article_Tag.create({
                data: { name: tagName },
              });
            }

            return tag.id;
          }),
        );

        // 3. Article_Tag_Relation생성
        await tx.article_Tag_Relation.createMany({
          data: tagIds.map((tagId) => ({
            articleId: newArticle.id,
            tagId,
          })),
        });
      }

      return newArticle;
    });

    return article;
  }

  async incrementViewCount(articleId: number) {
    const article = await this.prisma.article.update({
      where: { id: articleId },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });

    return article;
  }

  async toggleArticleLike(articleId: number, userId: number) {
    return this.prisma.$transaction(async (tx) => {
      const existingLike = await tx.article_Like.findUnique({
        where: {
          articleId_userId: { articleId, userId },
        },
      });

      if (existingLike) {
        await tx.article_Like.delete({
          where: {
            articleId_userId: { articleId, userId },
          },
        });

        await tx.article.update({
          where: { id: articleId },
          data: {
            likeCount: {
              decrement: 1,
            },
          },
        });

        return { liked: false };
      }

      await tx.article_Like.create({
        data: { articleId, userId },
      });

      await tx.article.update({
        where: { id: articleId },
        data: {
          likeCount: {
            increment: 1,
          },
        },
      });

      return { liked: true };
    });
  }
}
