import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Req,
  Query,
} from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
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
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @ApiOperation({
    summary: "음식 추가",
  })
  createFood(
    @Req() req: Request & { user: { userId: number; email: string } },
    @Body() payload: CreateFoodDto
  ) {
    const { userId, email } = req.user;
    return this.foodService.createFood(userId, payload);
  }

  @Patch(":foodId")
  @UsePipes(new ValidationPipe())
  @ApiOperation({
    summary: "음식 수정",
  })
  patchFood(
    @Param("foodId", ParseIntPipe) foodId: number,
    @Body() payload: PatchFoodDto
  ) {
    return this.foodService.patchFood(foodId, payload);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "유저가 저장한 모든 음식",
  })
  findAllFood(
    @Req() req: Request & { user: { userId: number; email: string } },
    @Query("category") category?: string,
    @Query("search") search?: string
  ) {
    const { userId, email: _ } = req.user;
    return this.foodService.findAllFood(userId, category, search);
  }

  @Get(":foodId")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "음식 단건 조회",
  })
  findOneFood(
    @Req() req: Request & { user: { userId: number; email: string } },
    @Param("foodId", ParseIntPipe) foodId: number
  ) {
    const { userId, email: _ } = req.user;

    return this.foodService.findOneFood(userId, foodId);
  }
}
