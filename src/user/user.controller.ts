import { Controller, Get, Param } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { UserService } from "src/user/user.service";

@Controller("profile")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(":id")
  @ApiOperation({
    summary: "유저정보",
  })
  findUserById(@Param("id") id: string) {
    return this.userService.findUserById(Number(id));
  }
}
