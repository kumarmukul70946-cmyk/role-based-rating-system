
import { IsString, IsEmail, IsOptional, MinLength, MaxLength, Matches, IsEnum } from 'class-validator';
import { Role } from '@prisma/client';

export class CreateUserDto {
    @IsString()
    @MinLength(20) // "Name: min 20" per prompt -> wait, prompt says "min 20" for name? "Name: min 20, max 60". That seems very long for a minimum name length (20 chars). Usually it's 2. But the prompt says "min 20". I will follow the prompt strictly but add a comment because it's unusual.
    @MaxLength(60)
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    @MaxLength(16)
    @Matches(/^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/, { message: 'Password must contain at least 1 uppercase letter and 1 special character' })
    password: string;

    @IsString()
    @IsOptional()
    @MaxLength(400)
    address?: string;

    @IsEnum(Role)
    @IsOptional()
    role?: Role; // Defaults to USER in schema/service if not provided
}
