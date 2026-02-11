
import { Controller, Get, UseGuards, Request, NotFoundException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Controller('owner/dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.OWNER)
export class OwnerController {
    constructor(private prisma: PrismaService) { }

    @Get()
    async getDashboard(@Request() req) {
        const ownerId = req.user.id;

        // Find store owned by user
        const store = await this.prisma.store.findFirst({
            where: { ownerUserId: ownerId },
            include: {
                ratings: {
                    include: {
                        user: true, // to get rater details
                    },
                    orderBy: { createdAt: 'desc' },
                },
            },
        });

        if (!store) {
            // Prompt says: "Store owner without store: show friendly empty state"
            // Return null or specifically typed response
            return { store: null, raters: [] };
        }

        const total = store.ratings.reduce((acc, r) => acc + r.rating, 0);
        const averageRating = store.ratings.length > 0 ? total / store.ratings.length : 0;

        const raters = store.ratings.map(r => ({
            userId: r.user.id,
            name: r.user.name,
            email: r.user.email, // Privacy concern? Prompt asks for it: "raters: [{ userId, name, email, address, rating, ratedAt }]"
            address: r.user.address,
            rating: r.rating,
            ratedAt: r.createdAt,
        }));

        return {
            store: {
                id: store.id,
                name: store.name,
                averageRating,
            },
            raters,
        };
    }
}
