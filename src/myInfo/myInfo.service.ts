import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class MyinfoService {
  constructor(private readonly prisma: PrismaService) {}

  async findMyInfoBannerData() {
    // Todo: 더미 데이터 삭제

    return {
      recipeCount: 4,
      totalViewCount: 10,
      totalLike: 5,
      votePulls: 10,
    };
  }
}
