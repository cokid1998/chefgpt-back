import { Get, Controller, Query } from "@nestjs/common";
import { YoutubeService } from "./youtube.service";

@Controller("youtube")
export class YoutubeController {
  constructor(private readonly youtubeService: YoutubeService) {}

  @Get()
  async getScript(@Query("youtubeUrl") url: string) {
    return this.youtubeService.getScript(url);
  }
}
