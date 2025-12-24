import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import dayjs from "dayjs";

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

  async createVote() {}
}
