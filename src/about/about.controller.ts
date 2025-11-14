// src/about/about.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AboutService } from './about.service';
import { UpdateAboutDto } from './dto/update-about.dto';
import { CreateStepDto } from './dto/create-step.dto';
import { UpdateStepDto } from './dto/update-step.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('about')
export class AboutController {
  constructor(private readonly about: AboutService) {}

  @Get()
  async getAll() {
    return this.about.getAbout();
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async updateAbout(
    @Param('id') id: string,   // 👈 MongoDB IDs are strings
    @Body() body: UpdateAboutDto,
  ) {
    return this.about.updateAbout(id, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':aboutId/steps')
  async createStep(
    @Param('aboutId') aboutId: string,  // 👈 string ID
    @Body() body: CreateStepDto,
  ) {
    return this.about.createStep(aboutId, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('steps/:id')
  async updateStep(
    @Param('id') id: string,  // 👈 string ID
    @Body() body: UpdateStepDto,
  ) {
    return this.about.updateStep(id, body);
  }
}
