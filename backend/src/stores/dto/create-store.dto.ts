
import { IsString, IsNotEmpty, MaxLength, IsEmail, IsOptional, IsUUID } from 'class-validator';

export class CreateStoreDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(120)
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(400)
    address: string;

    @IsUUID()
    @IsOptional()
    ownerUserId?: string;
}
