import { UserRole } from 'src/enums/user-role.enum';

export interface LoginUser {
  email: string;
  role: UserRole;
  sub: {
    id: number;
  };
}
