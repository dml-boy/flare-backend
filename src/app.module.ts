// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';

// import modules normally (but we will conditionally include them)
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

const ENABLED = (process.env.ENABLED_MODULES || '').split(',').map(s => s.trim()).filter(Boolean);

// helper to check if module name is enabled
function isEnabled(name: string) {
  if (!ENABLED.length) return true; // if none specified, enable all (default)
  return ENABLED.includes(name);
}

const imports = [
  ConfigModule.forRoot({ isGlobal: true }),
  PrismaModule,
  ...(isEnabled('About') ? [AboutModule] : []),
  ...(isEnabled('Testimonials') ? [TestimonialsModule] : []),
  ...(isEnabled('Auth') ? [AuthModule] : []),
  ...(isEnabled('User') ? [UserModule] : []),
  ...(isEnabled('Admin') ? [AdminModule] : []),
  ...(isEnabled('Services') ? [ServicesModule] : []),
  ...(isEnabled('Portfolio') ? [PortfolioModule] : []),
  ...(isEnabled('Contact') ? [ContactModule] : []),
  ...(isEnabled('Social') ? [SocialModule] : []),
  ...(isEnabled('Clients') ? [ClientsModule] : []),
];

@Module({ imports })
export class AppModule {}
