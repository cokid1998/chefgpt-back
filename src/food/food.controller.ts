import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { CreateFoodDto, PatchFoodDto } from "src/food/dto/food.dto";
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

  @Post()
  @UsePipes(new ValidationPipe())
  @ApiOperation({
    summary: "음식 추가",
  })
  createFood(@Body() payload: CreateFoodDto) {
    return this.foodService.createFood(payload);
  }

  @Patch(":id") // food의 아이디
  @UsePipes(new ValidationPipe())
  @ApiOperation({
    summary: "음식 수정",
  })
  patchFood(
    @Param("id", ParseIntPipe) id: number,
    @Body() payload: PatchFoodDto
  ) {
    return this.foodService.patchFood(id, payload);
  }

  @Get(":id") // 유저의 id
  @ApiOperation({
    summary: "유저가 저장한 음식들",
  })
  findFoodById(@Param("id") id: string) {
    return this.foodService.findFoodById(id);
  }
}
