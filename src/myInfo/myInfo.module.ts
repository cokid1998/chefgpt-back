import { Module } from "@nestjs/common";
import { MyInfoController } from "src/myInfo/myInfo.controller";
import { MyInfoService } from "src/myInfo/myInfo.service";

@Module({
  providers: [MyInfoService],
  controllers: [MyInfoController],
})
export class MyInfoModule {}
