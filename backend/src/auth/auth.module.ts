
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { RolesGuard } from './roles.guard';

@Module({
    imports: [
        UsersModule,
        PassportModule,
        ConfigModule, // Ensure ConfigService is available
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => {
                const envSecret = configService.get<string>('JWT_SECRET');
                const secret = envSecret || 'dev_insecure_secret_change_me';
                if (!envSecret) {
                    console.warn('JWT_SECRET not set. Using insecure default; set JWT_SECRET in production.');
                }
                return {
                    secret,
                    signOptions: { expiresIn: configService.get<string>('JWT_EXPIRATION') || '1d' },
                };
            },
            inject: [ConfigService],
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, RolesGuard],
    exports: [AuthService],
})
export class AuthModule { }
