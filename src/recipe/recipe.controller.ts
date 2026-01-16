import { Get, Controller, Query } from "@nestjs/common";
import { RecipeService } from "./recipe.service";

@Controller("recipe")
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Get()
  async getScript(@Query("youtubeUrl") url: string) {
    return this.recipeService.getScript(url);
  }
}
