import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateUserInfoDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  nickname?: string;

  @ApiProperty({
    type: "string",
    format: "binary",
    description: "프로필 썸네일 이미지",
    required: false,
  })
  @IsOptional()
  thumbnailImageFile?: any;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  password?: string;
}
