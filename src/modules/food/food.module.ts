import { Module } from "@nestjs/common";
import { FoodController } from "src/modules/food/food.controller";
import { FoodService } from "src/modules/food/food.service";

@Module({
  providers: [FoodService],
  controllers: [FoodController],
})
export class FoodModule {}
