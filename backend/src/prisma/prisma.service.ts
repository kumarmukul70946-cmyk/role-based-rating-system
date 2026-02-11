
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    async onModuleInit() {
        // In serverless, we don't want to block the entire app startup 
        // while waiting for the database to connect. 
        // Prisma will connect automatically on the first query.
        console.log('Prisma initialized (Lazy Connection Mode)');
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}
