import { Controller, Get, Param } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { FoodService } from "src/food/food.service";

@Controller("food")
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Get("category")
  @ApiOperation({
    summary: "음식 카테고리",
  })
  findCategory() {
    return this.foodService.findCategory();
  }

  @Get(":id")
  @ApiOperation({
    summary: "유저가 저장한 음식들",
  })
  findFoodById(@Param("id") id: string) {
    return this.foodService.findFoodById(id);
  }
}
