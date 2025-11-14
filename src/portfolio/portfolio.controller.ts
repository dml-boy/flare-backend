// src/portfolio/portfolio.controller.ts
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
import { PortfolioService } from './portfolio.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolio: PortfolioService) {}

  @Get()
  getAll() {
    return this.portfolio.getAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() dto: CreatePortfolioDto) {
    return this.portfolio.create(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: string, @Body() dto: UpdatePortfolioDto) {
    return this.portfolio.update(id, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: string) {
    return this.portfolio.delete(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('reorder')
  reorder(@Body() orderMap: { id: string; order: number }[]) {
    return this.portfolio.reorder(orderMap);
  }
}