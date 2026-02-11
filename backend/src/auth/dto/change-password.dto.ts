
import { IsNotEmpty, IsString, MinLength, Matches, MaxLength } from 'class-validator';

export class ChangePasswordDto {
    @IsNotEmpty()
    @IsString()
    oldPassword: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(16)
    @Matches(/^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/, { message: 'Password must contain at least 1 uppercase letter and 1 special character' })
    newPassword: string;
}
