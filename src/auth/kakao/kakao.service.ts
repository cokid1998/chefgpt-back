import {
  HttpException,
  HttpStatus,
  Injectable,
  Redirect,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "src/prisma/prisma.service";
import type { KAKAOOauthRes, KAKAOUserRes } from "src/types/kakaologin";
import { userInfo } from "os";

@Injectable()
export class KakaoService {
  constructor(
    private readonly userService: UserService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService
  ) {}

  async kakaoLogin(code: string) {
    try {
      // 1. 프론트에서 가져온 code로 access_token받기
      const { accessToken, refreshToken } = await this.getAccessToken(code);
      // 2. access_token으로 사용자 정보 조회
      const userInfo = await this.getUserInfo(accessToken);

      // 3. DB에서 사용자 조회 또는 생성
      // Todo
      // 문제점: 초기 회원가입시 카카오에서 응답받은 id값을 초기이메일로 세팅해주고 있는데 ex) 1234523@temp.com
      // 이러면 서비스 도중 회원가입을 수정했을 때 existingUser로 회원가입을 해야하는 유저인지 아닌지 분기처리를 할 수 없게됨

      // Todo: schema 변동 필요
      // const existingUser = await this.prisma.user.findOrCreateUser({});

      // 4. JWT 토큰 발급

      return {
        profile: userInfo, // Todo: 응답 타입을 변경시켜줘야함, 기본 이메일, 비밀번호 로그인과 타입을 같이 일치시켜줘야함
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
        email: `${res.data.id}@temp.com`, // 사용자의 이메일 데이터는 biz앱으로 전환해야 수집할 수 있어서 임시 이메일을 초기에 설정
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
