import { Controller, Get, Put, Body } from '@nestjs/common';
import { AboutService } from './about.service';

@Controller('about')
export class AboutController {
  constructor(private readonly aboutService: AboutService) {}

  @Get()
  find() {
    return this.aboutService.getAbout();
  }

  @Put()
  update(@Body() body: any) {
    return this.aboutService.updateAbout(body);
  }
}
