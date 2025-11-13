// src/client/client.module.ts
import { Module } from '@nestjs/common';
import { ClientController } from './clients.controller';
import { ClientsService } from './clients.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [ClientController],
  providers: [ClientsService, PrismaService],
})
export class ClientsModule {}
  