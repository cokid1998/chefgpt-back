import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
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

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: dayjs().format("YYYY-MM-DD"),
  })
  startDate: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: dayjs().add(7, "day").format("YYYY-MM-DD"),
  })
  endDate: string;
}

export class CreateSubmitVoteDto {
  @IsEnum(Option_Name)
  @IsNotEmpty()
  @ApiProperty({
    example: "A",
  })
  selectOption: Option_Name;
}
