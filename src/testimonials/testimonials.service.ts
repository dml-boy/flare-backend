import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TestimonialsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.testimonial.findMany({ orderBy: { createdAt: 'desc' }});
  }

  findFeatured() {
    return this.prisma.testimonial.findMany({ where: { featured: true }});
  }
}
