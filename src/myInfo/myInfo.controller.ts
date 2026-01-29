import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { MyInfoService } from "src/myInfo/myInfo.service";

@Controller("myinfo")
export class MyInfoController {
  constructor(private readonly MyinfoService: MyInfoService) {}

  @Get("count")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({
    summary:
      "내 정보 배너 데이터 개수 (내 레시피, 총 조회수, 총 좋아요, 참여한 투표)",
  })
  myInfoCount() {
    return this.MyinfoService.findMyInfoBannerData();
  }
}
