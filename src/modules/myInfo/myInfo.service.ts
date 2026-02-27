import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class MyInfoService {
  constructor(private readonly prisma: PrismaService) {}

  async findMyInfoBannerData(userId: number) {
    const recipeCount = await this.prisma.recipe.count({
      where: { userId },
    });
    const [articleViewCount, recipeViewCount] = await Promise.all([
      this.prisma.article.aggregate({ _sum: { viewCount: true } }),
      this.prisma.recipe.aggregate({ _sum: { viewCount: true } }),
    ]);
    const totalViewCount =
      articleViewCount._sum.viewCount + recipeViewCount._sum.viewCount;

    const votePulls = await this.prisma.vote_User.count({
      where: { userId },
    });

    console.log(votePulls);

    return {
      recipeCount,
      totalViewCount,
      totalLike: 5, //Todo: 아티클 좋아요 기능 설계
      votePulls,
    };
  }
}
