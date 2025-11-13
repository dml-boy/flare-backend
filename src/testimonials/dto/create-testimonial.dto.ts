// src/testimonials/dto/create-testimonial.dto.ts
import { IsString, IsInt, IsOptional } from 'class-validator';

export class CreateTestimonialDto {
  @IsString()
  content: string;

  @IsString()
  authorName: string;

  @IsString()
  authorTitle: string;

  @IsString()
  authorImage: string;

  @IsInt()
  order: number;
}
