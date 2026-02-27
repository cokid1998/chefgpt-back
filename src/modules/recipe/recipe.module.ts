import { Module } from "@nestjs/common";
import { RecipeController } from "src/modules/recipe/recipe.controller";
import { RecipeService } from "src/modules/recipe/recipe.service";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [HttpModule],
  controllers: [RecipeController],
  providers: [RecipeService],
})
export class RecipeModule {}
