import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { Roles } from './decorators/roles.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from './decorators/public.decorator';

@Controller('api')
@UseGuards(JwtAuthGuard)
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
  @Public()
  async getPublicData() {
    return {
      message:
        'Estos son datos disponibles para todos los usuarios, incluso sin autenticación',
    };
  }
}
