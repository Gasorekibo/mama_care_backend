import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLE_KEY } from './role.decorator';
import { UserRole } from 'src/enums/user-role.enum';
import { LOGEDIN_USER } from 'src/constants';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const passedRole = this.reflector.getAllAndOverride<UserRole[]>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const loggedUser = request[LOGEDIN_USER];
    if (!passedRole) {
      return true;
    } else if (!loggedUser) {
      return false;
    }
    return passedRole.some((role) => loggedUser.role === role);
  }
}
