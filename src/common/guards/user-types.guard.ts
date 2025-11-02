import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GuardInterface } from './interfaces/guard.interface';
import { UserTypes } from '../enums/user.types';

export const USER_TYPE_KEY = 'user_types';
export const UserTypeAllowed = (...types: UserTypes[]) =>
  SetMetadata(USER_TYPE_KEY, types);

@Injectable()
export class UserTypesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredTypes = this.reflector.getAllAndOverride<UserTypes[]>(
      USER_TYPE_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredTypes) return true;

    const { user } = context.switchToHttp().getRequest<GuardInterface>();

    return requiredTypes.includes(user.userType);
  }
}
