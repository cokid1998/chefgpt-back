import { Injectable } from "@nestjs/common";
import OpenAI from "openai";
import { PrismaService } from "src/prisma/prisma.service";
// import { Innertube } from "youtubei.js";

@Injectable()
export class RecipeService {
  private readonly openAI: OpenAI;

  constructor(private readonly prisma: PrismaService) {
    this.openAI = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async getYoutubeRecipeScript(youtubeUrl: string) {
    const videoId = await this.extractVideoId(youtubeUrl);

    const { Innertube } = await import("youtubei.js");

    const youtube = await Innertube.create({
      generate_session_locally: true,
      lang: "ko",
      location: "ko",
      retrieve_player: false,
    });

    // Todo: 간헐적 혹은 요청을 많이하면 caption_tracks가 응답으로 나오지않음...
    const info = await youtube.getBasicInfo(videoId);
    console.log("info: ", info);

    const res = await fetch(info.captions.caption_tracks[0].base_url);
    console.log("res: ", res);

    const xml = await res.text();
    console.log("xml: ", xml);

    const scriptArray = this.xmlToArray(xml);
    console.log("scriptArray: ", scriptArray);

    const scriptSummary = this.youtubeScriptSummaryFromOpenAI(scriptArray);
    console.log("scriptSummary: ", scriptSummary);

    return scriptSummary;

    // return new Promise((resolve) => {
    //   setTimeout(() => {
    //     resolve({
    //       category: "양식",
    //       ingredients: [
    //         { name: "스파게티", amount: "200g" },
    //         { name: "마늘", amount: "5쪽" },
    //         { name: "올리브 오일", amount: "3큰술" },
    //         { name: "고추", amount: "1개" },
    //         { name: "파슬리", amount: "약간" },
    //         { name: "소금", amount: "적당량" },
    //         { name: "후추", amount: "적당량" },
    //       ],
    //       title: "스파게티 알리오 올리오",
    //       description:
    //         "이탈리아의 대표적인 파스타 요리로, 마늘과 올리브 오일을 활용한 간단하면서도 풍미 가득한 스파게티입니다. 빠르고 쉽게 만들 수 있어 바쁜 일상에도 적합한 메뉴입니다.",
    //       cookingTime: "20분",
    //       steps: [
    //         {
    //           stepTitle: "양파 손질",
    //           description:
    //             "양파를 먹기 좋은 크기로 썰어 냄비 바닥에 골고루 깔아주세요.",
    //           tip: "양파를 먼저 깔아주면 재료가 눌어붙는 것을 방지할 수 있습니다.",
    //         },
    //         {
    //           stepTitle: "두부 준비",
    //           description: "두부를 적당한 크기로 썰어 양파 위에 올려주세요.",
    //           tip: "두부는 너무 작게 썰면 끓이는 동안 부서질 수 있으니 조심하세요.",
    //         },
    //         {
    //           stepTitle: "양념 끓이기",
    //           description:
    //             "물 400ml에 고춧가루, 다진 마늘, 진간장, 멸치액젓, 올리고당, 다시다를 넣고 약 5분간 끓여주세요.",
    //           tip: "끓이는 동안 국물이 넘치지 않도록 불 조절에 주의하세요.",
    //         },
    //         {
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

  async youtubeScriptSummaryFromOpenAI(scriptArray: string[]) {
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
        "cookingTime": number,
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
        - 전체 조리 시간을 "분 단위 숫자(Number)"로 작성한다.
        - 최소 1부터 시작한다.
        - 단위(분, 분 정도 등)는 절대 포함하지 마라.
        - 자막에 등장한 시간 정보를 기준으로 전체 조리 시간을 작성한다.
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

  private xmlToArray(xml: string): string[] {
    const result: string[] = [];

    const regex = /<text[^>]*>([\s\S]*?)<\/text>/g;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(xml)) !== null) {
      result.push(match[1]);
    }

    return result;
  }

  private async extractVideoId(url: string): Promise<string> {
    const match = url.match(
      /(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    );

    if (!match) {
      throw new Error("Invalid YouTube URL");
    }

    return match[1];
  }
}
