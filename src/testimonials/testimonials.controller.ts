import { Controller, Get } from '@nestjs/common';
import { TestimonialsService } from './testimonials.service';

@Controller('testimonials')
export class TestimonialsController {
  constructor(private readonly testimonialsService: TestimonialsService) {}

  @Get()
  getAll() {
    return this.testimonialsService.findAll();
  }

  @Get('featured')
  getFeatured() {
    return this.testimonialsService.findFeatured();
  }
}
