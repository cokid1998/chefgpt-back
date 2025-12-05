import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "src/user/user.module";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "src/prisma/prisma.module";
import { FoodModule } from './food/food.module';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, UserModule, PrismaModule, FoodModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
