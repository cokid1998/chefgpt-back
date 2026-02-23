import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "prisma/generated/client";
import dayjs from "dayjs";
import bcrypt from "bcrypt";

const pool = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: pool });

async function main() {
  const hashedPassword = await bcrypt.hash("1234", 10);

  // 1. 유저 생성
  const user = await prisma.user.create({
    data: {
      email: "test@naver.com",
      password: hashedPassword,
      nickname: "이태관",
      thumbnail: "",
      authProvider: "LOCAL",
      refreshToken: null,
    },
  });

  // 2. 카테고리 생성
  const categories = await Promise.all([
    prisma.food_Category.create({ data: { name: "채소" } }),
    prisma.food_Category.create({ data: { name: "육류" } }),
    prisma.food_Category.create({ data: { name: "유제품" } }),
    prisma.food_Category.create({ data: { name: "해산물" } }),
    prisma.food_Category.create({ data: { name: "과일" } }),
    prisma.food_Category.create({ data: { name: "조미료" } }),
    prisma.food_Category.create({ data: { name: "곡물" } }),
    prisma.food_Category.create({ data: { name: "기타" } }),
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

  // 6. Article생성 (태그포함)
  const articles = await Promise.all([
    prisma.article.create({
      data: {
        title: "갈색설탕과 흰설탕의 차이점",
        summary: "두 설탕의 성분, 맛, 용도 비교",
        contentJSON: `{"type":"doc","content":[{"type":"heading","attrs":{"level":1},"content":[{"type":"text","text":"갈색설탕은 설탕에 몰래세스(당밀)를 섞은 것으로 더 습하고 부드러운 맛이 특징입니다."}]},{"type":"paragraph"},{"type":"paragraph","content":[{"type":"text","marks":[{"type":"bold"}],"text":"흰설탕은 정제도가 높아 깔끔한 단맛을 냅니다."}]},{"type":"paragraph"},{"type":"paragraph","content":[{"type":"text","marks":[{"type":"underline"}],"text":"쿠키나 브라우니 같은 텍스처가 중요한 베이킹에는 갈색설탕이, 음료나 세밀한 맛조절이 필요한 요리에는 흰설탕이 좋습니다."}]}]}`,
        categoryId: 재료정보.id,
        readingTime: 1,
        viewCount: 0,
        articleTagRelations: {
          create: [
            {
              tag: {
                connectOrCreate: {
                  where: { name: "설탕" },
                  create: { name: "설탕" },
                },
              },
            },
            {
              tag: {
                connectOrCreate: {
                  where: { name: "베이킹" },
                  create: { name: "베이킹" },
                },
              },
            },
          ],
        },
      },
    }),
    prisma.article.create({
      data: {
        title: "계란 계란말이를 완벽하게 만드는 법",
        summary: "계란말이의 기본 조리법과 팁",
        contentJSON: `{"type":"doc","content":[{"type":"heading","attrs":{"level":3},"content":[{"type":"text","text":"계란말이를 만들 때는 약불에서 천천히 구워야 계란이 골고루 익습니다."}]},{"type":"paragraph"},{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"계란을 미리 풀어서 체에 내려 부드러운 식감을 낼 수 있습니다."}]}]}]},{"type":"paragraph"}]}`,
        categoryId: 조리팁.id,
        readingTime: 1,
        viewCount: 1,
        articleTagRelations: {
          create: [
            {
              tag: {
                connectOrCreate: {
                  where: { name: "계란" },
                  create: { name: "계란" },
                },
              },
            },
            {
              tag: {
                connectOrCreate: {
                  where: { name: "요리팁" },
                  create: { name: "요리팁" },
                },
              },
            },
          ],
        },
      },
    }),
    prisma.article.create({
      data: {
        title: "시금치의 영양가와 일일 섭취량",
        summary: "시금치의 영양소 분석",
        contentJSON: `{"type":"doc","content":[{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"시금치는 철분, 칼슘, 비타민 A가 풍부합니다."}]},{"type":"paragraph"},{"type":"orderedList","attrs":{"start":1,"type":null},"content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"하루 권장 섭취량은 약 80g이며, 날것으로 섭취하면 영양가가 더 잘 보존됩니다."}]}]}]},{"type":"paragraph"}]}`,
        categoryId: 영양정보.id,
        readingTime: 1,
        viewCount: 2,
        articleTagRelations: {
          create: [
            {
              tag: {
                connectOrCreate: {
                  where: { name: "시금치" },
                  create: { name: "시금치" },
                },
              },
            },
            {
              tag: {
                connectOrCreate: {
                  where: { name: "영양정보" },
                  create: { name: "영양정보" },
                },
              },
            },
          ],
        },
      },
    }),
    prisma.article.create({
      data: {
        title: "올리브유 보관 방법",
        summary: "올리브유의 올바른 보관법과 품질 유지",
        contentJSON: `{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","marks":[{"type":"italic"}],"text":"올리브유는 빛과 열에 약하므로 어두운 색의 병에 담겨 있는 제품을 선택해야 합니다."}]},{"type":"paragraph"},{"type":"paragraph","content":[{"type":"text","marks":[{"type":"bold"}],"text":"냉장고나 서늘한 실온(15-20°C)에서 보관하세요."}]},{"type":"paragraph"},{"type":"paragraph","content":[{"type":"text","marks":[{"type":"bold"},{"type":"italic"},{"type":"strike"},{"type":"underline"}],"text":"개봉 후에는 3개월 이내에 사용하는 것이 좋습니다. 직사광선이 드는 곳이나 가스레인지 근처는 피하세요."}]}]}`,
        categoryId: 식품보관.id,
        readingTime: 1,
        viewCount: 3,
        articleTagRelations: {
          create: [
            {
              tag: {
                connectOrCreate: {
                  where: { name: "올리브유" },
                  create: { name: "올리브유" },
                },
              },
            },
            {
              tag: {
                connectOrCreate: {
                  where: { name: "보관방법" },
                  create: { name: "보관방법" },
                },
              },
            },
          ],
        },
      },
    }),
    prisma.article.create({
      data: {
        title: "칼 관리와 날 세우기",
        summary: "주방칼의 유지보수와 날카로움 유지법",
        contentJSON: `{"type":"doc","content":[{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"칼의 날을 유지하려면 정기적으로 숫돌에 갈아야 합니다."}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"일주일에 1-2회 스틸 막대(honing steel)로 문질러 날을 정렬하고, 3-6개월마다 숫돌에 갈아 예리함을 되살리세요."}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"사용 후에는 따뜻한 물로 세척하고 바로 건조하여 녹이 슬지 않도록 주의하세요."}]}]}]},{"type":"paragraph"}]}`,
        categoryId: 주방도구.id,
        readingTime: 1,
        viewCount: 4,
        articleTagRelations: {
          create: [
            {
              tag: {
                connectOrCreate: {
                  where: { name: "칼" },
                  create: { name: "칼" },
                },
              },
            },
            {
              tag: {
                connectOrCreate: {
                  where: { name: "주방도구" },
                  create: { name: "주방도구" },
                },
              },
            },
          ],
        },
      },
    }),
    prisma.article.create({
      data: {
        title: "겨울철 식재료 보관 가이드",
        summary: "계절별 보관 방법",
        contentJSON: `{"type":"doc","content":[{"type":"heading","attrs":{"level":1},"content":[{"type":"text","text":"겨울철에는 실온에서 보관할 수 있는 식재료가 많습니다. 감자, 양파, 마늘은 서늘하고 통풍이 잘 되는 곳에 보관하면 오래갑니다."}]},{"type":"paragraph"}]}`,
        categoryId: 아티클기타.id,
        readingTime: 1,
        viewCount: 5,
        articleTagRelations: {
          create: [
            {
              tag: {
                connectOrCreate: {
                  where: { name: "겨울철" },
                  create: { name: "겨울철" },
                },
              },
            },
            {
              tag: {
                connectOrCreate: {
                  where: { name: "보관" },
                  create: { name: "보관" },
                },
              },
            },
          ],
        },
      },
    }),
  ]);

  // 7. Recipe_Category생성
  const recipeCategory = await Promise.all([
    prisma.recipe_Category.create({ data: { name: "한식" } }),
    prisma.recipe_Category.create({ data: { name: "양식" } }),
    prisma.recipe_Category.create({ data: { name: "중식" } }),
    prisma.recipe_Category.create({ data: { name: "일식" } }),
    prisma.recipe_Category.create({ data: { name: "디저트" } }),
    prisma.recipe_Category.create({ data: { name: "음료" } }),
    prisma.recipe_Category.create({ data: { name: "기타" } }),
  ]);

  const [한식, 양식, 중식, 일식, 디저트, 음료, 레시피기타] = recipeCategory;

  // 8. Recipe생성
  const recipe = await Promise.all([
    prisma.recipe.create({
      data: {
        userId: user.id,
        categoryId: 한식.id,
        title: "김치찌개",
        description: "얼큰하고 시원한 국물 맛이 일품인 김치찌개입니다.",
        cookingTime: "30분",
        thumbnailUrl: "",
        recipeType: "MANUAL",

        recipeIngredients: {
          create: [
            { name: "배추김치", amount: "300g" },
            { name: "돼지고기", amount: "200g" },
            { name: "두부", amount: "1모" },
            { name: "대파", amount: "1대" },
            { name: "양파", amount: "1/2개" },
            { name: "고춧가루", amount: "1큰술" },
            { name: "다진 마늘", amount: "1큰술" },
            { name: "설탕", amount: "1작은술" },
            { name: "참기름", amount: "약간" },
          ],
        },

        recipeSteps: {
          create: [
            {
              stepNumber: 1,
              stepTitle: "재료 준비",
              description:
                "김치는 한입 크기로 썰고, 돼지고기도 먹기 좋은 크기로 썰어주세요. 두부는 깍둑썰기하고, 대파와 양파는 채썰어주세요.",
              tip: "신김치를 사용하면 더 깊은 맛이 나요.",
            },
            {
              stepNumber: 2,
              stepTitle: "김치 볶기",
              description:
                "냄비에 참기름을 두르고 김치와 돼지고기를 중불에서 3-5분간 볶아주세요. 고춧가루와 다진 마늘을 넣고 함께 볶아주세요.",
              tip: "김치를 충분히 볶아야 누린내가 없어져요.",
            },
            {
              stepNumber: 3,
              stepTitle: "물 넣고 끓이기",
              description:
                "물을 재료가 잠길 정도로 붓고 강불에서 끓여주₩세요. 끓어오르면 중약불로 줄이고 10분간 더 끓여주세요.",
              tip: "물의 양은 김치의 간에 따라 조절해주세요",
            },
            {
              stepNumber: 4,
              stepTitle: "두부와 야채 추가",
              description:
                "두부, 양파, 대파를 넣고 5분간 더 끓여주세요. 설탕으로 간을 맞춰주세요.",
              tip: "두부는 너무 일찍 넣으면 부서지니 마지막에 넣어주세요.",
            },
            {
              stepNumber: 5,
              stepTitle: "완성",
              description: "불을 끄고 그릇에 담아 따뜻하게 드세요.",
              tip: "뜨거우니 화상을 조심하세요!",
            },
          ],
        },
      },
    }),
  ]);

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
