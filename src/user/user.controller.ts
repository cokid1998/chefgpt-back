import {
  Body,
  Controller,
  Patch,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiConsumes } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { UpdateUserInfoDto } from "src/user/dto/user.dto";
import { UserService } from "src/user/user.service";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("access-token")
  @UseInterceptors(FileInterceptor("thumbnailImageFile"))
  @ApiConsumes("multipart/form-data")
  @ApiOperation({
    summary: "유저정보 수정",
  })
  patchUserInfo(
    @Req() req: Request & { user: { userId: number; email: string } },
    @Body() payload: UpdateUserInfoDto,
    @UploadedFile() thumbnailImageFile?: Express.Multer.File,
  ) {
    const { userId } = req.user;
    // 1. 유저가 유효한지 체크
    // 2. supabase Storage에 썸네일 사진 저장
    // 3. 썸네일 사진 url DB에 저장

    return this.userService.patchUserInfo(userId, payload, thumbnailImageFile);
  }
}
