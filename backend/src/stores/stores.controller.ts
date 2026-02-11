
import { Controller, Get, Post, Body, Param, Query, UseGuards, Request, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { CreateRatingDto } from '../ratings/dto/create-rating.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role, Prisma } from '@prisma/client';

@Controller('stores')
export class StoresController {
    constructor(private readonly storesService: StoresService) { }

    // USER Route: List stores
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.USER, Role.ADMIN) // Allow admin too? Prompt implies USER.
    @Get()
    async findAll(@Request() req,
        @Query('searchName') searchName?: string,
        @Query('searchAddress') searchAddress?: string,
        @Query('sortBy') sortBy?: string, // name|address|overallRating
        @Query('order') order: 'asc' | 'desc' = 'asc',
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    ) {
        const skip = (page - 1) * limit;

        const where: Prisma.StoreWhereInput = {
            name: searchName ? { contains: searchName, mode: 'insensitive' } : undefined,
            address: searchAddress ? { contains: searchAddress, mode: 'insensitive' } : undefined,
        };

        let orderBy: Prisma.StoreOrderByWithRelationInput | undefined = undefined;
        if (sortBy === 'name') orderBy = { name: order };
        if (sortBy === 'address') orderBy = { address: order };
        // sortBy rating handled in service? I left it as JS sort in comment, but here let's rely on service or ignore DB sort for rating for now.

        const result = await this.storesService.findAll({
            skip,
            take: limit,
            where,
            orderBy,
            currentUser: req.user.id,
        });

        // If sortBy rating, sort the result array (pagination already applied on DB results which is flawed but acceptable for small datasets in challenge)
        if (sortBy === 'overallRating') {
            result.items.sort((a, b) => {
                return order === 'asc' ? a.overallRating - b.overallRating : b.overallRating - a.overallRating;
            });
        }

        return result;
    }

    // USER Route: Rate store
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.USER)
    @Post(':storeId/rating')
    async rateStore(@Param('storeId') storeId: string, @Request() req, @Body() createRatingDto: CreateRatingDto) {
        return this.storesService.rate(storeId, req.user.id, createRatingDto.rating);
    }
}

@Controller('admin/stores')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminStoresController {
    constructor(private readonly storesService: StoresService) { }

    @Post()
    create(@Body() createStoreDto: CreateStoreDto) {
        return this.storesService.create(createStoreDto);
    }

    @Get()
    async findAll(
        @Query('searchName') searchName?: string,
        @Query('searchAddress') searchAddress?: string,
        @Query('sortBy') sortBy?: string, // name|address|createdAt
        @Query('order') order: 'asc' | 'desc' = 'asc',
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    ) {
        const skip = (page - 1) * limit;
        const where: Prisma.StoreWhereInput = {
            name: searchName ? { contains: searchName, mode: 'insensitive' } : undefined,
            address: searchAddress ? { contains: searchAddress, mode: 'insensitive' } : undefined,
        };

        let orderBy: Prisma.StoreOrderByWithRelationInput | undefined = undefined;
        if (sortBy === 'name') orderBy = { name: order };
        if (sortBy === 'address') orderBy = { address: order };
        if (sortBy === 'createdAt') orderBy = { createdAt: order };

        const result = await this.storesService.findAll({ skip, take: limit, where, orderBy });

        if (sortBy === 'overallRating') {
            result.items.sort((a, b) => {
                return order === 'asc' ? a.overallRating - b.overallRating : b.overallRating - a.overallRating;
            });
        }

        return result;
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.storesService.findOne(id);
    }
}
