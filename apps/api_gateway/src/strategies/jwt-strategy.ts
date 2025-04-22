import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    options: any;
    constructor(private readonly authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            passReqToCallback: false,
            secretOrKeyProvider: (request, rawJwtToken, done) => {
                // En un entorno real, podrías obtener la clave de un servicio de secretos
                // o un almacenamiento seguro
                done(null, 'your-secret-key');
            },
        });
    }

    async validate(payload: any) {
        // La validación la delegamos al microservicio de autenticación
        // Esto es importante para evitar asumir que el token es válido solo porque
        // la firma sea correcta
        const token = ExtractJwt.fromAuthHeaderAsBearerToken()(this.options.request);
        if (!token) {
            throw new UnauthorizedException('No token provided');
        }
        
        const validation = await this.authService.validateToken(token);

        if (!validation.valid) {
            throw new UnauthorizedException();
        }

        // Devolvemos el usuario para que Passport lo adjunte al objeto request
        return {
            userId: validation.userId,
            roles: validation.roles,
            permissions: validation.permissions,
        };
    }
}