import { Controller, Post, Get, Delete, Param, Body, Req, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('admins')
@UseGuards(AuthGuard('jwt'))
export class AdminController {
  constructor(private admin: AdminService) {}

  @Post('create')
  async create(@Req() req, @Body() body) {
    return this.admin.createAdmin(req.user.id, body);
  }

  @Get()
  async all() {
    return this.admin.getAllAdmins();
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.admin.removeAdmin(id);   // 👈 no +id, MongoDB uses string ID
  }
}
