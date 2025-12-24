import { ApiProperty } from "@nestjs/swagger";
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";
import dayjs from "dayjs";
import { Option_Name } from "prisma/generated/enums";

export class CreateVoteDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: "MSG 논란",
  })
  title: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: "식품첨가물 MSG(글루탐산나트륨)은 몸에 나쁘다고 생각하시나요?",
  })
  description: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: "그렇다",
  })
  optionA: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: "아니다",
  })
  optionB: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    example: dayjs().startOf("day").add(7, "day").format(),
  })
  startDate: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    example: dayjs().startOf("day").add(7, "day").format(),
  })
  endDate: string;
}
