// src/testimonials/testimonials.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';

@Injectable()
export class TestimonialsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.testimonial.findMany({ orderBy: { order: 'asc' } });
  }

  async findOne(id: string) {
    const testimonial = await this.prisma.testimonial.findUnique({ where: { id } });
    if (!testimonial) throw new NotFoundException(`Testimonial ${id} not found`);
    return testimonial;
  }

  async create(dto: CreateTestimonialDto) {
    const exists = await this.prisma.testimonial.findUnique({ where: { order: dto.order } });
    if (exists) throw new BadRequestException(`Order ${dto.order} is already taken`);
    return this.prisma.testimonial.create({ data: dto });
  }

  async update(id: string, dto: UpdateTestimonialDto) {
    const testimonial = await this.prisma.testimonial.findUnique({ where: { id } });
    if (!testimonial) throw new NotFoundException(`Testimonial ${id} not found`);

    if (dto.order && dto.order !== testimonial.order) {
      const taken = await this.prisma.testimonial.findUnique({ where: { order: dto.order } });
      if (taken && taken.id !== id) throw new BadRequestException(`Order ${dto.order} is already taken`);
    }

    return this.prisma.testimonial.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    const testimonial = await this.prisma.testimonial.findUnique({ where: { id } });
    if (!testimonial) throw new NotFoundException(`Testimonial ${id} not found`);

    await this.prisma.testimonial.delete({ where: { id } });

    // Reorder remaining
    const remaining = await this.prisma.testimonial.findMany({
      where: { order: { gt: testimonial.order } },
    });
    const updates = remaining.map((t, i) =>
      this.prisma.testimonial.update({
        where: { id: t.id },
        data: { order: testimonial.order + i },
      }),
    );
    await this.prisma.$transaction(updates);

    return { message: 'Deleted and reordered' };
  }

  async reorder(orderMap: { id: string; order: number }[]) {
    const current = await this.findAll();
    const currentIds = current.map(t => t.id);
    const newIds = orderMap.map(o => o.id);

    if (currentIds.length !== newIds.length || !currentIds.every(id => newIds.includes(id))) {
      throw new BadRequestException('All testimonials must be included');
    }

    const updates = orderMap.map(({ id, order }) =>
      this.prisma.testimonial.update({ where: { id }, data: { order } }),
    );

    await this.prisma.$transaction(updates);
    return this.findAll();
  }
}
