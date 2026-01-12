import {
  HttpException,
  HttpStatus,
  Injectable,
  Redirect,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "src/prisma/prisma.service";
import type { KAKAOOauthRes, KAKAOUserRes } from "src/types/kakaologin";
import {
  ACCESS_TOKEN_EXPIRE,
  REFRESH_TOKEN_EXPIRE,
} from "src/constants/tokenOption";

@Injectable()
export class KakaoService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  async kakaoLogin(code: string) {
    try {
      // 1. 프론트에서 가져온 code로 카카오사용자 정보 조회에 필요한 access_token받기
      const { accessToken: KakaoAccessToken } = await this.getAccessToken(code);

      // 2. access_token으로 카카오 사용자 정보 조회
      const userInfo = await this.getUserInfo(KakaoAccessToken);

      // 3. DB에서 사용자 조회 또는 생성
      const existingUser = await this.prisma.user.findUnique({
        where: { email: userInfo.email },
      });

      // 4. JWT 토큰 발급
      // DB에 이메일이 없는 경우 즉 신규 카카오 회원가입인 유저
      if (!existingUser) {
        const newUser = await this.prisma.user.create({
          data: {
            email: userInfo.email,
            nickname: userInfo.nickname,
            thumbnail: userInfo.thumbnail,
            password: null,
            authProvider: "KAKAO",
          },
        });

        const tokenMeta = { sub: newUser.id, email: newUser.email };
        const accessToken = await this.jwtService.signAsync(tokenMeta, {
          expiresIn: ACCESS_TOKEN_EXPIRE,
          secret: process.env.JWT_ACCESS_SECRET,
        });
        const refreshToken = await this.jwtService.signAsync(tokenMeta, {
          expiresIn: REFRESH_TOKEN_EXPIRE,
          secret: process.env.JWT_REFRESH_SECRET,
        });

        const { password: _, ...safeUser } = newUser;

        return { profile: safeUser, accessToken, refreshToken };
      }

      const { password: _, ...safeUser } = existingUser;
      const tokenMeta = { sub: existingUser.id, email: existingUser.email };
      const accessToken = await this.jwtService.signAsync(tokenMeta, {
        expiresIn: ACCESS_TOKEN_EXPIRE,
        secret: process.env.JWT_ACCESS_SECRET,
      });
      const refreshToken = await this.jwtService.signAsync(tokenMeta, {
        expiresIn: REFRESH_TOKEN_EXPIRE,
        secret: process.env.JWT_REFRESH_SECRET,
      });

      // DB에 이메일이 있는 경우 즉 기존에 카카오 로그인한 전적이 있는 유저
      return {
        profile: safeUser, // Todo: 응답 타입을 변경시켜줘야함, 기본 이메일, 비밀번호 로그인과 타입을 같이 일치시켜줘야함
        accessToken,
        refreshToken,
      };
    } catch (error) {
      console.error("에러 상세:", error); // 실제 에러 메시지 확인
      throw new HttpException("카카오 로그인 실패", HttpStatus.UNAUTHORIZED);
    }
  }

  // 카카오 OAuth 토큰 엔드포인트에 code, client_id, client_secret을 보내서 access_token 받기
  private async getAccessToken(code: string) {
    try {
      const res = await firstValueFrom(
        this.httpService.post<KAKAOOauthRes>(
          "https://kauth.kakao.com/oauth/token",
          null,
          {
            params: {
              grant_type: "authorization_code",
              client_id: this.configService.get("KAKAO_REST_API_KEY"),
              client_secret: this.configService.get("KAKAO_SECRET_KEY"),
              redirect_uri: this.configService.get("KAKAO_REDIRECT_URI"),
              code,
            },
            headers: {
              "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
            },
          }
        )
      );
      return {
        accessToken: res.data.access_token,
        refreshToken: res.data.refresh_token,
      };
    } catch (error) {
      console.error("카카오 API 에러:", error.response?.data || error.message); // 카카오 에러 메시지 출력

      throw new Error("카카오 로그인 엑세스 토큰 발급 실패");
    }
  }

  // accessToken을 이용해 카카오에서 사용자 정보 조회
  private async getUserInfo(accessToken: string) {
    try {
      const res = await firstValueFrom(
        this.httpService.get<KAKAOUserRes>(
          "https://kapi.kakao.com/v2/user/me",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
            },
          }
        )
      );
      const userInfo = {
        email: res.data.kakao_account.email,
        nickname: res.data.kakao_account.profile.nickname,
        thumbnail: res.data.kakao_account.profile.profile_image_url,
      };

      return userInfo;
    } catch (error) {
      console.error(
        "카카오 사용자 정보 조회 실패",
        error.response?.data || error.message
      );
      throw new Error("카카오 사용자 정보 조회 실패");
    }
  }
}
