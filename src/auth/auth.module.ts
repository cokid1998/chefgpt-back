import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UserModule } from "src/user/user.module";
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "src/auth/strategy/local.strategy";
import { JwtStrategy } from "src/auth/strategy/jwt.strategy";
import { KakaoService } from "src/auth/kakao/kakao.service";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule, UserModule, PassportModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        global: true,
      }),
    }),
    UserModule,
    PassportModule,
    ConfigModule,
    HttpModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, KakaoService],
  exports: [AuthService],
})
export class AuthModule {}
