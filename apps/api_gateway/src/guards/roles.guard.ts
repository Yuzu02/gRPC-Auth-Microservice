import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();

        if (!user?.roles) {
            throw new ForbiddenException('Usuario no tiene roles definidos');
        }

        const hasRole = requiredRoles.some(role => user.roles.includes(role));

        if (!hasRole) {
            throw new ForbiddenException('No tienes los roles necesarios para acceder a este recurso');
        }

        return true;
    }
}