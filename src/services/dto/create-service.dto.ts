// src/services/dto/create-service.dto.ts
import { IsString, IsInt } from 'class-validator';

export class CreateServiceDto {
  @IsString() title!: string;
  @IsString() description!: string;
  @IsString() iconClass!: string;
  @IsInt() order!: number;
}