import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AuthService } from './auth.service';


@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @GrpcMethod('AuthService', 'Login')
    async login(data: { username: string; password: string }) {
        return this.authService.loginWithCredentials(data.username, data.password);
    }

    @GrpcMethod('AuthService', 'ValidateToken')
    async validateToken(data: { token: string }) {
        return this.authService.validateToken(data.token);
    }
}