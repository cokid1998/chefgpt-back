import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";
import { Food_Location } from "prisma/generated/enums";
import { ApiProperty, PartialType } from "@nestjs/swagger";

export class CreateFoodDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: "육회",
  })
  name: string;

  @IsEnum(Food_Location)
  @IsOptional()
  @ApiProperty({
    example: "COLD",
  })
  location: Food_Location;

  @IsInt()
  @IsOptional()
  @ApiProperty({
    example: 500,
  })
  quantity: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: "g",
  })
  unit: string;

  @IsDateString()
  @IsOptional()
  @ApiProperty({
    example: "2025-12-12",
  })
  expiration_date: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: "빨리먹어야함",
  })
  memo: string;

  @IsInt()
  @ApiProperty({
    example: 2,
  })
  categoryId: number;
}

export class PatchFoodDto extends PartialType(CreateFoodDto) {}
