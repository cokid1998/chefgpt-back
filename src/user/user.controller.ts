import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { UpdateUserInfoDto } from "src/user/dto/user.dto";
import { UserService } from "src/user/user.service";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({
    summary: "유저정보 수정",
  })
  patchUserInfo(
    @Req() req: Request & { user: { userId: number; email: string } },
    @Body() payload: UpdateUserInfoDto,
  ) {
    const { userId } = req.user;
    // Todo: 이미지 파일을 어떤 순서로 처리할지 정해야함
    // 1. 프론트에서 storage에 저장하고 그 url을 서버로 보내는 방법
    // 2. 프론트에서 formdata를 서버에 보내고 서버에서 storage에 저장하고 프론트에 storage에 썸네일 url을 전달해주는 방법
    console.log(payload);
    return this.userService.patchUserInfo(userId);
  }
}
