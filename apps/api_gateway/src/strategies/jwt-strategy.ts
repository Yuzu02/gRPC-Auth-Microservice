import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      passReqToCallback: true, 
      secretOrKeyProvider: (request, rawJwtToken, done) => {
        done(null, 'your-secret-key');
      },
    });
  }

  // Modified validate to receive request as first parameter
  async validate(request: any, payload: any) {
    // Extract token from request headers
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
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
