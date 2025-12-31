import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "prisma/generated/client";
import dayjs from "dayjs";

const pool = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: pool });

async function main() {
  // await prisma.user.deleteMany();
  // await prisma.food.deleteMany();
  // await prisma.category.deleteMany();

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

  // 4. Vote생성
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

  // 5. Article_Category생성
  const articleCategory = await Promise.all([
    prisma.article_Category.create({ data: { name: "재료 정보" } }),
    prisma.article_Category.create({ data: { name: "조리 팁" } }),
    prisma.article_Category.create({ data: { name: "영양 정보" } }),
    prisma.article_Category.create({ data: { name: "식품 보관" } }),
    prisma.article_Category.create({ data: { name: "주방 도구" } }),
    prisma.article_Category.create({ data: { name: "기타" } }),
  ]);

  const [재료정보, 조리팁, 영양정보, 식품보관, 주방도구, 아티클기타] =
    articleCategory;

  // 6. Article생성
  const article = await prisma.article.createMany({
    data: [
      {
        title: "갈색설탕과 흰설탕의 차이점",
        summary: "두 설탕의 성분, 맛, 용도 비교",
        content:
          "<div>갈색설탕은 설탕에 몰래세스(당밀)를 섞은 것으로 더 습하고 부드러운 맛이 특징입니다. 흰설탕은 정제도가 높아 깔끔한 단맛을 냅니다. 쿠키나 브라우니 같은 텍스처가 중요한 베이킹에는 갈색설탕이, 음료나 세밀한 맛조절이 필요한 요리에는 흰설탕이 좋습니다.</div>",
        categoryId: 재료정보.id,
        readingTime: 1,
        viewCount: 0,
      },
      {
        title: "계란 계란말이를 완벽하게 만드는 법",
        summary: "계란말이의 기본 조리법과 팁",
        content:
          "<div>계란말이를 만들 때는 약불에서 천천히 구워야 계란이 골고루 익습니다. 계란을 미리 풀어서 체에 내려 부드러운 식감을 낼 수 있습니다.</div>",
        categoryId: 조리팁.id,
        readingTime: 1,
        viewCount: 1,
      },
      {
        title: "시금치의 영양가와 일일 섭취량",
        summary: "시금치의 영양소 분석",
        content:
          "<div>시금치는 철분, 칼슘, 비타민 A가 풍부합니다. 하루 권장 섭취량은 약 80g이며, 날것으로 섭취하면 영양가가 더 잘 보존됩니다.</div>",
        categoryId: 영양정보.id,
        readingTime: 1,
        viewCount: 2,
      },
      {
        title: "올리브유 보관 방법",
        summary: "올리브유의 올바른 보관법과 품질 유지",
        content:
          "<div>올리브유는 빛과 열에 약하므로 어두운 색의 병에 담겨 있는 제품을 선택해야 합니다. 냉장고나 서늘한 실온(15-20°C)에서 보관하세요. 개봉 후에는 3개월 이내에 사용하는 것이 좋습니다. 직사광선이 드는 곳이나 가스레인지 근처는 피하세요.</div>",
        categoryId: 식품보관.id,
        readingTime: 1,
        viewCount: 3,
      },
      {
        title: "칼 관리와 날 세우기",
        summary: "주방칼의 유지보수와 날카로움 유지법",
        content:
          "<div>칼의 날을 유지하려면 정기적으로 숫돌에 갈아야 합니다. 일주일에 1-2회 스틸 막대(honing steel)로 문질러 날을 정렬하고, 3-6개월마다 숫돌에 갈아 예리함을 되살리세요. 사용 후에는 따뜻한 물로 세척하고 바로 건조하여 녹이 슬지 않도록 주의하세요.</div>",
        categoryId: 주방도구.id,
        readingTime: 1,
        viewCount: 4,
      },
      {
        title: "겨울철 식재료 보관 가이드",
        summary: "계절별 보관 방법",
        content:
          "<div>겨울철에는 실온에서 보관할 수 있는 식재료가 많습니다. 감자, 양파, 마늘은 서늘하고 통풍이 잘 되는 곳에 보관하면 오래갑니다.</div>",
        categoryId: 아티클기타.id,
        readingTime: 1,
        viewCount: 5,
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
