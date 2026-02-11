
import { Controller, Get, Post, Body, Param, Query, UseGuards, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role, Prisma } from '@prisma/client';

@Controller('admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @Get()
    async findAll(
        @Query('name') name?: string,
        @Query('email') email?: string,
        @Query('role') role?: Role,
        @Query('sortBy') sortBy?: string, // name|email|role|createdAt
        @Query('order') order: 'asc' | 'desc' = 'asc',
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    ) {
        const skip = (page - 1) * limit;

        const where: Prisma.UserWhereInput = {
            name: name ? { contains: name, mode: 'insensitive' } : undefined,
            email: email ? { contains: email, mode: 'insensitive' } : undefined,
            role: role ? { equals: role } : undefined,
        };

        let orderBy: Prisma.UserOrderByWithRelationInput | undefined = undefined;
        if (sortBy === 'name') orderBy = { name: order };
        if (sortBy === 'email') orderBy = { email: order };
        if (sortBy === 'role') orderBy = { role: order };
        if (sortBy === 'createdAt') orderBy = { createdAt: order };

        const [items, total] = await Promise.all([
            this.usersService.findAll({ skip, take: limit, where, orderBy }),
            this.usersService.count(where),
        ]);

        // Map output to remove password hashes
        const sanitized = items.map(u => {
            const { password_hash, ...rest } = u;
            return rest;
        });

        return { items: sanitized, total };
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const user = await this.usersService.findOne(id);
        if (!user) return null;
        const { password_hash, ...rest } = user;
        return rest;
    }
}
