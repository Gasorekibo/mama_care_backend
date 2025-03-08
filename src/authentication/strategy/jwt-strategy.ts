import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { LoginUser } from 'src/user/types/loginUserInterface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('TOKEN_SECRET'),
    });
  }

  async validate(payload: any) {
    return {
      sub: { id: payload.sub.id },
      email: payload.email,
      role: payload.role,
      userType: payload.userType,
    };
  }
}
