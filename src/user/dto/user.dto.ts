import { IsOptional, IsString } from "class-validator";

export class UpdateUserInfoDto {
  @IsString()
  @IsOptional()
  nickname: string;

  @IsString()
  @IsOptional()
  thumbnail: string;
}
