// src/client/client.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  getAll() {
    return this.prisma.client.findMany({
      orderBy: { order: 'asc' },
    });
  }

  getOne(id: string) {
    return this.prisma.client.findUnique({
      where: { id },
    });
  }

  create(data: CreateClientDto) {
    return this.prisma.client.create({ data });
  }

  update(id: string, data: UpdateClientDto) {
    return this.prisma.client.update({
      where: { id },
      data,
    });
  }
}
