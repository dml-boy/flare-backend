// src/services/services.controller.ts
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
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('services')
export class ServicesController {
  constructor(private readonly services: ServicesService) {}

  // Public
  @Get()
  getAll() {
    return this.services.getAll();
  }

  // Admin only
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() dto: CreateServiceDto) {
    return this.services.create(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateServiceDto) {
    return this.services.update(id, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.services.delete(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('reorder')
  reorder(@Body() orderMap: { id: number; order: number }[]) {
    return this.services.reorder(orderMap);
  }
}