import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async createAdmin(requesterId: number, data: { name: string; email: string; password: string }) {
    const requester = await this.prisma.user.findUnique({ where: { id: requesterId } });
    if (!requester || requester.role !== 'ADMIN') {
      throw new ForbiddenException('Only admins can create other admins');
    }

    const exists = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (exists) throw new ForbiddenException('Admin with this email already exists');

    const hash = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({
      data: { name: data.name, email: data.email, password: hash, role: 'ADMIN' },
    });
  }

  async getAllAdmins() {
    return this.prisma.user.findMany({
      where: { role: 'ADMIN' },
      select: { id: true, name: true, email: true, createdAt: true },
    });
  }

  async removeAdmin(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}
