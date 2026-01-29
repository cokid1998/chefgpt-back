import { Module } from "@nestjs/common";
import { MyInfoController } from "src/myInfo/myInfo.controller";
import { MyinfoService } from "src/myInfo/myinfo.service";

@Module({
  providers: [MyinfoService],
  controllers: [MyInfoController],
})
export class MyInfoModule {}
