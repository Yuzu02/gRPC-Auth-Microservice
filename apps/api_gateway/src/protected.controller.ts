import { Controller, Get, Request } from '@nestjs/common';
import { Roles } from './decorators/roles.decorator';


@Controller('api')
export class ProtectedController {
    @Get('user-info')
    async getUserInfo(@Request() req) {
        return {
            userId: req.user.userId,
            roles: req.user.roles,
            permissions: req.user.permissions,
        };
    }

    @Get('admin-only')
    @Roles('admin')
    async getAdminData() {
        return { message: 'Este es un endpoint solo para administradores' };
    }

    @Get('public-data')
    async getPublicData() {
        return { message: 'Estos son datos disponibles para usuarios autenticados' };
    }
}