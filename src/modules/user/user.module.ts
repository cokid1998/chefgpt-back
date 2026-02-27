import { Module } from "@nestjs/common";
import { UserService } from "src/modules/user/user.service";
import { UserController } from "src/modules/user/user.controller";

@Module({
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
