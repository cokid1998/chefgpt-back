import { Module } from "@nestjs/common";
import { MyInfoController } from "src/modules/myInfo/myInfo.controller";
import { MyInfoService } from "src/modules/myInfo/myInfo.service";

@Module({
  providers: [MyInfoService],
  controllers: [MyInfoController],
})
export class MyInfoModule {}
