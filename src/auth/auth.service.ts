import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { SignupDto } from "src/auth/dto/signup.dto";
import { LoginDto } from "src/auth/dto/login.dto";
import { UserService } from "src/user/user.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly userService: UserService
  ) {}

  async login(payload: LoginDto) {
    // DB에 접근해서 이메일 탐색 후 있는 회원인지 탐색
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: payload.email,
      },
    });
    // 없으면 에러 반환
    if (!existingUser) {
      throw new BadRequestException("존재하지 않는 회원입니다.");
    }
    const tokenMeta = { sub: existingUser.id, email: payload.email };
    const accessToken = await this.jwtService.signAsync(tokenMeta);
    const refreshToken = await this.jwtService.signAsync(tokenMeta, {
      expiresIn: "7d",
    });

    const { password, ...removePasswordUser } = existingUser;

    return {
      profile: removePasswordUser,
      accessToken,
      refreshToken,
    };
  }

  async signup(payload: SignupDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: payload.email,
      },
    });
    // 이메일 중복확인
    if (existingUser) {
      throw new BadRequestException("이미 가입된 이메일 입니다.");
    }
    // db에 추가
    const newUser = await this.prisma.user.create({
      data: {
        email: payload.email,
        nickname: "test", // Todo: 랜덤닉네임
        thumbnail: "",
        password: payload.password, // Todo: 암호화
      },
    });

    const tokenMeta = { sub: newUser.id, email: payload.email };
    const accessToken = await this.jwtService.signAsync(tokenMeta);
    const refreshToken = await this.jwtService.signAsync(tokenMeta, {
      expiresIn: "7d",
    });
    const { password, ...removePasswordUser } = existingUser;

    return { profile: removePasswordUser, accessToken, refreshToken }; // Todo: 토큰반환해서 프론트에서 회원가입 완료되면 바로 로그인상태로 변경하도록
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.findUserByEmail(email);

    if (!user) {
      throw new BadRequestException("존재하지 않는 회원입니다.");
    }

    if (user.password !== password) {
      throw new BadRequestException("비밀번호를 확인해주세요");
    }

    const { password: originPassword, ...removePassword } = user;

    return { profile: removePassword };
  }
}
