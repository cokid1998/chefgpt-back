import { Module } from "@nestjs/common";
import { FoodController } from "src/food/food.controller";
import { FoodService } from "src/food/food.service";

@Module({
  providers: [FoodService],
  controllers: [FoodController],
})
export class FoodModule {}
