// src/contact/dto/update-contact.dto.ts
import { IsString, IsEmail, IsPhoneNumber } from 'class-validator';

export class UpdateContactDto {
  @IsEmail() email!: string;
  @IsPhoneNumber() phone!: string;
  @IsString() address!: string;
}