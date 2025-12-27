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
import { VoteService } from "./vote.service";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { CreateSubmitVoteDto, CreateVoteDto } from "src/vote/dto/vote.dto";
import {
  JwtAuthGuard,
  OptionalJwtAuthGuard,
} from "src/auth/guard/jwt-auth.guard";

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
    @Query("status", new DefaultValuePipe("active")) status: "active" | "close",
    @Req() req: Request & { user: { userId: number; email: string } }
  ) {
    const userId = req.user?.userId ?? null;
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
    @Param("voteId", ParseIntPipe) voteId: number,
    @Req() req: Request & { user: { userId: number; email: string } },
    @Body() payload: CreateSubmitVoteDto
  ) {
    return this.voteService.submitVote(voteId, req.user.userId, payload);
  }
}
