import { Injectable, OnModuleInit, OnModuleDestroy, INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  } 

  // ✅ Use process events instead of beforeExit
  enableShutdownHooks(app: INestApplication) {
    const shutdown = async () => {
      await this.$disconnect();
      await app.close();
      process.exit(0);
    };

    process.on('SIGINT', shutdown);  // Ctrl+C
    process.on('SIGTERM', shutdown); // Termination signal
  }
}
