import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "prisma/generated/client";

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
    },
  });

  // 2. 카테고리 생성
  const categories = await Promise.all([
    prisma.category.create({ data: { name: "채소" } }),
    prisma.category.create({ data: { name: "과일" } }),
    prisma.category.create({ data: { name: "육류" } }),
    prisma.category.create({ data: { name: "해산물" } }),
    prisma.category.create({ data: { name: "유제품" } }),
    prisma.category.create({ data: { name: "곡물" } }),
    prisma.category.create({ data: { name: "조미료" } }),
    prisma.category.create({ data: { name: "기타" } }),
  ]);

  const [채소, 과일, 육류, 해산물, 유제품, 곡물, 조미료, 기타] = categories;

  // 3. Food생성
  const foods = await prisma.food.createMany({
    data: [
      {
        name: "양배추",
        quantity: 1,
        unit: "개",
        expiration_date: new Date(),
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
        expiration_date: new Date(),
        memo: "",
        userId: user.id,
        categoryId: 육류.id,
      },
      {
        name: "우유",
        quantity: 500,
        unit: "L",
        location: "COLD",
        expiration_date: new Date(),
        memo: "",
        userId: user.id,
        categoryId: 유제품.id,
      },
      {
        name: "계란",
        quantity: 500,
        unit: "개",
        location: "COLD",
        expiration_date: new Date(),
        memo: "",
        userId: user.id,
        categoryId: 기타.id,
      },
      {
        name: "대파",
        quantity: 500,
        unit: "대",
        location: "COLD",
        expiration_date: new Date(),
        memo: "",
        userId: user.id,
        categoryId: 채소.id,
      },
      {
        name: "식용유",
        quantity: 1,
        unit: "병",
        location: "ROOM_TEMP",
        expiration_date: new Date(),
        memo: "카놀라유",
        userId: user.id,
        categoryId: 기타.id,
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
