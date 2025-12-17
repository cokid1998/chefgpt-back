import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateFoodDto, PatchFoodDto } from "src/food/dto/food.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma } from "prisma/generated/client";

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

  async findAllFood(userId: number, category: string, search: string) {
    const where: Prisma.FoodWhereInput = { userId };

    if (category) {
      where.category = {
        name: category,
      };
    }

    if (search) {
      where.name = {
        contains: search,
        mode: "insensitive",
      };
    }

    const foods = await this.prisma.food.findMany({
      where,
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

  async count(userId: number) {
    const foods = await this.prisma.food.findMany({
      where: { userId },
    });

    const count = {
      total: foods.length,
      cold: foods.filter((food) => food.location === "COLD").length,
      frozen: foods.filter((food) => food.location === "FROZEN").length,
      roomTemp: foods.filter((food) => food.location === "ROOM_TEMP").length,
    };

    return count;
  }
}
