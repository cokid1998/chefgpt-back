import { Injectable } from "@nestjs/common";
import { CreateFoodDto, PatchFoodDto } from "src/food/dto/food.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class FoodService {
  constructor(private readonly prisma: PrismaService) {}

  async findCategory() {
    const categories = await this.prisma.category.findMany();
    return categories;
  }

  async createFood(payload: CreateFoodDto) {
    const food = await this.prisma.food.create({
      data: {
        ...payload,
        userId: 1, // Todo: Authorization header에서 userId를 추출하는 방식으로 변경 필요
      },
    });

    return food;
  }

  async patchFood(id: number, payload: PatchFoodDto) {
    const result = await this.prisma.food.update({
      where: { id },
      data: payload,
    });

    return result;
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
      orderBy: {
        expiration_date: "asc",
      },
    });
    return foods;
  }
}
