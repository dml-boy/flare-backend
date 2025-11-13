import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { AboutModule } from './about/about.module';
import { TestimonialsModule } from './testimonials/testimonials.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';
import { ServicesModule } from './services/services.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { ContactModule } from './contact/contact.module';
import { SocialModule } from './social/social.module';
import { ClientsModule } from './clients/clients.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AboutModule,
    TestimonialsModule,
    AuthModule,
    UserModule,
    AdminModule,
    ServicesModule,
    PortfolioModule,
    ContactModule,
    SocialModule,
    ClientsModule,
  ],
})
export class AppModule {}
