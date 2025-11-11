import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AboutService {
  constructor(private prisma: PrismaService) {}

  async getAbout() {
    return this.prisma.about.findFirst();
  }

  async updateAbout(data: any) {
    return this.prisma.about.upsert({
      where: { id: 1 },
      create: data,
      update: data,
    });
  }
}
