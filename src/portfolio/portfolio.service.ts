// src/portfolio/portfolio.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';

@Injectable()
export class PortfolioService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return this.prisma.portfolio.findMany({
      orderBy: { order: 'asc' },
    });
  }

  async create(dto: CreatePortfolioDto) {
    const orderTaken = await this.prisma.portfolio.findUnique({
      where: { order: dto.order },
    });
    if (orderTaken) throw new BadRequestException(`Order ${dto.order} taken`);

    return this.prisma.portfolio.create({ data: dto });
  }

  async update(id: number, dto: UpdatePortfolioDto) {
    const item = await this.prisma.portfolio.findUnique({ where: { id } });
    if (!item) throw new NotFoundException(`Item ${id} not found`);

    if (dto.order && dto.order !== item.order) {
      const taken = await this.prisma.portfolio.findUnique({
        where: { order: dto.order },
      });
      if (taken && taken.id !== id) throw new BadRequestException(`Order ${dto.order} taken`);
    }

    return this.prisma.portfolio.update({ where: { id }, data: dto });
  }

  async delete(id: number) {
    const item = await this.prisma.portfolio.findUnique({ where: { id } });
    if (!item) throw new NotFoundException(`Item ${id} not found`);

    await this.prisma.portfolio.delete({ where: { id } });

    // Reorder
    const remaining = await this.prisma.portfolio.findMany({
      where: { order: { gt: item.order } },
    });
    const updates = remaining.map((i, idx) =>
      this.prisma.portfolio.update({
        where: { id: i.id },
        data: { order: item.order + idx },
      }),
    );
    await this.prisma.$transaction(updates);

    return { message: 'Deleted and reordered' };
  }

  async reorder(orderMap: { id: number; order: number }[]) {
    const current = await this.getAll();
    const currentIds = current.map(i => i.id);
    const newIds = orderMap.map(o => o.id);

    if (currentIds.length !== newIds.length || !currentIds.every(id => newIds.includes(id))) {
      throw new BadRequestException('All items must be included');
    }

    const updates = orderMap.map(({ id, order }) =>
      this.prisma.portfolio.update({ where: { id }, data: { order } }),
    );
    await this.prisma.$transaction(updates);
    return this.getAll();
  }
}