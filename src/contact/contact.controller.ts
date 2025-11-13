// src/contact/contact.controller.ts
import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ContactService } from './contact.service';
import { UpdateContactDto } from './dto/update-contact.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('contact')
export class ContactController {
  constructor(private readonly service: ContactService) {}

  @Get()
  get() {
    return this.service.get();
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch()
  update(@Body() dto: UpdateContactDto) {
    return this.service.update(dto);
  }
}