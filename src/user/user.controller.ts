import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { UserService } from "src/user/user.service";

@Controller("profile")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "유저정보",
  })
  findUserById(@Param("id") id: string) {
    return this.userService.findUserById(Number(id));
  }
}
