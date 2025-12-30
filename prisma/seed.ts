import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "prisma/generated/client";
import dayjs from "dayjs";

const pool = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: pool });

async function main() {
  await prisma.user.deleteMany();
  await prisma.food.deleteMany();
  await prisma.category.deleteMany();

  // 1. 유저 생성
  const user = await prisma.user.create({
    data: {
      email: "test@naver.com",
      password: "1234",
      nickname: "이태관",
      thumbnail: "",
      authProvider: "LOCAL",
    },
  });

  // 2. 카테고리 생성
  const categories = await Promise.all([
    prisma.category.create({ data: { name: "채소" } }),
    prisma.category.create({ data: { name: "육류" } }),
    prisma.category.create({ data: { name: "유제품" } }),
    prisma.category.create({ data: { name: "해산물" } }),
    prisma.category.create({ data: { name: "과일" } }),
    prisma.category.create({ data: { name: "조미료" } }),
    prisma.category.create({ data: { name: "곡물" } }),
    prisma.category.create({ data: { name: "기타" } }),
  ]);

  const [채소, 육류, 유제품, 해산물, 과일, 조미료, 곡물, 기타] = categories;

  const now = dayjs();

  // 3. Food생성
  const foods = await prisma.food.createMany({
    data: [
      {
        name: "양배추",
        quantity: 1,
        unit: "개",
        expiration_date: now.subtract(10, "day").toDate(), // 유통기한 만료
        memo: "",
        userId: user.id,
        categoryId: 채소.id,
        location: "COLD",
      },
      {
        name: "돼지고기",
        quantity: 500,
        unit: "g",
        location: "FROZEN",
        expiration_date: now.subtract(3, "day").toDate(), // 유통기한 임박
        memo: "",
        userId: user.id,
        categoryId: 육류.id,
      },
      {
        name: "우유",
        quantity: 500,
        unit: "L",
        location: "COLD",
        expiration_date: now.add(10, "day").toDate(), // 유통기한 남음
        memo: "",
        userId: user.id,
        categoryId: 유제품.id,
      },
      {
        name: "연어",
        quantity: 500,
        unit: "g",
        location: "COLD",
        expiration_date: now.add(20, "day").toDate(), // 유통기한 남음
        memo: "",
        userId: user.id,
        categoryId: 해산물.id,
      },
      {
        name: "키위",
        quantity: 500,
        unit: "대",
        location: "COLD",
        expiration_date: now.add(30, "day").toDate(), // 유통기한 남음
        memo: "",
        userId: user.id,
        categoryId: 과일.id,
      },
      {
        name: "후추",
        quantity: 1,
        unit: "병",
        location: "ROOM_TEMP",
        expiration_date: now.add(5, "day").toDate(), // 유통기한 임박
        memo: "",
        userId: user.id,
        categoryId: 조미료.id,
      },
      {
        name: "쌀",
        quantity: 1,
        unit: "kg",
        location: "ROOM_TEMP",
        expiration_date: now.subtract(7, "day").toDate(), // 유통기한 만료
        memo: "",
        userId: user.id,
        categoryId: 곡물.id,
      },
      {
        name: "라면",
        quantity: 6,
        unit: "개",
        location: "ROOM_TEMP",
        expiration_date: now.toDate(), // 유통기한 오늘까지
        memo: "안성탕면",
        userId: user.id,
        categoryId: 기타.id,
      },
    ],
  });

  const votes = await prisma.vote.createMany({
    data: [
      {
        title: "MSG 논란",
        description:
          "식품첨가물 MSG(글루탐산나트륨)은 몸에 나쁘다고 생각하시나요?",
        optionA: "그렇다",
        optionB: "아니다",
        startDate: now.subtract(7, "day").toDate(),
        endDate: now.subtract(3, "day").toDate(),
      },
      {
        title: "부먹 vs 찍먹",
        description:
          "탕수육은 소스를 부어 먹는 게 맞을까, 찍어 먹는 게 맞을까?",
        optionA: "부먹",
        optionB: "찍먹",
        startDate: now.toDate(),
        endDate: now.add(14, "day").toDate(),
      },
      {
        title: "파인애플 피자",
        description: "파인애플 피자는 사라져야한다",
        optionA: "그렇다",
        optionB: "아니다",
        startDate: now.subtract(3, "day").toDate(),
        endDate: now.add(10, "day").toDate(),
      },
      {
        title: "민트초코",
        description: "민트초코는 음식일까, 치약일까?",
        optionA: "치약",
        optionB: "음식",
        startDate: now.subtract(10, "day").toDate(),
        endDate: now.add(3, "day").toDate(),
      },
    ],
  });

  console.log("🌱Seed 데이터 생성 완료");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
