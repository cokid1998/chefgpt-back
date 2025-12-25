import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { VoteService } from "./vote.service";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { CreateSubmitVoteDto, CreateVoteDto } from "src/vote/dto/vote.dto";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";

@Controller("vote")
export class VoteController {
  constructor(private readonly voteService: VoteService) {}

  @Get()
  @ApiOperation({
    summary: "투표 데이터",
  })
  findAllVote() {
    return this.voteService.findAllVote();
  }

  @Get("active")
  @ApiOperation({
    summary: "진행중인 투표",
  })
  findActiveVote() {
    return this.voteService.findActiveVote();
  }

  @Get("close")
  @ApiOperation({
    summary: "종료된 투표",
  })
  findCloseVote() {
    return this.voteService.findCloseVote();
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
    @Param("voteId", ParseIntPipe) voteId: string,
    @Req() req: Request & { user: { userId: number; email: string } },
    @Body() payload: CreateSubmitVoteDto
  ) {
    console.log("voteId", voteId);
    console.log("req", req.user);
    console.log("payload", payload);
  }
}
