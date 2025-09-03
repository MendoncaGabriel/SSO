import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLE_KEY } from 'src/decorators/role.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.get<string>(ROLE_KEY, context.getHandler());
    if (!requiredRole) return true; // no role required, allow

    const request = context.switchToHttp().getRequest();
    const user = request.user; // comes from JwtStrategy

    if (!user?.roles?.includes(requiredRole)) {
      throw new ForbiddenException('You do not have permission for this action');
    }

    return true;
  }
}
