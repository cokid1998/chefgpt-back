import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { VoteService } from "./vote.service";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { CreateVoteDto } from "src/vote/dto/vote.dto";
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
    return this.voteService.createVote();
  }
}
