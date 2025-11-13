// src/client/dto/create-client.dto.ts
import { IsString, IsInt, IsOptional, IsUrl } from 'class-validator';

export class CreateClientDto {
  @IsString()
  name: string;

  @IsUrl()
  logoUrl: string;

  @IsOptional()
  @IsUrl()
  linkUrl?: string;

  @IsInt()
  order: number;
}
