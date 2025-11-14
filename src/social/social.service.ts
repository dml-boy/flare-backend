// src/social/social.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSocialDto } from './dto/create-social.dto';
import { UpdateSocialDto } from './dto/update-social.dto';

@Injectable()
export class SocialService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return this.prisma.socialLink.findMany({ orderBy: { order: 'asc' } });
  }

  async create(dto: CreateSocialDto) {
    const exists = await this.prisma.socialLink.findUnique({ where: { order: dto.order } });
    if (exists) throw new BadRequestException(`Order ${dto.order} taken`);
    return this.prisma.socialLink.create({ data: dto });
  }

  async update(id: string, dto: UpdateSocialDto) {
    const link = await this.prisma.socialLink.findUnique({ where: { id } });
    if (!link) throw new NotFoundException(`Social link ${id} not found`);

    if (dto.order && dto.order !== link.order) {
      const taken = await this.prisma.socialLink.findUnique({ where: { order: dto.order } });
      if (taken && taken.id !== id) throw new BadRequestException(`Order ${dto.order} taken`);
    }

    return this.prisma.socialLink.update({ where: { id }, data: dto });
  }

  async delete(id: string) {
    const link = await this.prisma.socialLink.findUnique({ where: { id } });
    if (!link) throw new NotFoundException(`Social link ${id} not found`);

    await this.prisma.socialLink.delete({ where: { id } });

    const remaining = await this.prisma.socialLink.findMany({
      where: { order: { gt: link.order } },
    });
    const updates = remaining.map((l, i) =>
      this.prisma.socialLink.update({
        where: { id: l.id },
        data: { order: link.order + i },
      }),
    );
    await this.prisma.$transaction(updates);

    return { message: 'Deleted and reordered' };
  }

  async reorder(orderMap: { id: string; order: number }[]) {
    const current = await this.getAll();
    const currentIds = current.map(l => l.id);
    const newIds = orderMap.map(o => o.id);

    if (currentIds.length !== newIds.length || !currentIds.every(id => newIds.includes(id))) {
      throw new BadRequestException('All links must be included');
    }

    const updates = orderMap.map(({ id, order }) =>
      this.prisma.socialLink.update({ where: { id }, data: { order } }),
    );
    await this.prisma.$transaction(updates);
    return this.getAll();
  }
}