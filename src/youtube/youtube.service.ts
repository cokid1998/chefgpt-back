// youtube.service.ts
import { Injectable } from "@nestjs/common";
import { Innertube } from "youtubei.js";

@Injectable()
export class YoutubeService {
  private async extractVideoId(url: string): Promise<string> {
    const match = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    if (!match) {
      throw new Error("Invalid YouTube URL");
    }
    return match[1];
  }

  async getScript(youtubeUrl: string) {
    const videoId = await this.extractVideoId(youtubeUrl);

    const youtube = await Innertube.create({
      generate_session_locally: true, // ⭐ 중요
      lang: "ko",
      location: "ko",
      retrieve_player: false,
    });

    // 1. 기본 정보 가져오기 (캡션 포함)
    const info = await youtube.getBasicInfo(videoId);
    const captionTracks = info.captions?.caption_tracks;

    const res = await fetch(captionTracks[0].base_url);

    const xml = await res.text();

    console.log(xml);

    return xml;
  }
}
