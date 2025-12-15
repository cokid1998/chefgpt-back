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
import { ApiOperation } from "@nestjs/swagger";
import { AuthService } from "src/auth/auth.service";
import { SignupDto } from "src/auth/dto/signup.dto";
import { LocalAuthGuard } from "src/auth/guard/local-auth.guard";
import { Response } from "express";
import { AuthUser } from "src/auth/local.strategy";

// 1. 프론트에서 로그인 버튼을 누름
// 2. "/auth/ligin"경로로 요청이 들어옴
// 3. 백엔드에서 검증 (아직 구현 X)
// 4. JWT를 응답
// 5. 백엔드 Guards가 JWT검증 (아직 구현 X)
// 6. 권한 인증 후 Controller실행 (아직 구현 X)

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @UsePipes(new ValidationPipe())
  @UseGuards(LocalAuthGuard)
  @ApiOperation({
    summary: "로그인 API",
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
  async signup(@Body() payload: SignupDto, @Res() res: Response) {
    const { profile, accessToken, refreshToken } =
      await this.authService.signup(payload);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // 개발환경: false, 배포: true
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ profile, accessToken });
  }

  @Post("/logout")
  @ApiOperation({
    summary: "로그아웃",
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
}
