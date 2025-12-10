import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class FoodService {
  constructor(private readonly prisma: PrismaService) {}

  async findCategory() {
    const categories = await this.prisma.category.findMany();
    return categories;
  }

  async findFoodById(id: string) {
    const foods = await this.prisma.food.findMany({
      where: { userId: Number(id) }, //Todo: Number를 안쓰게 하는방법이 있을꺼같은데
      select: {
        id: true,
        name: true,
        location: true,
        quantity: true,
        unit: true,
        expiration_date: true,
        memo: true,
        category: true,
        // userId: false
        // categoryId: true,
      },
    });
    return foods;
  }
}
