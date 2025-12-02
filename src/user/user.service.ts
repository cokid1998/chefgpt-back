import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { BadRequestException } from "@nestjs/common";

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!user) {
      throw new BadRequestException("해당 유저를 찾을 수 없습니다.");
    }

    const { password, ...removePasswordUser } = user;

    return removePasswordUser;
  }
}
