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
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { RecipeService } from "./recipe.service";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { ApiBearerAuth, ApiConsumes, ApiOperation } from "@nestjs/swagger";
import { CreateRecipeDto } from "src/recipe/dto/recipe.dto";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("recipe")
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Get("youtube-script")
  async getYoutubeRecipeScript(@Query("youtubeUrl") url: string) {
    return this.recipeService.getYoutubeRecipeScript(url);
  }

  @Get("my")
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
  @UseInterceptors(FileInterceptor("thumbnailImageFile"))
  @ApiConsumes("multipart/form-data")
  @ApiOperation({
    summary: "레시피 생성",
  })
  async createRecipe(
    @Req() req: Request & { user: { userId: number; email: string } },
    @Body() payload: CreateRecipeDto,
    @UploadedFile() thumbnailImageFile?: Express.Multer.File,
    @Query("youtubeUrl") youtubeUrl?: string,
  ) {
    const { userId } = req.user;

    return this.recipeService.createRecipe(
      userId,
      payload,
      thumbnailImageFile,
      youtubeUrl,
    );
  }

  @Get(":recipeId")
  @ApiOperation({
    summary: "recipeId에 해당하는 레시피",
  })
  async findOneRecipe(recipeId: number) {
    return this.recipeService.findOneRecipe(recipeId);
  }
}
