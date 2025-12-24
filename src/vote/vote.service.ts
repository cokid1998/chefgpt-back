import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import dayjs from "dayjs";
import { CreateVoteDto } from "src/vote/dto/vote.dto";

@Injectable()
export class VoteService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllVote() {
    const votes = await this.prisma.vote.findMany();
    return votes;
  }

  async findActiveVote() {
    const now = dayjs();
    const activeVotes = await this.prisma.vote.findMany({
      where: {
        startDate: {
          lte: now.toDate(),
        },
        endDate: {
          gt: now.toDate(),
        },
      },
      include: {
        voteUsers: true,
      },
      orderBy: {
        endDate: "asc",
      },
    });

    return activeVotes;
  }

  async findCloseVote() {
    const now = dayjs();
    const closeVotes = await this.prisma.vote.findMany({
      where: {
        endDate: {
          lte: now.toDate(),
        },
      },
      include: {
        voteUsers: true,
      },
      orderBy: {
        endDate: "desc",
      },
    });

    return closeVotes;
  }

  async createVote(payload: CreateVoteDto) {
    const result = await this.prisma.vote.create({
      data: {
        ...payload,
      },
    });

    return result;
  }

  async countVote() {
    const now = dayjs().toDate();

    const [totalVoteCount, activeVoteCount, totalParticipants] =
      await Promise.all([
        // 총 투표 개수
        this.prisma.vote.count(),
        // 진행중인 투표 개수
        this.prisma.vote.count({
          where: { startDate: { lte: now }, endDate: { gt: now } },
        }),
        // 모든 투표에 투표한 인원수 (중복제거)
        this.prisma.vote_User.findMany({
          select: { userId: true },
          distinct: ["userId"],
        }),
      ]);

    return {
      totalVoteCount,
      activeVoteCount,
      totalParticipants: totalParticipants.length,
    };
  }
}
