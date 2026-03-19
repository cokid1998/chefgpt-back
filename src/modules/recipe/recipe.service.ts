import { Injectable } from "@nestjs/common";
import OpenAI from "openai";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateRecipeDto } from "src/modules/recipe/dto/recipe.dto";
import { HttpService } from "@nestjs/axios";
import { BUCKET_NAME, supabase } from "src/supabase/supabase";
import { Prisma } from "prisma/generated/client";
import {
  getPaginationParams,
  getPaginationResult,
} from "src/common/util/pagination";
import { firstValueFrom } from "rxjs";

@Injectable()
export class RecipeService {
  private readonly openAI: OpenAI;

  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {
    this.openAI = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async getYoutubeRecipeScript(youtubeUrl: string) {
    const videoId = this.extractVideoId(youtubeUrl);

    try {
      const res = await firstValueFrom(
        this.httpService.get(
          `${process.env.YOUTUBE_TRANSCRIPT_SERVER}/transcript?id=${videoId}`,
        ),
      );

      const scriptSummary = await this.youtubeScriptSummaryFromOpenAI(
        res.data.full_text,
      );

      return scriptSummary;
    } catch (error) {
      console.log(error);
      throw new Error("유튜브 자막 추출 에러");
    }

    // return new Promise((resolve) => {
    //   setTimeout(() => {
    //     resolve({
    //       category: "양식",
    //       title: "스파게티 알리오 올리오",
    //       description:
    //         "이탈리아의 대표적인 파스타 요리로, 마늘과 올리브 오일을 활용한 간단하면서도 풍미 가득한 스파게티입니다. 빠르고 쉽게 만들 수 있어 바쁜 일상에도 적합한 메뉴입니다.",
    //       cookingTime: "20분",
    //       ingredients: [
    //         { name: "스파게티", amount: "200g" },
    //         { name: "마늘", amount: "5쪽" },
    //         { name: "올리브 오일", amount: "3큰술" },
    //         { name: "고추", amount: "1개" },
    //         { name: "파슬리", amount: "약간" },
    //         { name: "소금", amount: "적당량" },
    //         { name: "후추", amount: "적당량" },
    //       ],
    //       steps: [
    //         {
    //           stepNumber: 1,
    //           stepTitle: "양파 손질",
    //           description:
    //             "양파를 먹기 좋은 크기로 썰어 냄비 바닥에 골고루 깔아주세요.",
    //           tip: "양파를 먼저 깔아주면 재료가 눌어붙는 것을 방지할 수 있습니다.",
    //         },
    //         {
    //           stepNumber: 2,
    //           stepTitle: "두부 준비",
    //           description: "두부를 적당한 크기로 썰어 양파 위에 올려주세요.",
    //           tip: "두부는 너무 작게 썰면 끓이는 동안 부서질 수 있으니 조심하세요.",
    //         },
    //         {
    //           stepNumber: 3,
    //           stepTitle: "양념 끓이기",
    //           description:
    //             "물 400ml에 고춧가루, 다진 마늘, 진간장, 멸치액젓, 올리고당, 다시다를 넣고 약 5분간 끓여주세요.",
    //           tip: "끓이는 동안 국물이 넘치지 않도록 불 조절에 주의하세요.",
    //         },
    //         {
    //           stepNumber: 4,
    //           stepTitle: "마무리",
    //           description:
    //             "마지막으로 대파와 청양고추를 넣고 1~2분 정도 더 끓여 완성해 주세요.",
    //           tip: "청양고추를 넣을 때 매운 향이 올라올 수 있으니 얼굴을 가까이 대지 않도록 조심하세요.",
    //         },
    //       ],
    //     });
    //   }, 500);
    // });
  }

  async youtubeScriptSummaryFromOpenAI(scriptArray: string) {
    // 만약 요리관련 정보가 아니라면 에러를 던진다거나 해서 프론트에 알려줘야함
    const prompt = `
      너는 YouTube 요리 영상 자막을 분석하여
      사용자가 바로 활용할 수 있는 요리 레시피 데이터를
      구조화된 JSON 객체로 정리하는 도구다.

      [작업 목표]
      입력된 자막 배열에서 요리와 직접 관련된 정보만 추출하여
      아래의 레시피 JSON 구조에 정확히 맞게 출력해라.
      모든 문장은 요리 안내문처럼 자연스럽고 친절한 어투를 유지해야 한다.

      [출력 JSON 구조]
      {
        "category": string,
        "title": string,
        "description": string,
        "cookingTime": string,
        "ingredients": {
          "name": string,
          "amount": string
        }[],
        "steps": {
          "stepNumber": number,
          "stepTitle": string,
          "description": string,
          "tip": string
        }[]
      }

      ────────────────────────
      [공통 문체 규칙 — 매우 중요]
      ────────────────────────

      - 모든 문장은 사용자에게 설명하거나 안내하는 어투로 작성한다.
      - 문장은 반드시 다음과 같은 형태로 끝나야 한다.
        - "~해주세요."
        - "~넣어주세요."
        - "~조심하세요."
        - "~즐길 수 있습니다."
      - "~한다", "~함", "~하였다" 같은 설명체 문장은 사용하지 마라.
      - 한 문장이라도 설명체가 포함되면 잘못된 출력으로 간주한다.

      ────────────────────────
      [ingredients 작성 규칙 — 중요]
      ────────────────────────

      - ingredients는 요리에 사용되는 재료와 양만 포함한다.
      - 영상 자막에서 명확히 언급된 재료만 추출한다.
      - 자막에 등장하지 않은 재료는 절대 추가하지 마라.
      - 각 재료는 다음 구조를 따른다.

        {
          "name": "재료명",
          "amount": "양 또는 적당량"
        }

      - amount 규칙
        - 자막에 구체적인 수치가 있으면 그대로 작성한다.
          예: "200g", "3큰술", "5쪽"
        - 정확한 수치가 없으면 다음 표현만 허용한다.
          - "적당량"
          - "약간"
      - 조리 과정에서 반복 언급된 재료는 하나로 통합한다.
      - 양념과 기본 조미료도 요리에 사용되었다면 포함한다.

      ────────────────────────
      [steps.stepNumber 작성 규칙]
      ────────────────────────

      - 각 step에는 반드시 stepNumber를 포함해야 한다.
      - stepNumber는 조리 순서를 나타내는 숫자다.
      - 첫 번째 단계는 1, 두 번째 단계는 2, 세 번째는 3... 순서대로 부여한다.
      - stepNumber는 반드시 1부터 시작하여 순차적으로 증가해야 한다.

      ────────────────────────
      [steps.tip 작성 규칙 — 최우선]
      ────────────────────────

      - 모든 step에는 반드시 tip을 포함해야 한다.
      - tip은 다음 우선순위에 따라 작성한다.

      1. 해당 단계와 직접 관련된 일반적인 조리 팁이 있을 경우,
        사용자에게 조언하듯 1문장으로 작성한다.

      2. 적절한 조리 팁이 없을 경우,
        해당 단계에서 주의해야 할 기본적인 안전 사항을 작성한다.
        예: 뜨거운 냄비, 끓는 물, 칼 사용, 기름 튐 등

      - 단계와 직접 관련 없는 일반적인 주의사항은 작성하지 마라.
      - 과도한 경고 표현은 사용하지 마라.

      ────────────────────────
      [steps.stepTitle 작성 규칙]
      ────────────────────────

      - 해당 단계의 핵심 작업을 짧고 명확하게 요약한다.
      - 명사형 또는 동작형으로 작성한다.
      - 실제 화면 상단 제목으로 사용되므로 추상적인 표현은 사용하지 마라.
      - 10자 내외로 간결하게 작성한다.

      ────────────────────────
      [steps.description 작성 규칙]
      ────────────────────────

      - 실제 조리 과정을 사용자가 따라 할 수 있도록 안내하는 문장으로 작성한다.
      - 끊어진 자막은 의미 단위로 자연스럽게 합친다.
      - 불필요한 말투, 감탄사, 연출 표현은 제거한다.
      - 반드시 안내문 어투로 끝내야 한다.

      ────────────────────────
      [기존 필드 규칙]
      ────────────────────────

    - category
      - 영상에 등장하는 요리의 스타일과 기원에 따라
        가장 적합한 카테고리를 하나 선택해 작성한다.
      - 아래 카테고리 중 하나만 사용한다.
        - 한식
        - 양식
        - 중식
        - 일식
        - 디저트
        - 음료
        - 기타

      - 여러 카테고리에 걸칠 경우, 가장 대표적인 하나만 선택한다.
      - 명확한 판단이 어려울 경우 "기타"로 작성한다.

      - title
        - 영상에서 명확히 언급되거나 유추 가능한 요리 이름을 작성한다.
        - 불분명할 경우 "요리 레시피"로 작성한다.

      - description
        - 요리의 특징과 맛의 방향성을
          사용자에게 소개하듯 1~3문장으로 작성한다.
        - 영상에 없는 정보는 추가하지 마라.

      - cookingTime
        - 자막에 등장한 시간 정보를 기준으로 전체 조리 시간을 작성한다.
        - 1분, 10분, 1시간 등 String타입으로 작성한다.
        - 알 수 없으면 "시간 정보 없음"으로 작성한다.

      ────────────────────────
      [제거 대상]
      ────────────────────────

      - 요리와 무관한 인트로, 채널 소개
      - 잡담, 농담, 리액션
      - 홍보 문구
      - HTML 엔티티, 이모지, 연출 표현

      ────────────────────────
      [출력 규칙]
      ────────────────────────

      - 반드시 하나의 JSON 객체만 출력해 주세요.
      - JSON 외의 어떤 문자도 출력하지 마세요.
      - 마크다운, 설명, 주석은 출력하지 마세요.

      [자막 데이터]
      ${JSON.stringify(scriptArray, null, 2)}
      `;

    const res = await this.openAI.responses.create({
      model: "gpt-4.1-nano",
      input: prompt,
    });

    return JSON.parse(res.output_text);
  }

  private extractVideoId(url: string) {
    const match = url.match(
      /(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    );

    if (!match) {
      throw new Error("Invalid YouTube URL");
    }

    return match[1];
  }

  private getYoutubeThumbnail(url) {
    const youtubeId = this.extractVideoId(url);

    return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
  }

  async getMyRecipe(userId: number, page: number, take: number = 9) {
    const { skip, take: _take } = getPaginationParams(page, take);

    const [recipes, totalCount] = await Promise.all([
      this.prisma.recipe.findMany({
        where: { userId },
        select: {
          id: true,
          category: true,
          cookingTime: true,
          description: true,
          title: true,
          viewCount: true,
          thumbnailUrl: true,
          recipeSteps: true,
          recipeIngredients: true,
          recipeSource: true,
          youtubeVideoId: true,
          likeCount: true,
          like: userId ? { where: { userId } } : false,
        },
        orderBy: { id: "desc" },
        take: _take,
        skip,
      }),

      this.prisma.recipe.count({ where: { userId } }),
    ]);

    return getPaginationResult(
      recipes.map((recipe) => ({
        ...recipe,
        liked: recipe.like.length > 0,
      })),
      totalCount,
      _take,
    );
  }

  async getLikedRecipe(userId: number, page: number, take: number = 9) {
    const { skip, take: _take } = getPaginationParams(page, take);

    const [recipes, totalCount] = await Promise.all([
      this.prisma.recipe.findMany({
        where: {
          like: {
            some: { userId }, // 내가 좋아요한 레시피 필터
          },
        },
        select: {
          id: true,
          category: true,
          cookingTime: true,
          description: true,
          title: true,
          viewCount: true,
          thumbnailUrl: true,
          recipeSteps: true,
          recipeIngredients: true,
          recipeSource: true,
          youtubeVideoId: true,
          likeCount: true,
          like: { where: { userId } },
        },
        orderBy: { id: "desc" },
        take: _take,
        skip,
      }),

      this.prisma.recipe.count({
        where: {
          like: {
            some: { userId },
          },
        },
      }),
    ]);

    return getPaginationResult(
      recipes.map((recipe) => ({
        ...recipe,
        liked: recipe.like.length > 0, // 항상 true지만 일관성 유지
      })),
      totalCount,
      _take,
    );
  }

  async getRecipeCategory() {
    const category = await this.prisma.recipe_Category.findMany();

    return category;
  }

  async createRecipe(
    userId: number,
    payload: CreateRecipeDto,
    thumbnailImageFile?: Express.Multer.File,
    youtubeUrl?: string,
  ) {
    try {
      const { ingredients, steps, categoryId, ...recipeData } = payload;

      const parsedIngredients = JSON.parse(ingredients);
      const parsedSteps = JSON.parse(steps);
      const parsedCategoryId = Number(categoryId);

      const recipe = await this.prisma.recipe.create({
        data: {
          title: recipeData.title,
          description: recipeData.description,
          cookingTime: recipeData.cookingTime,
          thumbnailUrl: youtubeUrl ? this.getYoutubeThumbnail(youtubeUrl) : "",
          recipeSource: recipeData.recipeSource,
          youtubeVideoId: youtubeUrl ? this.extractVideoId(youtubeUrl) : null,
          user: {
            connect: { id: userId },
          },
          category: {
            connect: { id: parsedCategoryId },
          },
          recipeIngredients: {
            create: parsedIngredients,
          },
          recipeSteps: {
            create: parsedSteps,
          },
        },
      });

      if (!thumbnailImageFile) {
        return recipe;
      }

      const fileExtension =
        thumbnailImageFile?.originalname.split(".").pop() || "webp";
      const fileName = `${Date.now()}-${crypto.randomUUID()}.${fileExtension}`;
      const filePath = `/${userId}/recipe-thumbnail/${recipe.id}/${fileName}`;

      // supabase storage에 썸네일 저장
      const { data, error: storageError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, thumbnailImageFile.buffer, {
          contentType: thumbnailImageFile.mimetype,
        });

      if (storageError) throw storageError;

      // 저장한 이미지 url 추출
      const { data: publicUrlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(data.path);

      const thumbnailUrl = publicUrlData.publicUrl;

      const updateThumbnailRecipe = await this.prisma.recipe.update({
        data: {
          thumbnailUrl,
        },
        where: {
          id: recipe.id,
        },
      });

      return updateThumbnailRecipe;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findOneRecipe(recipeId: number, userId?: number) {
    const recipe = await this.prisma.recipe.findFirst({
      where: {
        id: recipeId,
      },
      select: {
        id: true,
        category: true,
        cookingTime: true,
        description: true,
        title: true,
        viewCount: true,
        thumbnailUrl: true,
        recipeSteps: true,
        recipeIngredients: true,
        recipeSource: true,
        youtubeVideoId: true,
        likeCount: true,

        like: userId ? { where: { userId } } : false,
      },
    });

    return {
      ...recipe,
      liked: userId ? recipe.like.length > 0 : false,
    };
  }

  async getRecipe(
    categoryId: number,
    search: string,
    page: number,
    take: number = 9,
    userId?: number,
  ) {
    const { skip, take: _take } = getPaginationParams(page, take);

    let where: Prisma.RecipeWhereInput = {};

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (search) {
      where.title = {
        contains: search,
        mode: "insensitive",
      };
    }

    const [recipes, totalCount] = await Promise.all([
      this.prisma.recipe.findMany({
        where,
        select: {
          id: true,
          category: true,
          cookingTime: true,
          description: true,
          title: true,
          viewCount: true,
          thumbnailUrl: true,
          recipeSteps: true,
          recipeIngredients: true,
          recipeSource: true,
          youtubeVideoId: true,
          likeCount: true,
          like: userId ? { where: { userId } } : false,
        },
        orderBy: { id: "desc" },
        take: _take,
        skip,
      }),

      this.prisma.recipe.count({ where }),
    ]);

    // await new Promise((resolve) => setTimeout(resolve, 5000));

    return getPaginationResult(
      recipes.map((recipe) => ({
        ...recipe,
        liked: userId ? recipe.like.length > 0 : false,
      })),
      totalCount,
      _take,
    );
  }

  async incrementViewCount(recipeId: number) {
    const recipe = this.prisma.recipe.update({
      where: { id: recipeId },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });

    return recipe;
  }

  async toggleRecipeLike(recipeId: number, userId: number) {
    return this.prisma.$transaction(async (tx) => {
      const existingLike = await tx.recipe_Like.findUnique({
        where: {
          recipeId_userId: { recipeId, userId },
        },
      });

      if (existingLike) {
        await tx.recipe_Like.delete({
          where: {
            recipeId_userId: { recipeId, userId },
          },
        });

        await tx.recipe.update({
          where: { id: recipeId },
          data: {
            likeCount: {
              decrement: 1,
            },
          },
        });

        return { liked: false };
      }

      await tx.recipe_Like.create({
        data: { recipeId, userId },
      });

      await tx.recipe.update({
        where: { id: recipeId },
        data: {
          likeCount: {
            increment: 1,
          },
        },
      });

      return { liked: true };
    });
  }

  async chatbot(message: string) {
    const ingredients = await this.prisma.food.findMany();
    const category = await this.prisma.recipe_Category.findMany();

    const prompt = `
    - 너는 사용자의 냉장고 식재료를 기반으로 요리 레시피를 추천해주는 AI 요리 어시스턴트다.
    - 식재료에 대한 정보는 이름(name), 개수(quantity), 단위(unit), 보관방법(location, COLD: 냉장, FROZEN: 냉동, ROOM_TEMP: 실온), 유통기한(expiration_date), memo(기타 특이사항), categoryId(1:채소,2:유제품,3:기타,4:해산물,5:곡물,6:육류,7:과일,8:조미료)이 있다.

    [서비스 배경 — 매우 중요]
    ────────────────────────
    이 서비스는 다음과 같은 UI로 구성되어 있다.

    1. 사용자가 채팅으로 레시피 추천을 요청한다.
    2. AI는 채팅 메시지로 추천 레시피를 안내한다.
    3. 채팅 메시지 하단에 "레시피 보기" 버튼이 노출된다.
    4. 버튼을 누르면 모달이 열리고, 모달은 슬라이드 형식이다.
    5. 슬라이드는 step1 → step2 → step3 순서로 넘어가는 단계별 조리 과정을 보여준다.

    따라서 steps 배열은 사용자가 슬라이드를 넘기며 순서대로 따라할 수 있도록
    각 단계를 명확하고 독립적으로 작성해야 한다.
    ────────────────────────

    [사용자 메시지]
    ${message}

    [사용자 보유 식재료]
    ${JSON.stringify(ingredients)}

    ────────────────────────
    [역할 및 목표]
    ────────────────────────
    - 사용자가 보유한 식재료를 최대한 활용한 레시피를 추천한다.
    - 없는 재료는 절대 언급하지 않고 레시피에 포함하지 않는다.
    - 사용자의 질문이나 요청에 맞는 요리를 추천한다.

    ────────────────────────
    [공통 문체 규칙 — 매우 중요]
    ────────────────────────
    - 모든 문장은 사용자에게 설명하거나 안내하는 어투로 작성한다.
    - 문장은 반드시 다음과 같은 형태로 끝나야 한다.
      - "~해주세요."
      - "~추천드려요."
      - "~만들어보세요."
      - "~즐길 수 있습니다."
    - "~한다", "~함", "~하였다" 같은 설명체 문장은 사용하지 마라.
    - 친근하고 자연스러운 말투를 유지한다.

    ────────────────────────
    [응답 JSON 구조]
    ────────────────────────

    [카테고리 목록]
    ${JSON.stringify(category)}
    // 위 목록에서 요리에 맞는 카테고리의 id와 name을 정확히 사용해야 한다.

    {
      "message": string,        // 채팅창에 표시될 친근한 레시피 추천 안내 메시지
      "recipe": {
        "categoryId" : number,  // 아래 카테고리 목록에서 해당하는 id를 선택
        "category": string,     // 한식 / 양식 / 중식 / 일식 / 디저트 / 음료 / 기타 중 하나
        "title": string,        // 요리 이름
        "description": string,  // 요리 소개 1~2문장
        "cookingTime": string,  // 조리 시간 예: "30분"
        "ingredients": {
          "name": string,       // 재료명
          "amount": string      // 양 예: "200g", "3큰술", "적당량"
        }[],
        "steps": {
          "stepNumber": number, // 1부터 순차적으로 증가 (슬라이드 번호와 동일)
          "stepTitle": string,  // 슬라이드 상단에 표시될 단계 제목 10자 내외
          "description": string,// 해당 슬라이드에서 사용자가 따라할 조리 과정
          "tip": string         // 해당 단계 조리 팁 또는 주의사항 1문장
        }[]
      }
    }


    ────────────────────────
    [출력 규칙]
    ────────────────────────

    - 반드시 하나의 JSON 객체만 출력해 주세요.
    - JSON 외의 어떤 문자도 출력하지 마세요.
    - 마크다운, 설명, 주석은 출력하지 마세요.
    - 추천 레시피는 1개만 제공한다.
    - 한국어로만 답변한다.
    `;

    const res = await this.openAI.responses.create({
      model: "gpt-4.1-nano",
      input: prompt,
    });

    return res.output_text;

    // return {
    //   message:
    //     "보유한 재료들을 활용하여 맛있는 돼지고기 양배추 볶음을 만들어보세요.",
    //   recipe: {
    //     category: "기타",
    //     title: "돼지고기 양배추 볶음",
    //     description:
    //       "담백하고 맛있는 돼지고기와 신선한 양배추가 어우러진 간단한 볶음 요리입니다. 빠르게 만들어 즐기기에 좋아요.",
    //     cookingTime: "20분",
    //     ingredients: [
    //       {
    //         name: "양배추",
    //         amount: "1개",
    //       },
    //       {
    //         name: "돼지고기",
    //         amount: "500g",
    //       },
    //       {
    //         name: "후추",
    //         amount: "적당량",
    //       },
    //     ],
    //     steps: [
    //       {
    //         stepNumber: 1,
    //         stepTitle: "재료 손질",
    //         description:
    //           "양배추는 먹기 좋은 크기로 채 썰고, 돼지고기는 적당한 크기로 써세요.",
    //         tip: "양배추는 너무 얇지 않게 써야 식감이 좋아요.",
    //       },
    //       {
    //         stepNumber: 2,
    //         stepTitle: "고기 익히기",
    //         description:
    //           "팬에 돼지고기를 넣고 중불에서 볶아주세요. 고기가 거의 익을 때까지 기다리면 돼요.",
    //         tip: "기름이 적으면 살짝 기름을 더해도 좋아요.",
    //       },
    //       {
    //         stepNumber: 3,
    //         stepTitle: "양배추 넣기",
    //         description:
    //           "고기가 익으면 양배추를 넣고 함께 볶아주세요. 양배추가 숨이 죽을 때까지 볶으시면 돼요.",
    //         tip: "너무 오래 볶지 말고 아삭한 식감을 유지하세요.",
    //       },
    //       {
    //         stepNumber: 4,
    //         stepTitle: "간 맞추기",
    //         description:
    //           "후추를 적당히 뿌려 간을 맞추고, 필요시 소금이나 간장을 조금 더 넣어주세요.",
    //         tip: "취향에 따라 간장을 넣어도 맛이 좋아요.",
    //       },
    //     ],
    //   },
    // };
  }
}
