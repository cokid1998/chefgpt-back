import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "src/modules/auth/auth.module";
import { UserModule } from "src/modules/user/user.module";
import { PrismaModule } from "src/prisma/prisma.module";
import { FoodModule } from "src/modules/food/food.module";
import { VoteModule } from "src/modules/vote/vote.module";
import { ArticleModule } from "src/modules/article/article.module";
import { RecipeModule } from "src/modules/recipe/recipe.module";
import { MyInfoModule } from "src/modules/myInfo/myInfo.module";

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
    MyInfoModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
