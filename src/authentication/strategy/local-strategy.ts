import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth/auth.service';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
      passReqToCallback: true,
    });
  }

  async validate(req: any, email: string, password: string) {
    const userType = req.body.userType || 'user'
    const user = await this.authService.validateUser(userType,email, password);
    if (user instanceof UnauthorizedException) {
      throw user;
    }
    return user;
  }
}
