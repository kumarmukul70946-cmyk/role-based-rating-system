import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../prisma/prisma.module';
// No controller here because user routes are under /admin/users (handled in Admin controller?) or separate UsersController
// The prompt specifies /admin/users. I will put that in a UsersController anyway and secure it.

@Module({
    imports: [PrismaModule],
    controllers: [UsersController], // Added UsersController to the controllers array
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule { }
