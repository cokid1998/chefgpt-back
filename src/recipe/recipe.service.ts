import { Injectable } from "@nestjs/common";
// import { Innertube } from "youtubei.js";
import OpenAI from "openai";

@Injectable()
export class RecipeService {
  private readonly openAI: OpenAI;

  constructor() {
    this.openAI = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async getRecipeInfo(youtubeUrl: string) {
    // const videoId = await this.extractVideoId(youtubeUrl);

    // const { Innertube } = await import("youtubei.js");

    // const youtube = await Innertube.create({
    //   generate_session_locally: true,
    //   lang: "ko",
    //   location: "ko",
    //   retrieve_player: false,
    // });

    // // 1. 기본 정보 가져오기 (캡션 포함)
    // const info = await youtube.getBasicInfo(videoId);
    // const captionTracks = info.captions?.caption_tracks;

    // const res = await fetch(captionTracks[0].base_url);

    // const xml = await res.text();

    // const scriptArray = this.xmlToArray(xml);

    // const scriptSummary = this.scriptSummaryFromOpenAI(scriptArray);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          title: "스파게티 알리오 올리오",
          description:
            "이탈리아의 대표적인 파스타 요리로, 마늘과 올리브 오일을 활용한 간단하면서도 풍미 가득한 스파게티입니다. 빠르고 쉽게 만들 수 있어 바쁜 일상에도 적합한 메뉴입니다.",
          cookingTime: "20분",
          steps: [
            "양파를 썰어서 냄비 바닥에 깔아주고",
            "두부를 썰어서 올려 주세요",
            "물 400mm, 고춧가루, 다진마늘, 진간장, 멸치액젓, 올리고당, 다시다를 넣고 5분 동안 끓여 주세요",
            "마지막에 대파랑 청양고추 넣어서 분만 더 끓이면 완성",
          ],
        });
      }, 500);
    });
  }

  async scriptSummaryFromOpenAI(scriptArray: string[]) {
    // 만약 요리관련 정보가 아니라면 에러를 던진다거나 해서 프론트에 알려줘야함
    const prompt = `
      너는 YouTube 요리 영상 자막을 분석하여
      하나의 요리 레시피를 구조화된 JSON 형태로 정리하는 도구다.

      [작업 목표]
      입력된 자막 배열을 분석하여
      요리와 직접 관련된 정보만 추출하고,
      아래의 레시피 JSON 구조에 맞게 정리하라.

      [입력 데이터]
      - 입력은 string[] 형태의 YouTube 자막이다.
      - 배열 순서는 영상의 시간 흐름이다.
      - 자막에는 잡담, 농담, 리액션, 홍보 문구가 섞여 있다.

      [출력 JSON 구조]
      {
        "title": string,
        "description": string,
        "cookingTime": string,
        "steps": string[]
      }

      [각 필드 작성 규칙]
      - title:
        - 영상에서 유추 가능한 요리 이름을 간결하게 작성한다.
        - 명확하지 않을 경우 가장 대표적인 요리명을 추론한다.

      - description:
        - 요리의 특징과 맛, 조리 난이도를 간단히 요약한다.
        - 2~3문장 이내로 작성한다.
        - 영상에 없는 새로운 설정이나 스토리는 추가하지 마라.

      - cookingTime:
        - 자막에 언급된 시간 정보를 기준으로 전체 조리 시간을 추정한다.
        - 명확하지 않을 경우 일반적인 조리 시간을 고려하되 과장하지 마라.
        - 형식은 "약 20분", "30분 이내" 와 같이 작성한다.

      - steps:
        - 실제 조리에 필요한 단계만 순서대로 정리한다.
        - 말투는 제거하고 명령형 또는 설명형 문장으로 작성한다.
        - 끊어진 자막은 의미 단위로 자연스럽게 합친다.
        - 중복 단계는 하나로 통합한다.

      [제거 대상]
      - 요리와 무관한 인트로, 브랜드·채널 소개
      - 개인적인 감상, 농담, 리액션
      - 시청자와의 대화, 질문·답변
      - 홍보 문구
      - HTML 엔티티, 이모지, 연출용 표현

      [유지 대상]
      - 재료 및 양념
      - 조리 순서 및 방법
      - 시간, 불 조절, 마무리 과정

      [중요 제한 사항]
      - 영상에 없는 새로운 재료, 조리법, 팁을 추가하지 마라.
      - 추론은 최소한으로 하고, 요리 정보 왜곡이 없도록 한다.

      [출력 규칙]
      - 출력은 반드시 하나의 JSON 객체여야 한다.
      - JSON 외의 어떤 문자도 출력하지 마라.
      - 설명 문장이나 주석을 추가하지 마라.

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
