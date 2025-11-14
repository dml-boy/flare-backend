// src/social/social.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { SocialService } from './social.service';
import { CreateSocialDto } from './dto/create-social.dto';
import { UpdateSocialDto } from './dto/update-social.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('social')
export class SocialController {
  constructor(private readonly service: SocialService) {}

  @Get()
  getAll() {
    return this.service.getAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() dto: CreateSocialDto) {
    return this.service.create(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: string, @Body() dto: UpdateSocialDto) {
    return this.service.update(id, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: string) {
    return this.service.delete(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('reorder')
  reorder(@Body() orderMap: { id: string; order: number }[]) {
    return this.service.reorder(orderMap);
  }
}