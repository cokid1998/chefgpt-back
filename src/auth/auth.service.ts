import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { SignupDto } from "src/auth/dto/signup.dto";
import { UserService } from "src/user/user.service";
import { AuthUser } from "src/auth/strategy/local.strategy";
import bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly userService: UserService
  ) {}

  async login(user: AuthUser) {
    const tokenMeta = {
      sub: user.id,
      email: user.email,
    };

    const accessToken = await this.jwtService.signAsync(tokenMeta);
    const refreshToken = await this.jwtService.signAsync(tokenMeta, {
      expiresIn: "7d",
    });
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: hashedRefreshToken },
    });

    return {
      profile: user,
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
        authProvider: "LOCAL",
      },
    });

    const tokenMeta = { sub: newUser.id, email: payload.email };
    const accessToken = await this.jwtService.signAsync(tokenMeta);
    const refreshToken = await this.jwtService.signAsync(tokenMeta, {
      expiresIn: "7d",
    });
    const { password: _, ...safeUser } = newUser;

    return { profile: safeUser, accessToken, refreshToken }; // Todo: 토큰반환해서 프론트에서 회원가입 완료되면 바로 로그인상태로 변경하도록
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.findUserByEmail(email);

    if (!user) {
      throw new BadRequestException("존재하지 않는 회원입니다.");
    }

    if (user.password !== password) {
      throw new BadRequestException("비밀번호를 확인해주세요");
    }

    const { password: _, ...safeUser } = user;

    return safeUser;
  }

  // accessToken 갱신
  async refreshAccessToken(refreshToken: string) {
    // 1. JWT 검증
    const payload = await this.jwtService.verifyAsync(refreshToken, {
      secret: process.env.JWT_SECRET,
    });

    // 2. DB에서 사용자 조회
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    // 3. refeshToken 비교
    const isValid = await bcrypt.compare(refreshToken, user.refreshToken);

    if (!isValid) {
      throw new UnauthorizedException("유효하지않은 refeshToken");
    }

    // 4. 새로운 access Token 생성
    const newAccessToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
      },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: "1m",
      }
    );

    const { password, refreshToken: _, ...safeUser } = user;

    return {
      accessToken: newAccessToken,
      profile: safeUser,
    };
  }
}
