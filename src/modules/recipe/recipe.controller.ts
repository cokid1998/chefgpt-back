import {
  Get,
  Patch,
  Controller,
  Query,
  Post,
  UseGuards,
  Body,
  UseInterceptors,
  UploadedFile,
  Param,
  ParseIntPipe,
} from "@nestjs/common";
import { RecipeService } from "src/modules/recipe/recipe.service";
import { JwtAuthGuard } from "src/modules/auth/guard/jwt-auth.guard";
import { ApiBearerAuth, ApiConsumes, ApiOperation } from "@nestjs/swagger";
import { CreateRecipeDto } from "src/modules/recipe/dto/recipe.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { OptionalJwtAuthGuard } from "src/modules/auth/guard/jwt-auth.guard";
import {
  CurrentUser,
  JWTUser,
} from "src/common/decorators/current-user.decorator";

@Controller("recipe")
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Get("youtube-script")
  async getYoutubeRecipeScript(@Query("youtubeUrl") url: string) {
    return this.recipeService.getYoutubeRecipeScript(url);
  }

  @Get("")
  @UseGuards(OptionalJwtAuthGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({
    summary: "레시피 목록",
  })
  async getRecipe(
    @CurrentUser() user: JWTUser,
    @Query("categoryId") categoryId?: string,
    @Query("search") search?: string,
  ) {
    const userId = user?.userId;
    return this.recipeService.getRecipe(Number(categoryId), search, userId);
  }

  @Get("my")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({
    summary: "내 레시피 목록",
  })
  async getMyRecipe(@CurrentUser() user: JWTUser) {
    const { userId, email: _ } = user;

    return this.recipeService.getMyRecipe(userId);
  }

  @Get("liked")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({
    summary: "좋아요 누른 레시피 리스트",
  })
  async getLikedRecipe(@CurrentUser() user: JWTUser) {
    const { userId, email: _ } = user;
    return this.recipeService.getLikedRecipe(userId);
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
    @CurrentUser() user: JWTUser,
    @Body() payload: CreateRecipeDto,
    @UploadedFile() thumbnailImageFile?: Express.Multer.File,
    @Query("youtubeUrl") youtubeUrl?: string,
  ) {
    const { userId, email: _ } = user;

    return this.recipeService.createRecipe(
      userId,
      payload,
      thumbnailImageFile,
      youtubeUrl,
    );
  }

  @Post("chatbot")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "쳇봇을 이용한 레시피 생성" })
  async chatbot(@Body() payload: { message: string }) {
    const { message } = payload;
    return this.recipeService.chatbot(message);
  }

  @Patch(":recipeId")
  @ApiOperation({
    summary: "레시피 조회수 증가",
  })
  async incrementViewCount(@Param("recipeId", ParseIntPipe) recipeId: number) {
    return this.recipeService.incrementViewCount(recipeId);
  }

  @Get(":recipeId")
  @UseGuards(OptionalJwtAuthGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({
    summary: "recipeId에 해당하는 레시피",
  })
  async findOneRecipe(
    @CurrentUser() user: JWTUser,
    @Param("recipeId", ParseIntPipe) recipeId: number,
  ) {
    const userId = user?.userId;
    return this.recipeService.findOneRecipe(recipeId, userId);
  }

  @Post("/like/:recipeId")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "레시피 좋아요 토글" })
  async toggleRecipeLike(
    @Param("recipeId", ParseIntPipe) recipeId: number,
    @CurrentUser() user: JWTUser,
  ) {
    const { userId, email: _ } = user;
    return this.recipeService.toggleRecipeLike(recipeId, userId);
  }
}
