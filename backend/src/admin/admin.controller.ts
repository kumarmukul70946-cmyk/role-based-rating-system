
import { Controller, Get, UseGuards } from '@nestjs/common';
import { StoresService } from '../stores/stores.service';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('admin/dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
    constructor(
        private readonly usersService: UsersService,
        private readonly storesService: StoresService
    ) { }

    @Get()
    async getDashboardStats() {
        const [totalUsers, totalStores, totalRatings] = await Promise.all([
            this.usersService.count(),
            this.storesService.count(),
            this.storesService.countRatings(),
        ]);

        return { totalUsers, totalStores, totalRatings };
    }
}
