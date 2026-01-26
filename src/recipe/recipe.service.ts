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

  async getScript(youtubeUrl: string) {
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
        resolve([
          "양파를 썰어서 냄비 바닥에 깔아주고",
          "두부를 썰어서 올려 주세요",
          "물 400mm, 고춧가루, 다진마늘, 진간장, 멸치액젓, 올리고당, 다시다를 넣고 5분 동안 끓여 주세요",
          "마지막에 대파랑 청양고추 넣어서 분만 더 끓이면 완성",
        ]);
      }, 500);
    });
  }

  async scriptSummaryFromOpenAI(scriptArray: string[]) {
    // 만약 요리관련 정보가 아니라면 에러를 던진다거나 해서 프론트에 알려줘야함
    const prompt = `
          너는 YouTube 요리 영상 자막을 분석하여
          요리와 직접 관련된 내용만 추출하는 도구다.

          [작업 목표]
          입력된 자막 배열에서
          요리 재료, 조리 과정, 조리 방법만 남기고
          그 외의 모든 내용은 제거하고 정리해라.

          [입력 데이터]
          - 입력은 string[] 형태의 YouTube 자막이다.
          - 배열 순서는 영상의 시간 흐름이다.
          - 자막에는 잡담, 농담, 반응, 홍보가 섞여 있다.

          [제거 대상]
          - 요리와 무관한 인트로, 브랜드 설명
          - 재미를 위한 멘트, 개인 의견, 감상
          - 시청자와의 대화, 질문·답변 리액션
          - 홍보 문구
          - HTML 엔티티, 이모지, 연출 지문

          [유지 대상]
          - 재료 및 양념
          - 조리 순서
          - 시간, 온도, 조리 방법
          - 소스 및 마무리 과정

          [요약 규칙]
          - 끊어진 자막은 의미 단위로 자연스럽게 합쳐라.
          - 말투는 제거하고 정보 위주로 정리해라.
          - 중복 내용은 하나로 통합해라.
          - 새로운 요리 정보는 추가하지 마라.

          [출력 규칙]
          - 출력은 요리 단계별 JSON 배열(string[])이다.
          - JSON외의 어떤 문자도 출력하지 마라.
          - 요리에 관련 없는 문장은 출력하지 마라.
          - JSON 배열만 출력하고 설명은 하지 마라.

          [예시]
          입력:
          [
            "요즘 미국에서 가장 핫한 브랜드라",
            "&amp;gt;&amp;gt; 레이징 케인즈 시작. 먼저 닭 안심에.",
            "다진마늘 미림 소금."
          ]

          출력:
          [
            "다진 마늘, 미림, 소금으로 닭고기를 밑간한다."
          ]

          입력:
          [
            "&amp;gt;&amp;gt; 보기만 해도 혈관 막히게 생겼네.",
            "낮은 온도에서 한 번, 높은 온도에서 한",
            "번, 총 두 번을 튀겨 줘."
          ]

          출력:
          [
            "낮은 온도에서 한 번, 높은 온도에서 한 번 총 두 번 튀긴다."
          ]

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
