import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { VoteService } from "src/modules/vote/vote.service";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import {
  CreateSubmitVoteDto,
  CreateVoteDto,
} from "src/modules/vote/dto/vote.dto";
import {
  JwtAuthGuard,
  OptionalJwtAuthGuard,
} from "src/modules/auth/guard/jwt-auth.guard";
import {
  CurrentUser,
  JWTUser,
} from "src/common/decorators/current-user.decorator";

@Controller("vote")
export class VoteController {
  constructor(private readonly voteService: VoteService) {}

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({
    summary: "투표 데이터 (진행중, 종료)",
  })
  findVotes(
    @CurrentUser() user: JWTUser,
    @Query("status", new DefaultValuePipe("active")) status: "active" | "close",
  ) {
    const userId = user.userId ?? null;
    return this.voteService.findVotes(userId, status);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("access-token")
  @UsePipes(new ValidationPipe())
  @ApiOperation({
    summary: "투표 생성",
  })
  createVote(@Body() payload: CreateVoteDto) {
    return this.voteService.createVote(payload);
  }

  @Get("count")
  @ApiOperation({
    summary: "투표 개수",
  })
  countVote() {
    return this.voteService.countVote();
  }

  @Post(":voteId/submit")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("access-token")
  @UsePipes(new ValidationPipe())
  @ApiOperation({
    summary: "투표하기",
  })
  submitVote(
    @CurrentUser() user: JWTUser,
    @Param("voteId", ParseIntPipe) voteId: number,
    @Body() payload: CreateSubmitVoteDto,
  ) {
    const { userId, email: _ } = user;
    return this.voteService.submitVote(voteId, userId, payload);
  }
}
