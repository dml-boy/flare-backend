import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtStrategy } from '../auth/jwt.strategy';

@Module({
  controllers: [AdminController],
  providers: [AdminService, PrismaService, JwtStrategy],
})
export class AdminModule {}
