import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import dayjs from "dayjs";
import { CreateSubmitVoteDto, CreateVoteDto } from "src/vote/dto/vote.dto";

@Injectable()
export class VoteService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllVote() {
    const votes = await this.prisma.vote.findMany();
    return votes;
  }

  async findActiveVote(userId: number | null) {
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

    const addSelectOptionsVotes = activeVotes.map((vote) => {
      const { voteUsers, ...voteWithoutUsers } = vote;

      return {
        ...voteWithoutUsers,
        selectedOptions: userId
          ? (voteUsers.find((v) => v.userId === userId)?.selectOption ?? null)
          : null,
      };
    });

    return addSelectOptionsVotes;
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
        // 모든 투표에 투표한 인원수
        this.prisma.vote_User.findMany({
          select: { userId: true },
          // distinct: ["userId"],
        }),
      ]);

    return {
      totalVoteCount,
      activeVoteCount,
      totalParticipants: totalParticipants.length,
    };
  }

  async submitVote(
    voteId: number,
    userId: number,
    payload: CreateSubmitVoteDto
  ) {
    // 이미 투표를 했는지 확인
    const existingVote = await this.prisma.vote_User.findUnique({
      where: {
        voteId_userId: {
          voteId,
          userId,
        },
      },
    });

    // 이미 투표를 했으면
    if (existingVote) {
      // 동일한 옵션으로 들어오는 요청은 에러처리
      if (existingVote.selectOption === payload.selectOption) {
        throw new Error("이미 선택한 옵션입니다.");
      }

      // 옵션 변경은 DB에 update 요청
      const result = await this.prisma.vote_User.update({
        where: {
          voteId_userId: {
            voteId,
            userId,
          },
        },
        data: {
          selectOption: payload.selectOption,
        },
      });

      return result;
    }

    const result = this.prisma.vote_User.create({
      data: {
        voteId,
        userId,
        selectOption: payload.selectOption,
      },
    });
    return result;
  }
}
