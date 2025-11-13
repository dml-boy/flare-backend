// src/about/about.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { AboutService } from './about.service';
import { UpdateAboutDto } from './dto/update-about.dto';
import { CreateStepDto } from './dto/create-step.dto';
import { UpdateStepDto } from './dto/update-step.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('about')
export class AboutController {
  constructor(private readonly about: AboutService) {}

  // Public — anyone can view
  @Get()
  async getAll() {
    return this.about.getAbout();
  }

  // Protected — update main about section
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async updateAbout(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateAboutDto,
  ) {
    return this.about.updateAbout(id, body);
  }

  // Protected — create step
  @UseGuards(AuthGuard('jwt'))
  @Post(':aboutId/steps')
  async createStep(
    @Param('aboutId', ParseIntPipe) aboutId: number,
    @Body() body: CreateStepDto,
  ) {
    return this.about.createStep(aboutId, body);
  }

  // Protected — update step
  @UseGuards(AuthGuard('jwt'))
  @Patch('steps/:id')
  async updateStep(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateStepDto,
  ) {
    return this.about.updateStep(id, body);
  }
}