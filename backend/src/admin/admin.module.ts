
import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { UsersModule } from '../users/users.module';
import { StoresModule } from '../stores/stores.module';

@Module({
    imports: [UsersModule, StoresModule],
    controllers: [AdminController],
})
export class AdminModule { }
