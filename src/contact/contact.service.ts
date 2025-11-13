// src/contact/contact.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateContactDto } from './dto/update-contact.dto';

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) {}

  async get() {
    const info = await this.prisma.contactInfo.findFirst();
    if (!info) throw new NotFoundException('Contact info not found');
    return info;
  }

  async update(dto: UpdateContactDto) {
    const info = await this.prisma.contactInfo.findFirst();
    if (!info) {
      return this.prisma.contactInfo.create({ data: dto });
    }
    return this.prisma.contactInfo.update({ where: { id: info.id }, data: dto });
  }
}