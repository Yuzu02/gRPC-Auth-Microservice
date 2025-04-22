import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) { }

    // Base de datos simulada de usuarios
    private readonly users = [
        {
            userId: '1',
            username: 'admin',
            password: 'admin123',
            roles: ['admin'],
            permissions: ['read:all', 'write:all'],
        },
        {
            userId: '2',
            username: 'user',
            password: 'user123',
            roles: ['user'],
            permissions: ['read:own'],
        },
    ];

    async validateUser(username: string, password: string) {
        const user = this.users.find(
            (u) => u.username === username && u.password === password,
        );
        if (user) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = {
            sub: user.userId,
            username: user.username,
            roles: user.roles,
            permissions: user.permissions,
        };

        return {
            token: this.jwtService.sign(payload),
        };
    }

    async loginWithCredentials(username: string, password: string) {
        const user = await this.validateUser(username, password);
        if (!user) {
            return { token: null };
        }

        return this.login(user);
    }

    async validateToken(token: string) {
        try {
            const payload = this.jwtService.verify(token);
            return {
                valid: true,
                userId: payload.sub,
                roles: payload.roles,
                permissions: payload.permissions,
            };
        } catch (e) {
            console.error('Token validation failed:', e instanceof Error ? e.message : 'Unknown error');
            return {
                valid: false,
                userId: '',
                roles: [],
                permissions: [],
            };
        }
    }
}