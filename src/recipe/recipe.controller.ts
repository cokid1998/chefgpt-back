import {
  Get,
  Controller,
  Query,
  Post,
  UseGuards,
  Req,
  UsePipes,
  ValidationPipe,
  Body,
} from "@nestjs/common";
import { RecipeService } from "./recipe.service";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { CreateRecipeDto } from "src/recipe/dto/recipe.dto";

@Controller("recipe")
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Get("youtube-script")
  async getYoutubeRecipeScript(@Query("youtubeUrl") url: string) {
    return this.recipeService.getYoutubeRecipeScript(url);
  }

  @Get("")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({
    summary: "내 레시피 목록",
  })
  async getMyRecipe(
    @Req() req: Request & { user: { userId: number; email: string } },
  ) {
    const { userId, email: _ } = req.user;

    return this.recipeService.getMyRecipe(userId);
  }

  @Get("category")
  @ApiOperation({
    summary: "레시피 카테고리",
  })
  async getRecipeCategory() {
    return this.recipeService.getRecipeCategory();
  }

  @Post("")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("access-token")
  @UsePipes(new ValidationPipe())
  @ApiOperation({
    summary: "레시피 생성",
  })
  async createRecipe(
    @Req() req: Request & { user: { userId: number; email: string } },
    @Body() payload: CreateRecipeDto,
  ) {
    const { userId } = req.user;

    return this.recipeService.createRecipe(userId, payload);
  }

  @Get(":recipeId")
  @ApiOperation({
    summary: "recipeId에 해당하는 레시피",
  })
  async findOneRecipe(recipeId: number) {
    return this.recipeService.findOneRecipe(recipeId);
  }
}
