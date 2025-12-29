import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  Res,
  UseGuards,
  Request,
} from "@nestjs/common";
import { ApiOperation, ApiBody } from "@nestjs/swagger";
import { AuthService } from "src/auth/auth.service";
import { SignupDto } from "src/auth/dto/signup.dto";
import { LocalAuthGuard } from "src/auth/guard/local-auth.guard";
import { Response } from "express";
import { AuthUser } from "src/auth/strategy/local.strategy";
import { KakaoService } from "src/auth/kakao/kakao.service";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly kakaoService: KakaoService
  ) {}

  @Post("login")
  @UsePipes(new ValidationPipe())
  @UseGuards(LocalAuthGuard)
  @ApiOperation({
    summary: "로그인 API",
  })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        email: {
          type: "string",
          example: "test@naver.com",
        },
        password: {
          type: "string",
          example: "1234",
        },
      },
      required: ["email", "password"],
    },
  })
  async login(
    @Request() req: Request & { user: AuthUser },
    @Res({ passthrough: true }) res: Response
  ) {
    const { profile, accessToken, refreshToken } = await this.authService.login(
      req.user
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // 개발환경: false, 배포: true
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      profile,
      accessToken,
    };
  }

  @Post("signup")
  @UsePipes(new ValidationPipe())
  @ApiOperation({
    summary: "회원가입",
  })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        email: {
          type: "string",
          example: "chef@naver.com",
        },
        password: {
          type: "string",
          example: "1q2w3e4r!",
        },
      },
      required: ["email", "password"],
    },
  })
  async signup(
    @Body() payload: SignupDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const { profile, accessToken, refreshToken } =
      await this.authService.signup(payload);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // 개발환경: false, 배포: true
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      profile,
      accessToken,
    };
  }

  @Post("/logout")
  @ApiOperation({
    summary: "로그아웃",
    description: "프론트 쿠키에 존재하는 리프레쉬 토큰 제거",
  })
  logOut(@Res() res: Response) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false, // 개발환경: false, 배포: true
      sameSite: "lax",
      path: "/",
    });

    return res.json({ success: true });
  }

  @Post("kakao")
  async kakaoLogin(
    @Body("code") code: string,
    @Res({ passthrough: true }) res: Response
  ) {
    const { profile, accessToken, refreshToken } =
      await this.kakaoService.kakaoLogin(code);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // 개발환경: false, 배포: true
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { profile, accessToken };
  }
}
