import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.service.findMany({ orderBy: { order: 'asc' }});
  }

  findOne(id: number) {
    return this.prisma.service.findUnique({ where: { id }});
  }
}
