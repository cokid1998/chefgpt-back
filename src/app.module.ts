import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "src/user/user.module";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "src/prisma/prisma.module";
import { FoodModule } from "./food/food.module";
import { VoteModule } from "./vote/vote.module";
import { ArticleModule } from "./article/article.module";
import { RecipeModule } from "src/recipe/recipe.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    UserModule,
    PrismaModule,
    FoodModule,
    VoteModule,
    ArticleModule,
    RecipeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
