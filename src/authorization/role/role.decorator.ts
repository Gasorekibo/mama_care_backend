import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/enums/user-role.enum';

export const ROLE_KEY = 'role';
export const Role = (...args: UserRole[]) => SetMetadata(ROLE_KEY, args);
