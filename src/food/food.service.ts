import { Injectable, NotFoundException } from "@nestjs/common";
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

  async findAllFood(userId: number) {
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

  async findOneFood(userId: number, foodId: number) {
    const food = await this.prisma.food.findFirst({
      where: {
        id: foodId,
        userId,
      },
      select: {
        id: true,
        name: true,
        location: true,
        quantity: true,
        unit: true,
        expiration_date: true,
        memo: true,
        category: true,
      },
    });

    if (!food) {
      throw new NotFoundException("음식을 찾을 수 없습니다.");
    }

    return food;
  }
}
