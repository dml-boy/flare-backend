// src/social/dto/create-social.dto.ts
import { IsString, IsUrl, IsInt } from 'class-validator';

export class CreateSocialDto {
  @IsString() platform!: string;
  @IsUrl() url!: string;
  @IsInt() order!: number;
}