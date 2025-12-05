import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class FoodService {
  constructor(private readonly prisma: PrismaService) {}

  async findFoodById(id: string) {
    const foods = await this.prisma.food.findMany({
      where: { userId: Number(id) }, //Todo: Number를 안쓰게 하는방법이 있을꺼같은데
    });
    return foods;
  }
}
