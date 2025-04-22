import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable, firstValueFrom } from 'rxjs';

// Interfaces para gRPC
interface AuthGrpcService {
    login(request: { username: string; password: string }): Observable<{ token: string }>;
    validateToken(request: { token: string }): Observable<ValidateTokenResponse>;
}

export interface ValidateTokenResponse {
    valid: boolean;
    userId: string;
    roles: string[];
    permissions: string[];
}

@Injectable()
export class AuthService implements OnModuleInit {
    private authGrpcService: AuthGrpcService;

    constructor(@Inject('AUTH_SERVICE') private readonly client: ClientGrpc) { }

    onModuleInit() {
        this.authGrpcService = this.client.getService<AuthGrpcService>('AuthService');
    }

    async login(username: string, password: string) {
        try {
            return await firstValueFrom(this.authGrpcService.login({ username, password }));
        } catch (error) {
            console.error('Login failed:', error instanceof Error ? error.message : 'Unknown error');
            return { token: null, error: 'Authentication failed' };
        }
    }

    async validateToken(token: string): Promise<ValidateTokenResponse> {
        try {
            return await firstValueFrom(this.authGrpcService.validateToken({ token }));
        } catch (error) {
            console.error('Error validating token:', error instanceof Error ? error.message : 'Unknown error');
            return {
                valid: false,
                userId: '',
                roles: [],
                permissions: [],
            };
        }
    }
}