import { Injectable } from "@nestjs/common";
import { Innertube } from "youtubei.js";

@Injectable()
export class YoutubeService {
  async getScript(youtubeUrl: string) {
    const videoId = await this.extractVideoId(youtubeUrl);

    const youtube = await Innertube.create({
      generate_session_locally: true,
      lang: "ko",
      location: "ko",
      retrieve_player: false,
    });

    // 1. 기본 정보 가져오기 (캡션 포함)
    const info = await youtube.getBasicInfo(videoId);
    const captionTracks = info.captions?.caption_tracks;

    const res = await fetch(captionTracks[0].base_url);

    const xml = await res.text();

    const result = this.xmlToArray(xml);

    return result;
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
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    if (!match) {
      throw new Error("Invalid YouTube URL");
    }
    return match[1];
  }
}
