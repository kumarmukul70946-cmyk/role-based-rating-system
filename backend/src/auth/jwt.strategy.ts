
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(configService: ConfigService) {
        const envSecret = configService.get<string>('JWT_SECRET');
        const secret = envSecret || 'dev_insecure_secret_change_me';
        if (!envSecret) {
            console.warn('JWT_SECRET not set. Using insecure default; set JWT_SECRET in production.');
        }
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: secret,
        });
    }

    async validate(payload: any) {
        return { id: payload.sub, email: payload.email, role: payload.role };
    }
}
