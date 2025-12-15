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

  async createFood(userId: number, payload: CreateFoodDto) {
    const food = await this.prisma.food.create({
      data: {
        ...payload,
        userId,
      },
    });

    return food;
  }

  async patchFood(foodId: number, payload: PatchFoodDto) {
    const result = await this.prisma.food.update({
      where: { id: foodId },
      data: payload,
    });

    return result;
  }

  async findFoodById(userId: number) {
    const foods = await this.prisma.food.findMany({
      where: { userId },
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
