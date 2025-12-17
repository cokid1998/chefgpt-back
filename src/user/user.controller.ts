import { Controller, Get, Param, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { UserService } from "src/user/user.service";

@Controller("profile")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({
    summary: "유저정보",
  })
  getProfile(
    @Req() req: Request & { user: { userId: number; email: string } }
  ) {
    const { userId } = req.user;
    return this.userService.getProfile(userId);
  }
}
