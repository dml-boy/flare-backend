import { Module } from '@nestjs/common';
import { AboutService } from './about.service';
import { AboutController } from './about.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  providers: [AboutService, PrismaService],
  controllers: [AboutController],
})
export class AboutModule {}
