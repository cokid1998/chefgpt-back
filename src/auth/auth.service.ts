import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";

interface LoginDto {
  email: string;
  password: string;
}

interface SignupDto {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService
  ) {}

  async login(payload: LoginDto) {
    const data = { sub: 1, email: payload.email };
    return {
      access_token: await this.jwtService.signAsync(data),
    };
  }

  async signup(payload: SignupDto) {
    const existingUser = await this.prisma.users.findUnique({
      where: {
        email: payload.email,
      },
    });
    // 이메일 중복확인
    if (existingUser) {
      throw new BadRequestException("이미 가입된 이메일 입니다.");
    }
    // db에 추가
    const newUser = await this.prisma.users.create({
      data: {
        email: payload.email,
        name: "test", // Todo: 랜덤닉네임
        thumbnail: "",
        password: payload.password, // Todo: 암호화
      },
    });

    return newUser; // Todo: 토큰반환해서 프론트에서 회원가입 완료되면 바로 로그인상태로 변경하도록
  }
}
