
import { Injectable, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByEmail(email);
        if (!user) return null;

        const isMatch = await bcrypt.compare(pass, user.password_hash);
        if (isMatch) {
            const { password_hash, ...result } = user;
            return result;
        }
        return null;
    }

    async login(loginDto: LoginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const payload = { email: user.email, sub: user.id, role: user.role };
        return {
            accessToken: this.jwtService.sign(payload),
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        };
    }

    async register(createUserDto: CreateUserDto) {
        const existing = await this.usersService.findOneByEmail(createUserDto.email);
        if (existing) {
            throw new ConflictException('Email already exists');
        }

        // Force role to USER for public registration
        const user = await this.usersService.create({
            ...createUserDto,
            role: Role.USER,
        });

        const { password_hash, ...result } = user;
        return result;
    }

    async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
        const user = await this.usersService.findOne(userId); // Assuming findOne by ID
        if (!user) throw new UnauthorizedException();

        const isMatch = await bcrypt.compare(changePasswordDto.oldPassword, user.password_hash);
        if (!isMatch) {
            throw new BadRequestException('Old password is incorrect');
        }

        const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);

        await this.usersService.update(userId, {
            password_hash: hashedPassword,
        });

        return { message: 'Password updated successfully' };
    }
}
