import { Module } from "@nestjs/common";
import { VoteService } from "src/modules/vote/vote.service";
import { VoteController } from "src/modules/vote/vote.controller";

@Module({
  controllers: [VoteController],
  providers: [VoteService],
})
export class VoteModule {}
