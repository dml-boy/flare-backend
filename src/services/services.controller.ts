import { Controller, Get, Param } from '@nestjs/common';
import { ServicesService } from './services.service';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  getAll() {
    return this.servicesService.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.servicesService.findOne(Number(id));
  }
}
