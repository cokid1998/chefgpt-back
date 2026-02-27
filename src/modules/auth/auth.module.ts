import { Module } from "@nestjs/common";
import { AuthController } from "src/modules/auth/auth.controller";
import { AuthService } from "src/modules/auth/auth.service";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UserModule } from "src/modules/user/user.module";
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "src/modules/auth/strategy/local.strategy";
import { JwtStrategy } from "src/modules/auth/strategy/jwt.strategy";
import { KakaoService } from "src/modules/auth/kakao/kakao.service";
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
