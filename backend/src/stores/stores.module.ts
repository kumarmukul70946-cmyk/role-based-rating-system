
import { Module } from '@nestjs/common';
import { StoresService } from './stores.service';
import { StoresController, AdminStoresController } from './stores.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [StoresController, AdminStoresController],
    providers: [StoresService],
    exports: [StoresService],
})
export class StoresModule { }
