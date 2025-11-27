import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { AuthService } from "src/auth/auth.service";
import { PrismaService } from "src/prisma/prisma.service";

// 1. 프론트에서 로그인 버튼을 누름
// 2. "/auth/ligin"경로로 요청이 들어옴
// 3. 백엔드에서 검증 (아직 구현 X)
// 4. JWT를 응답
// 5. 백엔드 Guards가 JWT검증 (아직 구현 X)
// 6. 권한 인증 후 Controller실행 (아직 구현 X)

interface LoginDto {
  email: string;
  password: string;
}

interface SignupDto {
  email: string;
  password: string;
}

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly prisma: PrismaService
  ) {}

  @Post("login")
  @ApiOperation({
    summary: "로그인 API",
  })
  login(@Body() payload: LoginDto) {
    return this.authService.login(payload);
  }

  @Post("signup")
  @ApiOperation({
    summary: "회원가입",
  })
  signup(@Body() payload: SignupDto) {
    return this.authService.signup(payload);
  }
}
