import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";
import { Food_Location } from "prisma/generated/enums";

export class CreateFoodDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(Food_Location)
  @IsOptional()
  location: Food_Location;

  @IsInt()
  @IsOptional()
  quantity: number;

  @IsString()
  @IsOptional()
  unit: string;

  @IsDateString()
  @IsOptional()
  expiration_date: string;

  @IsString()
  @IsOptional()
  memo: string;

  @IsInt()
  categoryId: number;
}
