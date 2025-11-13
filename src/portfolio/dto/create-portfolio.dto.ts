// src/portfolio/dto/create-portfolio.dto.ts
import { IsString, IsInt, IsOptional, IsUrl } from 'class-validator';

export class CreatePortfolioDto {
  @IsString() title!: string;
  @IsString() category!: string;
  @IsString() thumbUrl!: string;
  @IsOptional() @IsString() thumb2xUrl?: string;
  @IsString() fullUrl!: string;
  @IsString() fullSize!: string;
  @IsOptional() @IsUrl() projectUrl?: string;
  @IsString() description!: string;
  @IsInt() order!: number;
}