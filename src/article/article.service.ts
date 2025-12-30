import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ArticleService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllArticle() {
    const article = await this.prisma.article.findMany();

    return article;
  }
}
