import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

interface LoginDto {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(payload: LoginDto) {
    const data = { sub: 1, email: payload.email };
    return {
      access_token: await this.jwtService.signAsync(data),
    };
  }
}
