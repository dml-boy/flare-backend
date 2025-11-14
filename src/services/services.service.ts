// src/services/services.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  // GET all services (public)
  async getAll() {
    return this.prisma.service.findMany({
      orderBy: { order: 'asc' },
    });
  }

  // CREATE new service (admin)
  async create(dto: CreateServiceDto) {
    const orderExists = await this.prisma.service.findUnique({
      where: { order: dto.order },
    });
    if (orderExists) throw new BadRequestException(`Order ${dto.order} is already taken`);

    return this.prisma.service.create({ data: dto });
  }

  // UPDATE service (admin)
  async update(id: string, dto: UpdateServiceDto) {
    const service = await this.prisma.service.findUnique({ where: { id } });
    if (!service) throw new NotFoundException(`Service with id ${id} not found`);

    if (dto.order !== undefined && dto.order !== service.order) {
      const orderTaken = await this.prisma.service.findUnique({
        where: { order: dto.order },
      });
      if (orderTaken && orderTaken.id !== id) {
        throw new BadRequestException(`Order ${dto.order} is already taken`);
      }
    }

    return this.prisma.service.update({
      where: { id },
      data: dto,
    });
  }

  // DELETE service (admin)
  async delete(id: string) {
    const service = await this.prisma.service.findUnique({ where: { id } });
    if (!service) throw new NotFoundException(`Service with id ${id} not found`);

    await this.prisma.service.delete({ where: { id } });

    // Reorder remaining
    const remaining = await this.prisma.service.findMany({
      where: { order: { gt: service.order } },
      orderBy: { order: 'asc' },
    });

    const updates = remaining.map((s, idx) =>
      this.prisma.service.update({
        where: { id: s.id },
        data: { order: service.order + idx },
      }),
    );

    await this.prisma.$transaction(updates);
    return { message: 'Service deleted and order updated' };
  }

  // REORDER services (drag & drop)
  async reorder(orderMap: { id: string; order: number }[]) {
    const current = await this.getAll();
    const currentIds = current.map(s => s.id);
    const newIds = orderMap.map(o => o.id);

    if (
      currentIds.length !== newIds.length ||
      !currentIds.every(id => newIds.includes(id))
    ) {
      throw new BadRequestException('All services must be included in reorder');
    }

    const updates = orderMap.map(({ id, order }) =>
      this.prisma.service.update({
        where: { id },
        data: { order },
      }),
    );

    await this.prisma.$transaction(updates);
    return this.getAll();
  }
}