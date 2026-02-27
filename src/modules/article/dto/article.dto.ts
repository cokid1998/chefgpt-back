import { ApiProperty } from "@nestjs/swagger";
import {
  IsInt,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: "제목" })
  title: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: "요약" })
  summary: string;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ example: "카테고리 Id" })
  categoryId: number;

  @IsArray()
  @IsOptional()
  @ApiProperty({ example: "태그" })
  tags: string[];

  @IsString()
  @IsNotEmpty()
  @ApiProperty({})
  contentJSON: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: "readingTime 계산에 필요한 콘텐츠 텍스트" })
  contentText: string;
}
