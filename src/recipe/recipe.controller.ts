import { Post, Get, Controller, Query } from "@nestjs/common";
import { RecipeService } from "./recipe.service";

@Controller("recipe")
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Get("youtube-script")
  async getYoutubeRecipeScript(@Query("youtubeUrl") url: string) {
    return this.recipeService.getYoutubeRecipeScript(url);
  }
  }
}
