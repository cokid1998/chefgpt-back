import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  Min,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

// 재료 DTO
export class IngredientDto {
  @IsString()
  name: string;

  @IsString()
  amount: string;
}

// 조리 단계 DTO
export class StepDto {
  @IsNumber()
  stepNumber: number;

  @IsString()
  stepTitle: string;

  @IsString()
  tip?: string;

  @IsString()
  description: string;
}

// 레시피 생성 DTO
export class CreateRecipeDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: "김치찌개" })
  title: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: "얼큰하고 시원한 국물 맛이 일품인 김치찌개입니다." })
  description: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 1 })
  categoryId: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: "30분" })
  cookingTime?: string;

  @IsString()
  // Todo: swagger문서화
  @ApiProperty({
    example: `[{name:"배추김치",amount:"300g"},{name:"돼지고기",amount:"200g"}]`,
  })
  ingredients: string;

  @IsString()
  // Todo: swagger문서화
  @ApiProperty({
    example: `[{
              stepNumber: 1,
              stepTitle: "재료 준비",
              description:
                "김치는 한입 크기로 썰고, 돼지고기도 먹기 좋은 크기로 썰어주세요. 두부는 깍둑썰기하고, 대파와 양파는 채썰어주세요.",
              tip: "신김치를 사용하면 더 깊은 맛이 나요.",
            }]`,
  })
  steps: string;
}
