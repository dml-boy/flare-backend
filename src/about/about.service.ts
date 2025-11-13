// src/about/about.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateAboutDto } from './dto/update-about.dto';
import { CreateStepDto } from './dto/create-step.dto';
import { UpdateStepDto } from './dto/update-step.dto';

@Injectable()
export class AboutService {
  constructor(private prisma: PrismaService) {}

  // GET: public
  async getAbout() {
    const about = await this.prisma.aboutIntro.findFirst({
      include: { steps: { orderBy: { order: 'asc' } } },
    });
    if (!about) throw new NotFoundException('About section not found');
    return about;
  }

  // PATCH /about/:id
  async updateAbout(id: number, dto: UpdateAboutDto) {
    const exists = await this.prisma.aboutIntro.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException(`About with id ${id} not found`);

    return this.prisma.aboutIntro.update({
      where: { id },
      data: dto,
      include: { steps: { orderBy: { order: 'asc' } } },
    });
  }

  // POST /about/:aboutId/steps
  async createStep(aboutId: number, dto: CreateStepDto) {
    const about = await this.prisma.aboutIntro.findUnique({ where: { id: aboutId } });
    if (!about) throw new NotFoundException(`About with id ${aboutId} not found`);

    const orderExists = await this.prisma.aboutStep.findFirst({
      where: { aboutIntroId: aboutId, order: dto.order },
    });
    if (orderExists) throw new BadRequestException(`Order ${dto.order} already taken`);

    return this.prisma.aboutStep.create({
      data: { ...dto, aboutIntroId: aboutId },
    });
  }

  // PATCH /about/steps/:id
  async updateStep(id: number, dto: UpdateStepDto) {
    const step = await this.prisma.aboutStep.findUnique({ where: { id } });
    if (!step) throw new NotFoundException(`Step with id ${id} not found`);

    // If order changes, ensure uniqueness
    if (dto.order !== undefined && dto.order !== step.order) {
      const orderTaken = await this.prisma.aboutStep.findFirst({
        where: {
          aboutIntroId: step.aboutIntroId,
          order: dto.order,
          id: { not: id },
        },
      });
      if (orderTaken) throw new BadRequestException(`Order ${dto.order} already taken`);
    }

    return this.prisma.aboutStep.update({
      where: { id },
      data: dto,
    });
  }
}