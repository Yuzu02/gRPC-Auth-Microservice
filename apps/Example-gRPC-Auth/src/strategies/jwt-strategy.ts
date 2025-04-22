import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'your-secret-key', // En producción, usar variables de entorno
        });
    }

    async validate(payload: any) {
        return {
            userId: payload.sub,
            username: payload.username,
            roles: payload.roles,
            permissions: payload.permissions,
        };
    }
}